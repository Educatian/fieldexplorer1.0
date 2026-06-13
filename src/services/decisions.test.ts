import { describe, it, expect, vi, beforeEach } from 'vitest';
import { startSession, setSessionId, markViewStart, getSessionId, logFavorite, logDismiss, logCompare } from './decisions';

// In the test env there are no VITE_SUPABASE_* vars, so the service's supabase
// client is null and logDecision takes the console path: console.log('[DecisionLog]', payload).
// We capture that to verify the decision-capture wiring produces correct EDM data.
function captureDecision(): Promise<any> {
    return new Promise((resolve) => {
        const spy = vi.spyOn(console, 'log').mockImplementation((tag: any, payload?: any) => {
            if (tag === '[DecisionLog]') { spy.mockRestore(); resolve(payload); }
        });
    });
}

describe('decision-capture service', () => {
    beforeEach(() => { startSession(); });

    it('session id is set and shareable', () => {
        const id = startSession();
        expect(id).toBeTruthy();
        setSessionId('shared-session-123');
        expect(getSessionId()).toBe('shared-session-123');
    });

    it('logFavorite emits a favorited decision with numeric decision time', async () => {
        markViewStart();
        const cap = captureDecision();
        await logFavorite('etrd', { page: 'network' });
        const p = await cap;
        expect(p.choice).toBe('favorited');
        expect(p.targetVenueId).toBe('etrd');
        expect(typeof p.time).toBe('number');
        expect(p.time).toBeGreaterThanOrEqual(0);
    });

    it('logDismiss emits a dismissed decision', async () => {
        const cap = captureDecision();
        await logDismiss('jls', { page: 'network' });
        const p = await cap;
        expect(p.choice).toBe('dismissed');
        expect(p.targetVenueId).toBe('jls');
    });

    it('logCompare emits a compared decision (no single target)', async () => {
        const cap = captureDecision();
        await logCompare(['ce', 'bjet'], { page: 'network' });
        const p = await cap;
        expect(p.choice).toBe('compared');
        expect(p.targetVenueId).toBeNull();
    });

    it('decision time grows after a view starts', async () => {
        markViewStart();
        await new Promise((r) => setTimeout(r, 25));
        const cap = captureDecision();
        await logFavorite('li');
        const p = await cap;
        expect(p.time).toBeGreaterThanOrEqual(20);
    });
});
