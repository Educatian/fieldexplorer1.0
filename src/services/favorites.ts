/**
 * Cloud Favorites Service
 * Union merge strategy: local ∪ cloud → upsert to cloud
 */

import { supabase } from './annotations';
import { getVenueByName, getVenueById } from '../data/venues';

// ============================================================================
// LOCAL STORAGE
// ============================================================================

const FAVORITES_KEY = 'fieldexplorer_favorites';

export function getLocalFavorites(): Set<string> {
    try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        return new Set(stored ? JSON.parse(stored) : []);
    } catch {
        return new Set();
    }
}

export function saveLocalFavorites(favorites: Set<string>): void {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
}

// ============================================================================
// CLOUD SYNC (Supabase)
// ============================================================================

async function getUserId(): Promise<string | null> {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
}

/**
 * Fetch favorites from Supabase
 */
export async function fetchCloudFavorites(): Promise<Set<string>> {
    if (!supabase) return new Set();

    const userId = await getUserId();
    if (!userId) return new Set();

    const { data, error } = await supabase
        .from('user_favorites')
        .select('venue_id')
        .eq('user_id', userId);

    if (error) {
        console.error('Failed to fetch cloud favorites:', error);
        return new Set();
    }

    return new Set(data?.map(row => row.venue_id) || []);
}

/**
 * Upsert favorites to Supabase
 */
async function upsertToCloud(venueIds: Set<string>): Promise<boolean> {
    if (!supabase) return false;

    const userId = await getUserId();
    if (!userId) return false;

    // Delete all existing favorites for this user
    await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId);

    // Insert merged favorites
    if (venueIds.size === 0) return true;

    const rows = Array.from(venueIds).map(venueId => ({
        user_id: userId,
        venue_id: venueId
    }));

    const { error } = await supabase
        .from('user_favorites')
        .insert(rows);

    if (error) {
        console.error('Failed to upsert favorites:', error);
        return false;
    }

    return true;
}

// ============================================================================
// SYNC LOGIC (Union Merge)
// ============================================================================

/**
 * Sync favorites using union merge strategy:
 * 1. Fetch cloud favorites
 * 2. Merge with local: local ∪ cloud
 * 3. Upsert merged set to cloud
 * 4. Update local storage
 * 
 * @returns Merged favorites set
 */
export async function syncFavorites(): Promise<Set<string>> {
    const localFavorites = getLocalFavorites();
    const cloudFavorites = await fetchCloudFavorites();

    // Union merge
    const merged = new Set([...localFavorites, ...cloudFavorites]);

    // Sync back to cloud (if there are changes)
    if (merged.size !== cloudFavorites.size ||
        ![...merged].every(id => cloudFavorites.has(id))) {
        await upsertToCloud(merged);
    }

    // Update local
    saveLocalFavorites(merged);

    return merged;
}

// ============================================================================
// SINGLE OPERATIONS
// ============================================================================

/**
 * Add a venue to favorites (local + cloud)
 */
export async function addFavorite(venueId: string): Promise<boolean> {
    const favorites = getLocalFavorites();
    favorites.add(venueId);
    saveLocalFavorites(favorites);

    if (!supabase) return true;

    const userId = await getUserId();
    if (!userId) return true;

    const { error } = await supabase
        .from('user_favorites')
        .upsert({ user_id: userId, venue_id: venueId }, {
            onConflict: 'user_id,venue_id'
        });

    return !error;
}

/**
 * Remove a venue from favorites (local + cloud)
 */
export async function removeFavorite(venueId: string): Promise<boolean> {
    const favorites = getLocalFavorites();
    favorites.delete(venueId);
    saveLocalFavorites(favorites);

    if (!supabase) return true;

    const userId = await getUserId();
    if (!userId) return true;

    const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('venue_id', venueId);

    return !error;
}

/**
 * Check if a venue is favorited
 */
export function isFavorite(venueId: string): boolean {
    return getLocalFavorites().has(venueId);
}

// ============================================================================
// MIGRATION HELPERS
// ============================================================================

/**
 * Convert old name-based favorites to ID-based
 * Call this once during app upgrade
 */
export function migrateNameBasedFavorites(): void {
    const oldFavorites = getLocalFavorites();
    const newFavorites = new Set<string>();

    for (const item of oldFavorites) {
        // Check if it's already an ID
        const venueById = getVenueById(item);
        if (venueById) {
            newFavorites.add(item);
            continue;
        }

        // Try to find by name
        const venueByName = getVenueByName(item);
        if (venueByName) {
            newFavorites.add(venueByName.id);
        }
    }

    saveLocalFavorites(newFavorites);
}
