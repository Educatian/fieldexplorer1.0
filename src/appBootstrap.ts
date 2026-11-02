import {installModalFocus} from './ui/modalFocus';
import {installToolbarIcons} from './ui/toolbarIcons';
import {installIntroVideo} from './ui/introVideo';

installModalFocus();
installToolbarIcons();
installIntroVideo();
try { document.body.dataset.theme = localStorage.getItem('fieldexplorer_theme') === 'light' ? 'light' : 'dark'; } catch { document.body.dataset.theme = 'dark'; }
document.documentElement.dataset.appState = 'loading';

// Installation/offline setup should not compete with the first map download.
const pwaAfterReady = new MutationObserver(() => {
    if (document.documentElement.dataset.appState !== 'ready') return;
    pwaAfterReady.disconnect();
    const manifest = document.createElement('link');
    manifest.rel = 'manifest'; manifest.href = '/manifest.webmanifest';
    document.head.appendChild(manifest);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
});
pwaAfterReady.observe(document.documentElement, {attributes: true, attributeFilter: ['data-app-state']});

function showFailure() {
    document.documentElement.dataset.appState = 'error';
    const overlay = document.getElementById('loading-overlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    overlay.setAttribute('role','alert');
    const message = document.createElement('p');
    message.textContent = '지도를 불러오지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.';
    const retry = document.createElement('button');
    retry.type = 'button'; retry.className = 'btn'; retry.id = 'retry-app'; retry.textContent = '다시 시도';
    retry.addEventListener('click',()=>location.reload());
    const archive = document.createElement('a');
    archive.href = '/archive/'; archive.className = 'btn'; archive.textContent = '콘텐츠 아카이브 열기';
    overlay.replaceChildren(message,retry,archive); retry.focus();
}

async function bootstrap() { try {
    const [app, graph] = await Promise.all([import('../index'), import('./ui/graphVendor')]);
    await app.startApp(graph);
} catch (error) {
    console.error('FieldExplorer initialization failed',error);
    showFailure();
} }
void bootstrap();
