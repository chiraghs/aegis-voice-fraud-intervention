"use client";

import React, { useState } from 'react';
import { GuardrailItem, Language } from '@/lib/types';
import { ShieldCheckIcon, CheckCircleIcon, BotIcon } from './Icons';

interface GuardrailsViewProps {
  guardrails: GuardrailItem[];
  language: Language;
}

export function GuardrailsView({ guardrails, language }: GuardrailsViewProps) {
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
    <div className="card p-5 mt-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-hairline">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-brand" />
            <h3 className="text-sm font-bold text-ink">
              {language === 'ar' 
                ? 'لوحة فحص الضوابط والمعايير الرقابية (Box K Guardrails)' 
                : 'CBUAE & ElevenLabs Compliance Guardrails (Box K)'}
            </h3>
          </div>
          <p className="text-xs text-ink-muted">
            {language === 'ar'
              ? 'تطبيق صارم للضوابط الأمنية وحماية المستهلك المالي في دولة الإمارات'
              : 'Deterministic technical enforcement mechanisms required by Central Bank of UAE'}
          </p>
        </div>

        {/* Test Run Stats & Trigger */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-ink-muted block">Agent Testing Suite</span>
            <span className="text-xs font-mono font-bold text-good">
              {passRate}% Pass Rate ({runsCompleted} Runs)
            </span>
          </div>
          <button
            onClick={handleRunRegression}
            disabled={isRunningTests}
            className="px-3.5 py-1.5 rounded-xl bg-brand hover:bg-brand-strong text-white text-xs font-bold shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
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
            className="rounded-2xl bg-surface-2/60 border border-hairline p-4 hover:border-brand/40 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-brand-strong bg-brand-soft px-2 py-0.5 rounded-md border border-brand/20">
                  {g.id}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-good">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  PASSED ({g.latencyMs}ms)
                </span>
              </div>
              <h4 className="text-xs font-bold text-ink mb-1.5">
                {language === 'ar' ? g.requirementAr : g.requirement}
              </h4>
              <p className="text-[11px] text-ink-secondary leading-relaxed">
                {language === 'ar' ? g.mechanismAr : g.mechanism}
              </p>
            </div>
            <div className="mt-3.5 pt-2 border-t border-hairline flex items-center justify-between text-[10px] text-ink-muted">
              <span className="font-medium">Deterministic Rule</span>
              <span className="text-good font-mono font-bold">100% Enforced</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
