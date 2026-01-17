import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, value, unit, subValue, icon, onClick, accentColor = 'text-[#4A4A4A]' 
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-[#FDFCF8] rounded-xl p-4 shadow-sm border border-[#E6E2D0] relative overflow-hidden active:scale-95 transition-transform duration-200 cursor-pointer"
    >
      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex items-center gap-2 mb-1">
          {icon && <span className="text-gray-400">{icon}</span>}
          <span className="text-xs text-gray-500 font-medium">{label}</span>
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold ${accentColor} font-serif`}>
            {value}
          </span>
          {unit && <span className="text-xs text-gray-400">{unit}</span>}
        </div>
        
        {subValue && (
          <div className="text-xs text-gray-400 mt-1">
            {subValue}
          </div>
        )}
      </div>
      
      {/* Ink wash decorative texture */}
      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#F2F0E6] rounded-full opacity-50 blur-xl pointer-events-none"></div>
    </div>
  );
};
