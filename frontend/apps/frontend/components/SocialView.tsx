import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, GraduationCap, MessageCircle, X, Check, ChevronRight, Sparkles } from 'lucide-react';
import { CultivatorUser, MentorshipStatus, CultivationLevel } from '../types';

interface SocialViewProps {
    cultivators: CultivatorUser[];
    currentLevel: CultivationLevel;
    mentorshipStatus: MentorshipStatus;
    onRequestMentor: (mentorId: string) => void;
}

export const SocialView: React.FC<SocialViewProps> = ({
    cultivators,
    currentLevel,
    mentorshipStatus,
    onRequestMentor,
}) => {
    const [selectedUser, setSelectedUser] = useState<CultivatorUser | null>(null);
    const [showAdvice, setShowAdvice] = useState(false);

    const mentors = cultivators.filter((c) => c.isMentor);
    const fellows = cultivators.filter((c) => !c.isMentor);
    const currentMentor = mentorshipStatus.hasMentor
        ? cultivators.find((c) => c.id === mentorshipStatus.mentorId)
        : null;

    const handleRequestMentor = (mentor: CultivatorUser) => {
        onRequestMentor(mentor.id);
        setSelectedUser(null);
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto pb-24 pt-12 px-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-serif text-[#2C2C2C]">道友圈</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users size={16} />
                    <span>{cultivators.length} 位道友</span>
                </div>
            </div>

            {/* My Mentor Section */}
            {currentMentor ? (
                <div className="bg-gradient-to-r from-[#BFA15F]/10 to-[#9B6B9E]/10 rounded-2xl p-4 mb-6 border border-[#BFA15F]/30">
                    <div className="flex items-center gap-2 mb-3">
                        <GraduationCap size={18} className="text-[#BFA15F]" />
                        <span className="font-bold text-[#4A4A4A]">我的师父</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl">{currentMentor.avatar}</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-[#2C2C2C]">{currentMentor.name}</h3>
                            <p className="text-xs text-gray-500">
                                {currentMentor.stage} 第{currentMentor.layer}层 · {currentMentor.title}
                            </p>
                            <p className="text-xs text-[#BFA15F] mt-1">擅长: {currentMentor.specialty}</p>
                        </div>
                        <button
                            onClick={() => { setSelectedUser(currentMentor); setShowAdvice(true); }}
                            className="bg-[#BFA15F] text-white px-4 py-2 rounded-full text-sm font-medium"
                        >
                            请教
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-[#FDFCF8] rounded-2xl p-4 mb-6 border border-dashed border-[#D4CEB0] text-center">
                    <GraduationCap size={24} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">尚未拜师</p>
                    <p className="text-xs text-gray-300 mt-1">选择一位前辈作为师父，获取修行指导</p>
                </div>
            )}

            {/* Available Mentors */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-[#BFA15F]" />
                    <h3 className="font-bold text-[#4A4A4A]">可拜师前辈</h3>
                </div>
                <div className="space-y-3">
                    {mentors.map((mentor) => (
                        <motion.div
                            key={mentor.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedUser(mentor)}
                            className={`bg-[#FDFCF8] rounded-xl p-3 border shadow-sm cursor-pointer ${mentorshipStatus.mentorId === mentor.id ? 'border-[#BFA15F]' : 'border-[#E6E2D0]'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">{mentor.avatar}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-[#2C2C2C]">{mentor.name}</h4>
                                        <span className="text-[10px] px-2 py-0.5 bg-[#BFA15F]/10 text-[#BFA15F] rounded-full">
                                            {mentor.title}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {mentor.stage} 第{mentor.layer}层 · {mentor.specialty}
                                    </p>
                                </div>
                                <ChevronRight size={18} className="text-gray-300" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Fellow Cultivators */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Users size={16} className="text-[#6B8EAD]" />
                    <h3 className="font-bold text-[#4A4A4A]">同道中人</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {fellows.map((fellow) => (
                        <motion.div
                            key={fellow.id}
                            whileTap={{ scale: 0.98 }}
                            className="bg-[#FDFCF8] rounded-xl p-3 border border-[#E6E2D0] shadow-sm"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{fellow.avatar}</span>
                                <span className="font-medium text-sm text-[#2C2C2C]">{fellow.name}</span>
                            </div>
                            <p className="text-[10px] text-gray-400">
                                {fellow.stage} 第{fellow.layer}层
                            </p>
                            <p className="text-[10px] text-[#6B8EAD]">{fellow.specialty}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* User Detail Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
                        onClick={() => { setSelectedUser(null); setShowAdvice(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#FDFCF8] rounded-2xl p-6 w-full max-w-sm shadow-xl"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl">{selectedUser.avatar}</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2C2C2C]">{selectedUser.name}</h3>
                                        <p className="text-xs text-gray-500">{selectedUser.title}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setSelectedUser(null); setShowAdvice(false); }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="bg-[#F2F0E6] rounded-xl p-3 mb-4">
                                <p className="text-sm text-[#4A4A4A]">
                                    <span className="font-medium">境界:</span> {selectedUser.stage} 第{selectedUser.layer}层
                                </p>
                                <p className="text-sm text-[#4A4A4A]">
                                    <span className="font-medium">专长:</span> {selectedUser.specialty}
                                </p>
                            </div>

                            {showAdvice && selectedUser.advice ? (
                                <div className="bg-[#BFA15F]/10 rounded-xl p-4 mb-4 border border-[#BFA15F]/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageCircle size={14} className="text-[#BFA15F]" />
                                        <span className="text-xs font-medium text-[#BFA15F]">师父教诲</span>
                                    </div>
                                    <p className="text-sm text-[#4A4A4A] leading-relaxed font-serif">
                                        "{selectedUser.advice}"
                                    </p>
                                </div>
                            ) : null}

                            {selectedUser.isMentor && mentorshipStatus.mentorId !== selectedUser.id && (
                                <button
                                    onClick={() => handleRequestMentor(selectedUser)}
                                    className="w-full py-3 rounded-xl font-medium bg-[#2C2C2C] text-white hover:bg-[#4A4A4A] transition-colors"
                                >
                                    <GraduationCap size={16} className="inline mr-2" />
                                    拜师请求
                                </button>
                            )}

                            {mentorshipStatus.mentorId === selectedUser.id && (
                                <div className="text-center text-sm text-[#BFA15F]">
                                    <Check size={14} className="inline mr-1" />
                                    已是您的师父
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
