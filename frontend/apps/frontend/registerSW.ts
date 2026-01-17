import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm('新版本可用，是否立即更新？')) {
            updateSW(true);
        }
    },
    onOfflineReady() {
        console.log('✅ 应用已准备好离线使用');
    },
    onRegistered(registration) {
        console.log('✅ Service Worker 已注册');
        if (registration) {
            // 每小时检查更新
            setInterval(() => {
                registration.update();
            }, 60 * 60 * 1000);
        }
    },
    onRegisterError(error) {
        console.error('❌ Service Worker 注册失败:', error);
    }
});

export { updateSW };
