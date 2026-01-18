import React, { useState } from 'react';
import { X, Download, Share2, Copy, Check } from 'lucide-react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    title: string;
    shareText: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
    isOpen,
    onClose,
    imageUrl,
    title,
    shareText
}) => {
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);

    if (!isOpen) return null;

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `taoist-fit-${title}-${new Date().toISOString().split('T')[0]}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } finally {
            setDownloading(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                // Convert data URL to blob for sharing
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const file = new File([blob], `${title}.png`, { type: 'image/png' });

                await navigator.share({
                    title: `Taoist Fit - ${title}`,
                    text: shareText,
                    files: [file]
                });
            } catch (error) {
                console.log('Share cancelled or not supported');
            }
        } else {
            // Fallback: copy text
            handleCopyText();
        }
    };

    const handleCopyText = async () => {
        try {
            await navigator.clipboard.writeText(shareText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#FDFCF8] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E6E2D0]">
                    <h3 className="font-bold text-[#1A1A1A]">分享修炼成果</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#E6E2D0] rounded-full transition-colors"
                        aria-label="关闭"
                    >
                        <X size={20} className="text-[#3A3A3A]" />
                    </button>
                </div>

                {/* Preview */}
                <div className="p-4">
                    <div className="bg-[#F2F0E6] rounded-xl p-2 mb-4">
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full rounded-lg shadow-md"
                        />
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#9C7D3C] text-white rounded-xl font-bold hover:bg-[#8B6D32] transition-colors disabled:opacity-50"
                        >
                            <Download size={20} />
                            {downloading ? '下载中...' : '保存图片'}
                        </button>

                        {navigator.share && (
                            <button
                                onClick={handleShare}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#2C2C2C] text-white rounded-xl font-bold hover:bg-[#3C3C3C] transition-colors"
                            >
                                <Share2 size={20} />
                                分享到...
                            </button>
                        )}

                        <button
                            onClick={handleCopyText}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-[#D4CEB0] text-[#3A3A3A] rounded-xl font-bold hover:bg-[#F2F0E6] transition-colors"
                        >
                            {copied ? (
                                <>
                                    <Check size={20} className="text-green-600" />
                                    已复制!
                                </>
                            ) : (
                                <>
                                    <Copy size={20} />
                                    复制分享文案
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
