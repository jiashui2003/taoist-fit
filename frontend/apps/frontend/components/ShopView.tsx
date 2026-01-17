import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, BookOpen, Sparkles, X, Check } from 'lucide-react';
import { ShopItem } from '../types';

interface ShopViewProps {
    items: ShopItem[];
    lingQiBalance: number;
    onPurchase: (itemId: string) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({ items, lingQiBalance, onPurchase }) => {
    const [activeTab, setActiveTab] = useState<'baodian' | 'miji'>('baodian');
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
    const [showContent, setShowContent] = useState(false);

    const filteredItems = items.filter((item) => item.category === activeTab);

    const handlePurchase = (item: ShopItem) => {
        if (lingQiBalance >= item.price && !item.owned) {
            onPurchase(item.id);
            setShowContent(true);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto pb-24 pt-12 px-4">
            {/* Header with Balance */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-serif text-[#2C2C2C]">灵气商城</h2>
                <div className="flex items-center gap-2 bg-[#BFA15F]/10 px-4 py-2 rounded-full">
                    <Sparkles size={16} className="text-[#BFA15F]" />
                    <span className="font-mono font-bold text-[#BFA15F]">{lingQiBalance}</span>
                    <span className="text-xs text-[#BFA15F]/70">灵气</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('baodian')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${activeTab === 'baodian'
                            ? 'bg-[#2C2C2C] text-white shadow-lg'
                            : 'bg-[#E6E2D0] text-[#4A4A4A]'
                        }`}
                >
                    <BookOpen size={16} className="inline mr-2" />
                    宝典
                </button>
                <button
                    onClick={() => setActiveTab('miji')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${activeTab === 'miji'
                            ? 'bg-[#2C2C2C] text-white shadow-lg'
                            : 'bg-[#E6E2D0] text-[#4A4A4A]'
                        }`}
                >
                    <Scroll size={16} className="inline mr-2" />
                    秘籍
                </button>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedItem(item)}
                        className={`bg-[#FDFCF8] rounded-2xl p-4 border shadow-sm cursor-pointer transition-all ${item.owned ? 'border-[#BFA15F] bg-[#BFA15F]/5' : 'border-[#E6E2D0]'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            {item.category === 'baodian' ? (
                                <BookOpen size={20} className="text-[#BFA15F]" />
                            ) : (
                                <Scroll size={20} className="text-[#9B6B9E]" />
                            )}
                            {item.owned && <Check size={16} className="text-[#BFA15F]" />}
                        </div>
                        <h3 className="font-bold text-[#2C2C2C] mb-1">{item.name}</h3>
                        <p className="text-xs text-gray-400 mb-3">{item.description}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <Sparkles size={12} className="text-[#BFA15F]" />
                                <span className="text-sm font-mono font-bold text-[#BFA15F]">{item.price}</span>
                            </div>
                            {item.owned ? (
                                <span className="text-xs text-[#BFA15F]">已获得</span>
                            ) : (
                                <span className="text-xs text-gray-400">点击查看</span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Item Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
                        onClick={() => { setSelectedItem(null); setShowContent(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#FDFCF8] rounded-2xl p-6 w-full max-w-sm shadow-xl"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    {selectedItem.category === 'baodian' ? (
                                        <BookOpen size={24} className="text-[#BFA15F]" />
                                    ) : (
                                        <Scroll size={24} className="text-[#9B6B9E]" />
                                    )}
                                    <h3 className="text-xl font-bold text-[#2C2C2C]">{selectedItem.name}</h3>
                                </div>
                                <button
                                    onClick={() => { setSelectedItem(null); setShowContent(false); }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <p className="text-sm text-gray-500 mb-4">{selectedItem.description}</p>

                            {(selectedItem.owned || showContent) ? (
                                <div className="bg-[#F2F0E6] rounded-xl p-4 mb-4 border border-dashed border-[#D4CEB0]">
                                    <p className="text-sm text-[#4A4A4A] leading-relaxed font-serif">
                                        {selectedItem.content}
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-[#F2F0E6] rounded-xl p-4 mb-4 flex items-center justify-center min-h-[100px]">
                                    <p className="text-sm text-gray-400 text-center">兑换后可查看内容</p>
                                </div>
                            )}

                            {!selectedItem.owned && !showContent && (
                                <button
                                    onClick={() => handlePurchase(selectedItem)}
                                    disabled={lingQiBalance < selectedItem.price}
                                    className={`w-full py-3 rounded-xl font-medium transition-all ${lingQiBalance >= selectedItem.price
                                            ? 'bg-[#BFA15F] text-white hover:bg-[#A88B4A]'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Sparkles size={14} className="inline mr-2" />
                                    兑换 ({selectedItem.price} 灵气)
                                </button>
                            )}

                            {(selectedItem.owned || showContent) && (
                                <div className="text-center text-sm text-[#BFA15F]">
                                    <Check size={14} className="inline mr-1" />
                                    已解锁此{selectedItem.category === 'baodian' ? '宝典' : '秘籍'}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
