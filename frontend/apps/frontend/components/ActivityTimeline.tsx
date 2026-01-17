import React from 'react';
import { motion } from 'framer-motion';
import { Footprints, Flame, Brain, Dumbbell } from 'lucide-react';
import { ActivityEntry } from '../types';

interface ActivityTimelineProps {
    activities: ActivityEntry[];
}

const getActivityIcon = (type: ActivityEntry['type']) => {
    switch (type) {
        case 'walk':
            return <Footprints size={14} className="text-[#6B8EAD]" />;
        case 'run':
            return <Flame size={14} className="text-[#C96C6C]" />;
        case 'meditation':
            return <Brain size={14} className="text-[#9B6B9E]" />;
        case 'exercise':
            return <Dumbbell size={14} className="text-[#BFA15F]" />;
        default:
            return <Footprints size={14} className="text-gray-400" />;
    }
};

const getActivityColor = (type: ActivityEntry['type']) => {
    switch (type) {
        case 'walk':
            return 'border-[#6B8EAD]';
        case 'run':
            return 'border-[#C96C6C]';
        case 'meditation':
            return 'border-[#9B6B9E]';
        case 'exercise':
            return 'border-[#BFA15F]';
        default:
            return 'border-gray-300';
    }
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
    return (
        <div className="space-y-3">
            {activities.map((activity, index) => (
                <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className={`flex items-start gap-3 pl-3 border-l-2 ${getActivityColor(activity.type)}`}
                >
                    {/* Timestamp */}
                    <div className="flex items-center gap-2 min-w-[70px]">
                        <span className="text-xs font-mono text-gray-400">{activity.timestamp}</span>
                        {getActivityIcon(activity.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <p className="text-sm text-[#4A4A4A] font-medium">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-gray-400">
                                {activity.caloriesBurned} kcal
                            </span>
                            <span className="text-[10px] text-gray-300">→</span>
                            <span className="text-[10px] text-[#BFA15F] font-medium">
                                +{activity.lingQiGained} 灵气
                            </span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
