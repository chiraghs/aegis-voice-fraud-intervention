"use client";

import React from 'react';
import { FraudAlert, Language } from '@/lib/types';
import { ShieldAlertIcon, PhoneCallIcon, LockClosedIcon, CheckCircleIcon } from './Icons';

interface FraudFeedProps {
  alerts: FraudAlert[];
  selectedAlertId: string;
  onSelectAlert: (alert: FraudAlert) => void;
  onStartIntervention: (alert: FraudAlert) => void;
  isCalling: boolean;
  language: Language;
}

export function FraudFeed({
  alerts,
  selectedAlertId,
  onSelectAlert,
  onStartIntervention,
  isCalling,
  language
}: FraudFeedProps) {
  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col h-full border border-white/10">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            {language === 'ar' ? 'سجل تنبيهات الاحتيال الفوري' : 'Real-Time Fraud Alerts Stream'}
          </h2>
          <p className="text-xs text-slate-400">
            {language === 'ar' ? 'مصدر الإشارات: محرك فالكون / فيكو البنكي' : 'Signal Source: Falcon / FICO Banking Risk Engine'}
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-white/10">
          {alerts.length} {language === 'ar' ? 'حالات' : 'Signals'}
        </span>
      </div>

      {/* Alert List */}
      <div className="space-y-3 overflow-y-auto pr-1 flex-1 max-h-[580px]">
        {alerts.map((alert) => {
          const isSelected = alert.id === selectedAlertId;
          const isCardFrozen = alert.cardStatus === 'temporary_frozen';

          return (
            <div
              key={alert.id}
              onClick={() => onSelectAlert(alert)}
              className={`rounded-xl p-3.5 transition cursor-pointer border relative overflow-hidden ${
                isSelected 
                  ? 'bg-slate-900/90 border-emerald-500/60 shadow-lg shadow-emerald-500/10' 
                  : 'bg-slate-950/40 border-white/5 hover:border-white/20 hover:bg-slate-900/50'
              }`}
            >
              {/* Top row: ID, Time, Risk Score */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/30">
                    {alert.id}
                  </span>
                  <span className="text-[11px] text-slate-400">{alert.timeAgo}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Risk Score:</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500 text-white">
                    {alert.riskScore}/100
                  </span>
                </div>
              </div>

              {/* Customer & Card Info */}
              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">
                    {language === 'ar' ? alert.customerNameAr : alert.customerName}
                  </p>
                  <span className="text-xs font-mono text-slate-300">
                    {alert.cardType} (•••• {alert.cardLastFour})
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">{alert.customerPhone}</p>
              </div>

              {/* Transaction Highlight */}
              <div className="rounded-lg bg-slate-950/80 p-2.5 border border-white/5 mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-rose-300">
                    {alert.merchantName}
                  </p>
                  <p className="text-[11px] text-slate-400">{alert.merchantLocation} • {alert.merchantCategory}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-rose-400">
                    AED {alert.amountAED.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500">{alert.transactionTime}</p>
                </div>
              </div>

              {/* Risk Factors tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {alert.riskFactors.slice(0, 2).map((factor, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-white/5">
                    {factor}
                  </span>
                ))}
              </div>

              {/* Card Status & Action Button */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {isCardFrozen ? (
                    <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      <LockClosedIcon className="w-3.5 h-3.5" />
                      {language === 'ar' ? 'البطاقة مجمدة مؤقتاً' : 'Card Frozen'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-400">
                      <ShieldAlertIcon className="w-3.5 h-3.5" />
                      {language === 'ar' ? 'عرضة للاحتيال' : 'At Risk'}
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartIntervention(alert);
                  }}
                  disabled={isCalling}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                    isCardFrozen
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                  }`}
                >
                  <PhoneCallIcon className="w-3.5 h-3.5" />
                  <span>
                    {isCalling && isSelected 
                      ? (language === 'ar' ? 'جارٍ الاتصال...' : 'Calling...') 
                      : (language === 'ar' ? 'بدء المكالمة' : 'Intervene Now')}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
