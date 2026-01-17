import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

interface OfflineBannerProps {
    isOnline: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline }) => {
    const [showBanner, setShowBanner] = React.useState(!isOnline);
    const [hasBeenOffline, setHasBeenOffline] = React.useState(false);

    React.useEffect(() => {
        if (!isOnline) {
            setShowBanner(true);
            setHasBeenOffline(true);
        } else if (hasBeenOffline) {
            // Show "back online" message briefly
            setShowBanner(true);
            const timer = setTimeout(() => setShowBanner(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOnline, hasBeenOffline]);

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`fixed top-0 left-0 right-0 z-[100] py-3 px-4 text-center text-sm font-medium shadow-lg ${isOnline
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                            : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                        }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        {isOnline ? (
                            <>
                                <Wifi size={16} className="animate-pulse" />
                                <span>✅ 网络已恢复</span>
                            </>
                        ) : (
                            <>
                                <WifiOff size={16} className="animate-pulse" />
                                <span>⚠️ 网络断开，当前为离线模式（数据已本地保存）</span>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
