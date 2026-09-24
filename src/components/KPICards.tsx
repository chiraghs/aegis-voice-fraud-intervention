"use client";

import React from 'react';
import { ActivityIcon, ShieldCheckIcon, ClockIcon } from './Icons';
import { Language } from '@/lib/types';

function TimerIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function KPICards({ language }: { language: Language }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      
      {/* KPI 1: Speed to Contact */}
      <div className="glass-panel rounded-2xl p-4 relative overflow-hidden group hover:border-emerald-500/40 transition">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
            {language === 'ar' ? 'زمن الاستجابة والاتصال' : 'Time-To-Voice Contact'}
          </span>
          <TimerIcon className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl lg:text-3xl font-bold font-mono text-white">32 sec</span>
          <span className="text-xs font-medium text-emerald-400">Target &lt; 45s</span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-2">
          <span>{language === 'ar' ? 'الوضع السابق اليدوي' : 'Manual Baseline (Box D):'}</span>
          <span className="font-mono text-rose-400 font-semibold line-through">42 minutes</span>
        </div>
      </div>

      {/* KPI 2: 15-Minute Resolution Rate */}
      <div className="glass-panel rounded-2xl p-4 relative overflow-hidden group hover:border-emerald-500/40 transition">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-cyan-400">
            {language === 'ar' ? 'معدل إتمام التحقق (15 دقيقة)' : '15-Min Resolution Rate'}
          </span>
          <ShieldCheckIcon className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl lg:text-3xl font-bold font-mono text-white">88.5%</span>
          <span className="text-xs font-medium text-emerald-400">Target &gt; 82%</span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-2">
          <span>{language === 'ar' ? 'الوضع السابق' : 'Baseline (Box D):'}</span>
          <span className="font-mono text-rose-400 font-semibold">18% (4.9x Lift)</span>
        </div>
      </div>

      {/* KPI 3: Loss Prevention Per Incident */}
      <div className="glass-panel rounded-2xl p-4 relative overflow-hidden group hover:border-emerald-500/40 transition">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-amber-400">
            {language === 'ar' ? 'متوسط الخسائر غير المستردة' : 'Avg Unrecovered Loss'}
          </span>
          <ActivityIcon className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl lg:text-3xl font-bold font-mono text-emerald-400">AED 0</span>
          <span className="text-xs font-medium text-emerald-400">Target &lt; AED 350</span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-2">
          <span>{language === 'ar' ? 'الخسارة المعتادة سابقاً' : 'Baseline (Box D):'}</span>
          <span className="font-mono text-rose-400 font-semibold line-through">AED 4,650</span>
        </div>
      </div>

      {/* KPI 4: Total Protected Funds Today */}
      <div className="glass-panel rounded-2xl p-4 relative overflow-hidden group hover:border-emerald-500/40 transition">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-purple-400">
            {language === 'ar' ? 'إجمالي الأموال المحمية اليوم' : 'Total Protected Funds'}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">TODAY</span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl lg:text-3xl font-bold font-mono text-white">AED 18,570</span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-2">
          <span>{language === 'ar' ? 'الحالات المنقذة' : 'Interventions:'}</span>
          <span className="font-mono text-emerald-400 font-semibold">4 / 4 Prevented</span>
        </div>
      </div>

    </div>
  );
}
