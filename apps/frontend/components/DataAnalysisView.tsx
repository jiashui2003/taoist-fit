import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { STRESS_DATA, HRV_DATA } from '../constants';
import { StatCard } from './StatCard';

export const DataAnalysisView = () => {
  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 pt-12 px-4">
      
      {/* Calendar Strip (Mock) */}
      <div className="flex justify-between items-center mb-6 px-2 text-sm text-gray-400">
        {['12', '13', '14', '15', '16', '17', '18'].map((day, idx) => (
          <div key={day} className={`flex flex-col items-center gap-1 ${idx === 3 ? 'text-[#BFA15F]' : ''}`}>
             <span className="text-xs">{['一', '二', '三', '四', '五', '六', '日'][idx]}</span>
             <div className={`w-8 h-8 flex items-center justify-center rounded-full ${idx === 3 ? 'bg-[#BFA15F] text-white shadow-md' : ''}`}>
               {day}
             </div>
          </div>
        ))}
      </div>

      {/* Stress Chart */}
      <div className="bg-[#FDFCF8] rounded-2xl p-4 shadow-sm border border-[#E6E2D0] mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="flex items-center gap-2 font-bold text-[#4A4A4A]">
             <span className="w-1 h-4 bg-[#BFA15F] rounded-full"></span>
             实时压力
          </h3>
          <span className="text-2xl font-bold text-[#BFA15F]">71</span>
        </div>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={STRESS_DATA} barGap={0} barCategoryGap={2}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEE" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#999'}} 
                ticks={['00:00', '06:00', '12:00', '18:00']}
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{backgroundColor: '#FFF', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                cursor={{fill: 'rgba(0,0,0,0.02)'}}
              />
              <ReferenceArea x1="00:00" x2="08:00" fill="#E6E2D0" fillOpacity={0.2} />
              <Bar dataKey="value" fill="#6B8EAD" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* HRV Chart */}
      <div className="bg-[#FDFCF8] rounded-2xl p-4 shadow-sm border border-[#E6E2D0] mb-4">
         <div className="flex justify-between items-center mb-4">
          <h3 className="flex items-center gap-2 font-bold text-[#4A4A4A]">
             <span className="w-1 h-4 bg-[#6B8EAD] rounded-full"></span>
             心率变异性 (HRV)
          </h3>
          <div className="flex items-baseline gap-1">
             <span className="text-2xl font-bold text-[#6B8EAD]">24</span>
             <span className="text-xs text-gray-400">ms</span>
          </div>
        </div>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={HRV_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEE" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#999'}} 
                ticks={['00:00', '06:00', '12:00', '18:00']}
              />
              <YAxis orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6B8EAD" 
                strokeWidth={2} 
                dot={false}
                activeDot={{r: 4, fill: '#6B8EAD', stroke: '#FFF', strokeWidth: 2}}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 gap-4">
         <StatCard label="血氧饱和度" value={96} unit="%" subValue="正常" icon={<div className="w-2 h-2 rounded-full bg-blue-500"/>} />
         <StatCard label="腕部温度" value={36.7} unit="°C" subValue="正常" icon={<div className="w-2 h-2 rounded-full bg-red-400"/>} />
      </div>

    </div>
  );
};
