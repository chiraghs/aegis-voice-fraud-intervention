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
      <div className="text-center mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {language === 'ar' ? 'شاشة هاتف العميل (محاكاة حية)' : 'Customer Handset Simulation'}
        </span>
        <p className="text-xs text-slate-300 font-medium">
          {language === 'ar' ? alert.customerNameAr : alert.customerName} ({alert.customerPhone})
        </p>
      </div>

      {/* iPhone Device Frame */}
      <div className="w-[300px] sm:w-[320px] h-[610px] bg-slate-950 rounded-[44px] p-3 border-4 border-slate-700 shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* Screen Bezel Inside */}
        <div className="w-full h-full bg-slate-900 rounded-[34px] overflow-hidden flex flex-col relative text-white">
          
          {/* Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-300 z-20">
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
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black z-20 flex flex-col items-center justify-between py-12 px-4 animate-in fade-in duration-300">
              <div className="text-center mt-8">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-4 animate-radar">
                  <ShieldCheckIcon className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Emirates Bank Fraud Protection
                </h3>
                <p className="text-xs text-emerald-400 font-medium flex items-center justify-center gap-1 mb-2">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  <span>CBUAE Verified AI Caller</span>
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  Incoming Voice Call...
                </p>
              </div>

              {/* Call Controls */}
              <div className="w-full flex items-center justify-around px-4">
                <button
                  onClick={onDeclineCall}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/40 transition">
                    <PhoneOffIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] text-slate-400">Decline</span>
                </button>

                <button
                  onClick={onAcceptCall}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/40 transition animate-bounce">
                    <PhoneCallIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] text-slate-300 font-semibold">Answer</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================
              SCREEN STATE 2: ACTIVE ONGOING CALL
             ========================================= */}
          {isCallActive && (
            <div className="absolute inset-0 bg-slate-950/95 z-10 flex flex-col justify-between py-10 px-4">
              
              {/* Header */}
              <div className="text-center mt-4">
                <div className="w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mx-auto mb-2">
                  <ShieldCheckIcon className="w-7 h-7 text-cyan-400" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  {session.transferredToHuman 
                    ? 'Sara Al-Ghurair (Fraud Officer)' 
                    : 'Emirates Bank AI Protection'}
                </h4>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">
                  00:{session.durationSeconds.toString().padStart(2, '0')} • Encrypted
                </p>
              </div>

              {/* In-Call Push Notification Alert (Zero-Secret Auth) */}
              {session.pushChallengeStatus === 'pending' && (
                <div className="bg-gradient-to-r from-amber-950/90 to-slate-900 border border-amber-500/50 rounded-2xl p-3 shadow-xl animate-bounce">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-xs font-bold text-amber-300">
                      Bank Security Challenge
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-200 mb-2 leading-tight">
                    Did you authorize <strong>AED 3,450</strong> at TechZone London?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={onDenyPush}
                      className="py-1.5 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold shadow"
                    >
                      No, Block Card!
                    </button>
                    <button
                      onClick={onApprovePush}
                      className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
                    >
                      Yes, Was Me
                    </button>
                  </div>
                </div>
              )}

              {/* Latest Agent Transcript Bubble */}
              <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-3.5 text-xs text-slate-200 shadow-inner">
                <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-1">
                  Live Agent Voice:
                </span>
                <p className="font-medium text-slate-100 italic">
                  "{session.transcript[session.transcript.length - 1]?.textEn || 'Agent is listening...'}"
                </p>
              </div>

              {/* Call Controls Bar */}
              <div className="flex items-center justify-around px-2">
                <button
                  onClick={onDeclineCall}
                  className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30"
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
            <div className="flex-1 flex flex-col justify-between p-4 bg-slate-900">
              
              {/* App Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Emirates NBD Mobile</p>
                    <p className="text-sm font-bold text-white">
                      Welcome, {alert.customerName.split(' ')[0]}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    {alert.customerName.charAt(0)}
                  </div>
                </div>

                {/* Account Balance Card */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 p-4 border border-white/10 shadow-lg mb-4">
                  <span className="text-[10px] uppercase text-slate-400 font-medium">Current Account Balance</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xs text-slate-400">AED</span>
                    <span className="text-2xl font-bold font-mono text-white">48,250.00</span>
                  </div>
                </div>

                {/* Virtual Card Graphic */}
                <div className={`rounded-2xl p-4 border transition duration-300 relative overflow-hidden ${
                  isCardFrozen 
                    ? 'bg-gradient-to-br from-rose-950/80 to-slate-950 border-rose-500/50' 
                    : 'bg-gradient-to-br from-emerald-950/70 to-slate-900 border-emerald-500/40'
                }`}>
                  <div className="flex items-center justify-between text-xs mb-6">
                    <span className="font-semibold text-slate-300">{alert.cardType}</span>
                    {isCardFrozen ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                        <LockClosedIcon className="w-3 h-3" />
                        TEMPORARY FROZEN
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-mono tracking-widest text-slate-200 mb-2">
                    •••• •••• •••• {alert.cardLastFour}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{alert.customerName.toUpperCase()}</span>
                    <span>EXP 08/29</span>
                  </div>
                </div>
              </div>

              {/* Status Message Footer */}
              <div className="rounded-xl bg-slate-950/60 p-3 border border-white/5 text-[11px] text-slate-400 text-center">
                {isCardFrozen ? (
                  <p className="text-rose-400 font-medium">
                    🛡️ Card frozen by AegisVoice AI. Zero charges allowed.
                  </p>
                ) : (
                  <p className="text-slate-400">
                    Tap "Intervene Now" on the dashboard to test live call.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Home indicator bar */}
          <div className="h-4 pb-1 flex items-center justify-center">
            <div className="w-24 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
