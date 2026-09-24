"use client";

import React, { useState, useEffect } from 'react';
import { CallSession, FraudAlert, Language } from '@/lib/types';
import { PhoneCallIcon, PhoneOffIcon, ShieldCheckIcon, LockClosedIcon, CheckCircleIcon } from './Icons';

interface PhoneSimulatorProps {
  session: CallSession;
  alert: FraudAlert;
  onAcceptCall: () => void;
  onDeclineCall: () => void;
  onApprovePush: () => void;
  onDenyPush: () => void;
  language: Language;
}

export function PhoneSimulator({
  session,
  alert,
  onAcceptCall,
  onDeclineCall,
  onApprovePush,
  onDenyPush,
  language
}: PhoneSimulatorProps) {
  const [timeStr, setTimeStr] = useState('02:15');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const isRinging = session.active && session.transcript.length === 0;
  const isCallActive = session.active && session.transcript.length > 0;
  const isCardFrozen = alert.cardStatus === 'temporary_frozen' || session.cardFreezeExecuted;

  return (
    <div className="flex flex-col items-center">
      
      {/* Device Label */}
      <div className="text-center mb-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
          {language === 'ar' ? 'شاشة هاتف العميل (محاكاة حية)' : 'Customer Handset Simulation'}
        </span>
        <p className="text-xs text-ink font-semibold">
          {language === 'ar' ? alert.customerNameAr : alert.customerName} ({alert.customerPhone})
        </p>
      </div>

      {/* iPhone Device Frame */}
      <div className="w-[300px] sm:w-[320px] h-[610px] bg-slate-900 rounded-[44px] p-3 border-4 border-slate-700/80 shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-black/20">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          <div className="w-2 h-2 rounded-full bg-good animate-pulse" />
        </div>

        {/* Screen Bezel Inside */}
        <div className="w-full h-full bg-surface-2 rounded-[34px] overflow-hidden flex flex-col relative text-ink border border-hairline">
          
          {/* Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-bold text-ink-muted z-20">
            <span>{timeStr}</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* =========================================
              SCREEN STATE 1: INCOMING CALL RINGING
             ========================================= */}
          {isRinging && (
            <div className="absolute inset-0 bg-gradient-to-b from-surface-1 via-surface-2 to-surface-3 z-20 flex flex-col items-center justify-between py-12 px-4 animate-in fade-in duration-300">
              <div className="text-center mt-8">
                <div className="w-20 h-20 rounded-full bg-brand-soft border border-brand/30 flex items-center justify-center mx-auto mb-4 animate-radar text-brand-strong">
                  <ShieldCheckIcon className="w-10 h-10" />
                </div>
                <h3 className="text-base font-extrabold text-ink mb-1">
                  Emirates Bank Fraud Protection
                </h3>
                <p className="text-xs text-brand font-bold flex items-center justify-center gap-1 mb-2">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  <span>CBUAE Verified AI Caller</span>
                </p>
                <p className="text-xs text-ink-muted font-mono">
                  Incoming Voice Call...
                </p>
              </div>

              {/* Call Controls */}
              <div className="w-full flex items-center justify-around px-4">
                <button
                  onClick={onDeclineCall}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-14 h-14 rounded-full bg-critical hover:bg-critical/90 flex items-center justify-center text-white shadow-lg shadow-critical/40 transition">
                    <PhoneOffIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] text-ink-muted font-medium">Decline</span>
                </button>

                <button
                  onClick={onAcceptCall}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-14 h-14 rounded-full bg-good hover:bg-good/90 flex items-center justify-center text-white shadow-lg shadow-good/40 transition animate-bounce">
                    <PhoneCallIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] text-ink font-bold">Answer</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================
              SCREEN STATE 2: ACTIVE ONGOING CALL
             ========================================= */}
          {isCallActive && (
            <div className="absolute inset-0 bg-surface-1 z-10 flex flex-col justify-between py-10 px-4">
              
              {/* Header */}
              <div className="text-center mt-4">
                <div className="w-14 h-14 rounded-full bg-brand-soft border border-brand/30 flex items-center justify-center mx-auto mb-2 text-brand-strong shadow-sm">
                  <ShieldCheckIcon className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-ink">
                  {session.transferredToHuman 
                    ? 'Sara Al-Ghurair (Fraud Officer)' 
                    : 'Emirates Bank AI Protection'}
                </h4>
                <p className="text-xs text-brand font-mono font-bold mt-0.5">
                  00:{session.durationSeconds.toString().padStart(2, '0')} • Encrypted
                </p>
              </div>

              {/* In-Call Push Notification Alert (Zero-Secret Auth) */}
              {session.pushChallengeStatus === 'pending' && (
                <div className="bg-accent-soft border border-accent/40 rounded-2xl p-3 shadow-lg animate-bounce">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                    <span className="text-xs font-extrabold text-accent-strong">
                      Bank Security Challenge
                    </span>
                  </div>
                  <p className="text-[11px] text-ink mb-2 leading-tight font-medium">
                    Did you authorize <strong>AED 3,450</strong> at TechZone London?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={onDenyPush}
                      className="py-1.5 px-2 rounded-xl bg-critical hover:bg-critical/90 text-white text-[11px] font-bold shadow-sm"
                    >
                      No, Block Card!
                    </button>
                    <button
                      onClick={onApprovePush}
                      className="py-1.5 px-2 rounded-xl bg-surface-1 hover:bg-surface-3 text-ink-secondary text-[11px] font-semibold border border-hairline shadow-sm"
                    >
                      Yes, Was Me
                    </button>
                  </div>
                </div>
              )}

              {/* Latest Agent Transcript Bubble */}
              <div className="bg-surface-2 border border-hairline rounded-2xl p-3.5 text-xs text-ink shadow-sm">
                <span className="text-[10px] font-mono uppercase text-brand font-bold block mb-1">
                  Live Agent Voice:
                </span>
                <p className="font-semibold text-ink italic">
                  "{session.transcript[session.transcript.length - 1]?.textEn || 'Agent is listening...'}"
                </p>
              </div>

              {/* Call Controls Bar */}
              <div className="flex items-center justify-around px-2">
                <button
                  onClick={onDeclineCall}
                  className="w-12 h-12 rounded-full bg-critical flex items-center justify-center text-white shadow-lg shadow-critical/30"
                >
                  <PhoneOffIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================
              SCREEN STATE 3: MOBILE BANKING APP VIEW
             ========================================= */}
          {!isRinging && !isCallActive && (
            <div className="flex-1 flex flex-col justify-between p-4 bg-surface-2">
              
              {/* App Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-ink-muted uppercase tracking-wider font-semibold">Emirates NBD Mobile</p>
                    <p className="text-sm font-extrabold text-ink">
                      Welcome, {alert.customerName.split(' ')[0]}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-brand-soft border border-brand/30 flex items-center justify-center text-brand-strong font-extrabold text-xs shadow-sm">
                    {alert.customerName.charAt(0)}
                  </div>
                </div>

                {/* Account Balance Card */}
                <div className="rounded-2xl bg-surface-1 p-4 border border-hairline shadow-sm mb-4">
                  <span className="text-[10px] uppercase text-ink-muted font-bold">Current Account Balance</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xs text-ink-muted font-bold">AED</span>
                    <span className="text-2xl font-extrabold font-mono text-ink">48,250.00</span>
                  </div>
                </div>

                {/* Virtual Card Graphic */}
                <div 
                  className={`rounded-2xl p-4 border transition-all duration-300 relative overflow-hidden text-white shadow-md ${
                    isCardFrozen 
                      ? 'border-critical/40' 
                      : 'border-brand/40'
                  }`}
                  style={{
                    background: isCardFrozen 
                      ? "linear-gradient(135deg, #c05621 0%, #d03b3b 100%)" 
                      : "var(--brand-gradient)"
                  }}
                >
                  <div className="flex items-center justify-between text-xs mb-6">
                    <span className="font-bold tracking-wide">{alert.cardType}</span>
                    {isCardFrozen ? (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white text-critical shadow-sm">
                        <LockClosedIcon className="w-3 h-3" />
                        FROZEN
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-mono tracking-widest text-white/90 mb-2 font-bold">
                    •••• •••• •••• {alert.cardLastFour}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-white/80 font-medium">
                    <span>{alert.customerName.toUpperCase()}</span>
                    <span>EXP 08/29</span>
                  </div>
                </div>
              </div>

              {/* Status Message Footer */}
              <div className="rounded-xl bg-surface-1 p-3 border border-hairline text-[11px] text-ink-muted text-center shadow-sm">
                {isCardFrozen ? (
                  <p className="text-critical font-bold">
                    🛡️ Card frozen by AegisVoice AI. Zero charges allowed.
                  </p>
                ) : (
                  <p className="text-ink-secondary font-medium">
                    Tap "Intervene Now" on the dashboard to test live call.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Home indicator bar */}
          <div className="h-4 pb-1 flex items-center justify-center">
            <div className="w-24 h-1 bg-ink-muted/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
