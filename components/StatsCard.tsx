
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, trend, color = "bg-slate-800" }) => {
  return (
    <div className={`${color} p-6 rounded-xl border border-slate-700 shadow-sm transition-all hover:border-indigo-500`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        <div className="text-indigo-400 p-2 bg-indigo-500/10 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
        {trend && <span className="text-xs text-green-400 font-semibold">{trend}</span>}
      </div>
    </div>
  );
};
