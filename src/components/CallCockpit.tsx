"use client";

import React, { useEffect, useRef } from 'react';
import { CallSession, FraudAlert, Language } from '@/lib/types';
import { BotIcon, UserCheckIcon, ShieldCheckIcon, LockClosedIcon, PhoneOffIcon, MicIcon } from './Icons';

interface CallCockpitProps {
  session: CallSession;
  alert: FraudAlert;
  onNextStep: () => void;
  onTriggerCustomerReply: (replyType: 'confirm_fraud' | 'deny_fraud' | 'opt_out') => void;
  onApprovePush: () => void;
  onExecuteFreeze: () => void;
  onHandoverHuman: () => void;
  onEndCall: () => void;
  language: Language;
}

export function CallCockpit({
  session,
  alert,
  onNextStep,
  onTriggerCustomerReply,
  onApprovePush,
  onExecuteFreeze,
  onHandoverHuman,
  onEndCall,
  language
}: CallCockpitProps) {
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.transcript]);

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col h-full border border-white/10">
      
      {/* Top Banner: Call State & Audio Waveform */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${
              session.active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
            }`} />
            <h2 className="text-base font-bold text-white">
              {session.active 
                ? (session.transferredToHuman 
                    ? (language === 'ar' ? 'مكالمة نشطة (تحويل بشري: سارة الغرير)' : 'Live Handover: Sara Al-Ghurair (Human Agent)')
                    : (language === 'ar' ? 'مكالمة صوتية نشطة عبر إيليفن لابس' : 'Active ElevenLabs Voice Intervention'))
                : (language === 'ar' ? 'غرفة التحكم الصوتي' : 'Voice Intervention Cockpit')}
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            {session.active 
              ? `Session: ${session.sessionId} • Caller: ${alert.customerPhone}` 
              : 'Select an alert and initiate call to start intervention'}
          </p>
        </div>

        {session.active && (
          <div className="flex items-center gap-4">
            {/* Audio Waveform visualization */}
            <div className="flex items-center gap-1 h-7 px-3 rounded-lg bg-slate-900 border border-white/10">
              <span className="text-[10px] font-mono text-cyan-400 mr-1">RTP</span>
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full bg-cyan-400 ${
                    session.audioState === 'speaking' || session.audioState === 'listening' 
                      ? 'waveform-bar' 
                      : 'h-1.5'
                  }`}
                />
              ))}
            </div>

            {/* Duration Timer */}
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 font-mono text-xs text-emerald-400 font-semibold border border-white/10">
              {Math.floor(session.durationSeconds / 60)}:{(session.durationSeconds % 60).toString().padStart(2, '0')}
            </div>

            {/* End Call Button */}
            <button
              onClick={onEndCall}
              className="p-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition shadow-md shadow-rose-600/30"
              title="End Call"
            >
              <PhoneOffIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 5-Step Workflow Stepper (Box I from Canvas) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300">
            {language === 'ar' ? 'مسار المحادثة المعتمد (5 خطوات)' : 'Approved 5-Step Workflow Treatment'}
          </span>
          <span className="text-[11px] font-mono text-emerald-400">
            Step {session.currentStep} of 5
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {session.steps.map((st) => {
            const isCurrent = st.step === session.currentStep;
            const isCompleted = st.step < session.currentStep || session.steps[st.step - 1].state === 'completed';

            return (
              <div
                key={st.step}
                className={`rounded-lg p-2 text-center border transition relative ${
                  isCurrent 
                    ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-sm shadow-emerald-500/30' 
                    : isCompleted 
                    ? 'bg-slate-900/60 border-emerald-500/30 text-emerald-400' 
                    : 'bg-slate-950/40 border-white/5 text-slate-500'
                }`}
              >
                <div className="text-[10px] font-mono font-bold">
                  {st.step}. {st.isHumanHandover ? '(H)' : ''}
                </div>
                <div className="text-[11px] font-medium truncate">
                  {language === 'ar' ? st.titleAr : st.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Synchronized Transcript Panel */}
      <div className="flex-1 rounded-xl bg-slate-950/80 border border-white/10 p-4 overflow-y-auto mb-4 min-h-[260px] max-h-[320px] space-y-3">
        {session.transcript.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
            <BotIcon className="w-8 h-8 mb-2 text-slate-600 animate-pulse" />
            <p>{language === 'ar' ? 'المحادثة لم تبدأ بعد. اضغط على زر بدء المكالمة.' : 'Transcript will stream in real-time as the agent speaks.'}</p>
          </div>
        ) : (
          session.transcript.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.speaker === 'agent' ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                {msg.speaker === 'agent' ? (
                  <>
                    <BotIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold text-cyan-400">AegisVoice AI (Eleven v3)</span>
                  </>
                ) : msg.speaker === 'customer' ? (
                  <>
                    <UserCheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-emerald-400">
                      {language === 'ar' ? alert.customerNameAr : alert.customerName}
                    </span>
                  </>
                ) : (
                  <span className="font-mono text-purple-400">System Core</span>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.speaker === 'agent'
                    ? 'bg-slate-900 border border-cyan-500/20 text-slate-100 rounded-tl-sm'
                    : msg.speaker === 'customer'
                    ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-100 rounded-tr-sm'
                    : 'bg-purple-950/40 border border-purple-500/20 text-purple-200'
                }`}
              >
                {/* Bilingual display */}
                <p className="font-medium mb-1">
                  {language === 'ar' ? msg.textAr : msg.textEn}
                </p>
                <p className="text-[10px] text-slate-400 italic border-t border-white/5 pt-1 mt-1">
                  {language === 'ar' ? msg.textEn : msg.textAr}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={transcriptEndRef} />
      </div>

      {/* Interactive Simulation Controls Bar */}
      {session.active && (
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
          
          {/* Agent Advance Button */}
          <button
            onClick={onNextStep}
            disabled={session.currentStep >= 5}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition disabled:opacity-50"
          >
            <MicIcon className="w-4 h-4" />
            <span>
              {language === 'ar' 
                ? `تشغيل الخطوة التالية (${session.currentStep}/5)` 
                : `Deliver Step ${session.currentStep} Script`}
            </span>
          </button>

          {/* Quick Simulation Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {session.currentStep === 2 && (
              <button
                onClick={onApprovePush}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-[11px] font-semibold transition"
              >
                ✓ {language === 'ar' ? 'محاكاة موافقة التطبيق' : 'Simulate In-App Push Approval'}
              </button>
            )}

            {session.currentStep === 3 && (
              <button
                onClick={() => onTriggerCustomerReply('confirm_fraud')}
                className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold transition"
              >
                ⚠️ {language === 'ar' ? 'العميل: "لم أقم بهذه المعاملة"' : 'Customer: "No, that wasn\'t me!"'}
              </button>
            )}

            {session.currentStep === 4 && (
              <button
                onClick={onExecuteFreeze}
                disabled={session.cardFreezeExecuted}
                className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold transition"
              >
                🔒 {session.cardFreezeExecuted 
                      ? (language === 'ar' ? 'تم التجميد المؤقت' : 'Card Frozen via API') 
                      : (language === 'ar' ? 'تنفيذ التجميد المؤقت' : 'Execute Temp Freeze API')}
              </button>
            )}

            {session.currentStep === 5 && (
              <button
                onClick={onHandoverHuman}
                disabled={session.transferredToHuman}
                className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold transition"
              >
                👤 {session.transferredToHuman 
                      ? (language === 'ar' ? 'تم التحويل للموظفة سارة' : 'Handed Over to Sara (H)') 
                      : (language === 'ar' ? 'تحويل لضابط الاحتيال (H)' : 'Trigger Human Handover (H)')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
