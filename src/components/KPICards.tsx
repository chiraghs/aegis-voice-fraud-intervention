"use client";

import React from 'react';
import { ActivityIcon, ShieldCheckIcon } from './Icons';
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
      <div className="card lift p-4.5 relative overflow-hidden group">
        <div className="flex items-center justify-between text-ink-muted mb-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-brand">
            {language === 'ar' ? 'زمن الاستجابة والاتصال' : 'Time-To-Voice Contact'}
          </span>
          <div className="p-1.5 rounded-lg bg-brand-soft text-brand-strong">
            <TimerIcon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-2xl lg:text-3xl font-extrabold font-mono text-ink">32 sec</span>
          <span className="text-xs font-bold text-good">Target &lt; 45s</span>
        </div>
        <div className="text-[11px] text-ink-muted flex items-center justify-between border-t border-hairline pt-2">
          <span>{language === 'ar' ? 'الوضع السابق اليدوي' : 'Manual Baseline (Box D):'}</span>
          <span className="font-mono text-critical font-bold line-through">42 minutes</span>
        </div>
      </div>

      {/* KPI 2: 15-Minute Resolution Rate */}
      <div className="card lift p-4.5 relative overflow-hidden group">
        <div className="flex items-center justify-between text-ink-muted mb-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-brand">
            {language === 'ar' ? 'معدل إتمام التحقق (15 دقيقة)' : '15-Min Resolution Rate'}
          </span>
          <div className="p-1.5 rounded-lg bg-brand-soft text-brand-strong">
            <ShieldCheckIcon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-2xl lg:text-3xl font-extrabold font-mono text-ink">88.5%</span>
          <span className="text-xs font-bold text-good">Target &gt; 82%</span>
        </div>
        <div className="text-[11px] text-ink-muted flex items-center justify-between border-t border-hairline pt-2">
          <span>{language === 'ar' ? 'الوضع السابق' : 'Baseline (Box D):'}</span>
          <span className="font-mono text-critical font-bold">18% (4.9x Lift)</span>
        </div>
      </div>

      {/* KPI 3: Loss Prevention Per Incident */}
      <div className="card lift p-4.5 relative overflow-hidden group">
        <div className="flex items-center justify-between text-ink-muted mb-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-accent-strong">
            {language === 'ar' ? 'متوسط الخسائر غير المستردة' : 'Avg Unrecovered Loss'}
          </span>
          <div className="p-1.5 rounded-lg bg-accent-soft text-accent-strong">
            <ActivityIcon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-2xl lg:text-3xl font-extrabold font-mono text-brand">AED 0</span>
          <span className="text-xs font-bold text-good">Target &lt; AED 350</span>
        </div>
        <div className="text-[11px] text-ink-muted flex items-center justify-between border-t border-hairline pt-2">
          <span>{language === 'ar' ? 'الخسارة المعتادة سابقاً' : 'Baseline (Box D):'}</span>
          <span className="font-mono text-critical font-bold line-through">AED 4,650</span>
        </div>
      </div>

      {/* KPI 4: Total Protected Funds Today */}
      <div className="card lift p-4.5 relative overflow-hidden group">
        <div className="flex items-center justify-between text-ink-muted mb-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-brand">
            {language === 'ar' ? 'إجمالي الأموال المحمية اليوم' : 'Total Protected Funds'}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-soft text-brand-strong font-mono font-bold">
            TODAY
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-2xl lg:text-3xl font-extrabold font-mono text-ink">AED 18,570</span>
        </div>
        <div className="text-[11px] text-ink-muted flex items-center justify-between border-t border-hairline pt-2">
          <span>{language === 'ar' ? 'الحالات المنقذة' : 'Interventions:'}</span>
          <span className="font-mono text-brand font-bold">4 / 4 Prevented</span>
        </div>
      </div>

    </div>
  );
}
