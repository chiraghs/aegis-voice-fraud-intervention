"use client";

import React from 'react';
import { FraudAlert, Language } from '@/lib/types';
import { ShieldAlertIcon, PhoneCallIcon, LockClosedIcon } from './Icons';

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
    <div className="card p-5 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-hairline">
        <div>
          <h2 className="text-sm font-bold text-ink flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-critical animate-ping" />
            {language === 'ar' ? 'سجل تنبيهات الاحتيال الفوري' : 'Real-Time Fraud Alerts Stream'}
          </h2>
          <p className="text-xs text-ink-muted">
            {language === 'ar' ? 'مصدر الإشارات: محرك فالكون / فيكو البنكي' : 'Signal Source: Falcon / FICO Banking Risk Engine'}
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-surface-2 text-ink-secondary border border-hairline">
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
              className={`rounded-2xl p-4 transition-all cursor-pointer border relative overflow-hidden ${
                isSelected 
                  ? 'bg-brand-soft/50 border-brand shadow-sm ring-1 ring-brand/30' 
                  : 'bg-surface-2/60 border-hairline hover:border-brand/40 hover:bg-surface-2'
              }`}
            >
              {/* Top row: ID, Time, Risk Score */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-critical bg-critical/10 px-2 py-0.5 rounded-md border border-critical/20">
                    {alert.id}
                  </span>
                  <span className="text-[11px] text-ink-muted font-medium">{alert.timeAgo}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-ink-muted">Risk:</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-critical text-white shadow-sm">
                    {alert.riskScore}/100
                  </span>
                </div>
              </div>

              {/* Customer & Card Info */}
              <div className="mb-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-ink">
                    {language === 'ar' ? alert.customerNameAr : alert.customerName}
                  </p>
                  <span className="text-xs font-mono font-semibold text-ink-secondary">
                    {alert.cardType} (•••• {alert.cardLastFour})
                  </span>
                </div>
                <p className="text-xs text-ink-muted font-mono">{alert.customerPhone}</p>
              </div>

              {/* Transaction Highlight */}
              <div className="rounded-xl bg-surface-1 p-3 border border-hairline mb-3 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold text-ink">
                    {alert.merchantName}
                  </p>
                  <p className="text-[11px] text-ink-muted">{alert.merchantLocation} • {alert.merchantCategory}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-extrabold text-critical">
                    AED {alert.amountAED.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-ink-muted">{alert.transactionTime}</p>
                </div>
              </div>

              {/* Risk Factors tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {alert.riskFactors.slice(0, 2).map((factor, idx) => (
                  <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-surface-1 text-ink-secondary border border-hairline">
                    {factor}
                  </span>
                ))}
              </div>

              {/* Card Status & Action Button */}
              <div className="flex items-center justify-between pt-2 border-t border-hairline">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {isCardFrozen ? (
                    <span className="flex items-center gap-1 text-brand-strong bg-brand-soft px-2.5 py-0.5 rounded-full border border-brand/20">
                      <LockClosedIcon className="w-3.5 h-3.5" />
                      {language === 'ar' ? 'مجمدة مؤقتاً' : 'Card Frozen'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-serious">
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
                  className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl transition shadow-sm ${
                    isCardFrozen
                      ? 'bg-surface-3 hover:bg-hairline text-ink-secondary'
                      : 'bg-brand hover:bg-brand-strong text-white'
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
