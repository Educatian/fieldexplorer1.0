import type {Plugin} from 'vite';

/** Discover the two critical dynamic chunks before the small retry shell executes. */
export function startupPreload(): Plugin {
    return {
        name: 'fieldexplorer-startup-preload',
        apply: 'build',
        transformIndexHtml: {
            order: 'post',
            handler(_html, context) {
                if (!context.filename.replace(/\\/g, '/').endsWith('/app.html') || !context.bundle) return;
                const bundle = context.bundle;
                const files = new Set<string>();
                const visit = (name: string) => {
                    const chunk = bundle[name];
                    if (!chunk || chunk.type !== 'chunk' || files.has(name)) return;
                    files.add(name);
                    chunk.imports.forEach(visit);
                };
                for (const chunk of Object.values(bundle)) {
                    if (chunk.type === 'chunk' && Object.keys(chunk.modules).some(id => /\/(?:index\.tsx|src\/ui\/graphVendor\.ts)$/.test(id.replace(/\\/g, '/')))) visit(chunk.fileName);
                }
                // Dynamic imports (PDF/image export) remain deferred until requested.
                return [...files].map(file => ({tag: 'link', attrs: {rel: 'modulepreload', crossorigin: '', href: '/' + file}, injectTo: 'head-prepend' as const}));
            },
        },
    };
}
