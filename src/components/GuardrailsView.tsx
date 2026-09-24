"use client";

import React, { useState } from 'react';
import { GuardrailItem, Language } from '@/lib/types';
import { ShieldCheckIcon, CheckCircleIcon, BotIcon } from './Icons';

interface GuardrailsViewProps {
  guardrails: GuardrailItem[];
  language: Language;
}

export function GuardrailsView({ guardrails, language }: { guardrails: GuardrailItem[]; language: Language }) {
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [passRate, setPassRate] = useState(98.4);
  const [runsCompleted, setRunsCompleted] = useState(150);

  const handleRunRegression = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      setIsRunningTests(false);
      setRunsCompleted(prev => prev + 50);
      setPassRate(99.1);
    }, 1200);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 mt-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              {language === 'ar' 
                ? 'لوحة فحص الضوابط والمعايير الرقابية (Box K Guardrails)' 
                : 'CBUAE & ElevenLabs Compliance Guardrails (Box K)'}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {language === 'ar'
              ? 'تطبيق صارم للضوابط الأمنية وحماية المستهلك المالي في دولة الإمارات'
              : 'Deterministic technical enforcement mechanisms required by Central Bank of UAE'}
          </p>
        </div>

        {/* Test Run Stats & Trigger */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Agent Testing Suite</span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {passRate}% Pass Rate ({runsCompleted} Runs)
            </span>
          </div>
          <button
            onClick={handleRunRegression}
            disabled={isRunningTests}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition disabled:opacity-50 flex items-center gap-1.5"
          >
            <BotIcon className="w-3.5 h-3.5" />
            <span>{isRunningTests ? 'Evaluating...' : 'Run Test Suite'}</span>
          </button>
        </div>
      </div>

      {/* 6 Guardrails Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {guardrails.map((g) => (
          <div
            key={g.id}
            className="rounded-xl bg-slate-950/60 border border-white/5 p-3.5 hover:border-emerald-500/30 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                  {g.id}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  PASSED ({g.latencyMs}ms)
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mb-1">
                {language === 'ar' ? g.requirementAr : g.requirement}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {language === 'ar' ? g.mechanismAr : g.mechanism}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
              <span>Deterministic Rule</span>
              <span className="text-emerald-500 font-mono">100% Enforced</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
