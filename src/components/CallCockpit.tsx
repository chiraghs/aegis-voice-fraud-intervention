"use client";

import React, { useEffect, useRef } from 'react';
import { CallSession, FraudAlert, Language } from '@/lib/types';
import { BotIcon, UserCheckIcon, ShieldCheckIcon, PhoneOffIcon, MicIcon } from './Icons';

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
    <div className="card p-5 flex flex-col h-full">
      
      {/* Top Banner: Call State & Audio Waveform */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-hairline">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${
              session.active ? 'bg-good animate-pulse' : 'bg-ink-muted'
            }`} />
            <h2 className="text-sm font-bold text-ink">
              {session.active 
                ? (session.transferredToHuman 
                    ? (language === 'ar' ? 'مكالمة نشطة (تحويل بشري: سارة الغرير)' : 'Live Handover: Sara Al-Ghurair (Human Officer)')
                    : (language === 'ar' ? 'مكالمة صوتية نشطة عبر إيليفن لابس' : 'Active ElevenLabs Voice Intervention'))
                : (language === 'ar' ? 'غرفة التحكم الصوتي' : 'Voice Intervention Cockpit')}
            </h2>
          </div>
          <p className="text-xs text-ink-muted font-mono">
            {session.active 
              ? `Session: ${session.sessionId} • Caller: ${alert.customerPhone}` 
              : 'Select an alert and initiate call to start intervention'}
          </p>
        </div>

        {session.active && (
          <div className="flex items-center gap-3">
            {/* Audio Waveform visualization */}
            <div className="flex items-center gap-1 h-7 px-3 rounded-xl bg-surface-2 border border-hairline">
              <span className="text-[10px] font-mono text-brand font-bold mr-1">RTP</span>
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full bg-brand ${
                    session.audioState === 'speaking' || session.audioState === 'listening' 
                      ? 'waveform-bar' 
                      : 'h-1.5'
                  }`}
                />
              ))}
            </div>

            {/* Duration Timer */}
            <div className="px-3 py-1 rounded-xl bg-surface-2 font-mono text-xs text-brand-strong font-bold border border-hairline">
              {Math.floor(session.durationSeconds / 60)}:{(session.durationSeconds % 60).toString().padStart(2, '0')}
            </div>

            {/* End Call Button */}
            <button
              onClick={onEndCall}
              className="p-2 rounded-xl bg-critical hover:bg-critical/90 text-white transition shadow-sm"
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
          <span className="text-xs font-bold text-ink">
            {language === 'ar' ? 'مسار المحادثة المعتمد (5 خطوات)' : 'Approved 5-Step Workflow Treatment'}
          </span>
          <span className="text-[11px] font-mono font-bold text-brand">
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
                className={`rounded-xl p-2 text-center border transition-all ${
                  isCurrent 
                    ? 'bg-brand-soft border-brand text-brand-strong shadow-sm font-bold ring-1 ring-brand/30' 
                    : isCompleted 
                    ? 'bg-surface-2 border-brand/30 text-brand font-semibold' 
                    : 'bg-surface-2/60 border-hairline text-ink-muted'
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
      <div className="flex-1 rounded-2xl bg-surface-2/60 border border-hairline p-4 overflow-y-auto mb-4 min-h-[260px] max-h-[320px] space-y-3">
        {session.transcript.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-ink-muted text-xs">
            <BotIcon className="w-8 h-8 mb-2 text-brand animate-pulse" />
            <p className="font-medium">
              {language === 'ar' ? 'المحادثة لم تبدأ بعد. اضغط على زر بدء المكالمة.' : 'Transcript will stream in real-time as the agent speaks.'}
            </p>
          </div>
        ) : (
          session.transcript.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.speaker === 'agent' ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-ink-muted mb-1">
                {msg.speaker === 'agent' ? (
                  <>
                    <BotIcon className="w-3.5 h-3.5 text-brand" />
                    <span className="font-bold text-brand">AegisVoice AI (Eleven v3)</span>
                  </>
                ) : msg.speaker === 'customer' ? (
                  <>
                    <UserCheckIcon className="w-3.5 h-3.5 text-accent-strong" />
                    <span className="font-bold text-accent-strong">
                      {language === 'ar' ? alert.customerNameAr : alert.customerName}
                    </span>
                  </>
                ) : (
                  <span className="font-mono text-ink font-semibold">Core Banking System</span>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                  msg.speaker === 'agent'
                    ? 'bg-surface-1 border border-brand/20 text-ink rounded-tl-sm'
                    : msg.speaker === 'customer'
                    ? 'bg-accent-soft border border-accent/30 text-ink rounded-tr-sm'
                    : 'bg-surface-3 border border-hairline text-ink-secondary'
                }`}
              >
                {/* Bilingual display */}
                <p className="font-semibold mb-1">
                  {language === 'ar' ? msg.textAr : msg.textEn}
                </p>
                <p className="text-[10px] text-ink-muted italic border-t border-hairline pt-1 mt-1">
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
        <div className="pt-2 border-t border-hairline flex flex-wrap items-center justify-between gap-2">
          
          {/* Agent Advance Button */}
          <button
            onClick={onNextStep}
            disabled={session.currentStep >= 5}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand hover:bg-brand-strong text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
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
                className="px-3 py-1.5 rounded-xl bg-brand hover:bg-brand-strong text-white text-[11px] font-bold shadow-sm transition"
              >
                ✓ {language === 'ar' ? 'محاكاة موافقة التطبيق' : 'Simulate In-App Push Approval'}
              </button>
            )}

            {session.currentStep === 3 && (
              <button
                onClick={() => onTriggerCustomerReply('confirm_fraud')}
                className="px-3 py-1.5 rounded-xl bg-critical hover:bg-critical/90 text-white text-[11px] font-bold shadow-sm transition"
              >
                ⚠️ {language === 'ar' ? 'العميل: "لم أقم بهذه المعاملة"' : 'Customer: "No, that wasn\'t me!"'}
              </button>
            )}

            {session.currentStep === 4 && (
              <button
                onClick={onExecuteFreeze}
                disabled={session.cardFreezeExecuted}
                className="px-3 py-1.5 rounded-xl bg-accent hover:bg-accent-strong text-white text-[11px] font-bold shadow-sm transition"
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
                className="px-3 py-1.5 rounded-xl bg-brand-strong hover:bg-brand text-white text-[11px] font-bold shadow-sm transition"
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
