"use client";

import React from 'react';
import { Language } from '@/lib/types';
import { SmartphoneIcon, BotIcon, Building2, ShieldCheckIcon } from './Icons';

export function ArchitectureView({ language }: { language: Language }) {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 mt-6">
      
      {/* Header */}
      <div className="pb-4 mb-4 border-b border-white/10">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          {language === 'ar' ? 'البنية التقنية للنظام (Box L Architecture)' : 'System Architecture Across 3 Zones (Box L)'}
        </h3>
        <p className="text-xs text-slate-400">
          {language === 'ar'
            ? 'مخطط تدفق البيانات، حدود الخصوصية (●)، ونقاط التحويل البشري والتعافي من الأعطال'
            : 'End-to-end data flow, personal data boundaries (●), human approval gate, and failover'}
        </p>
      </div>

      {/* 3-Zone Architecture Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Zone 1: Caller & Channel */}
        <div className="rounded-xl bg-slate-950/80 border border-emerald-500/30 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
              <SmartphoneIcon className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Zone 1: Caller &amp; Channel
              </span>
            </div>
            
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                <span className="font-semibold text-white block mb-0.5">PSTN / VoLTE Mobile Voice</span>
                <span className="text-[11px] text-slate-400">Sub-second outbound telephony bridge with verified bank caller CLI</span>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                <span className="font-semibold text-white block mb-0.5">Mobile Banking App (Push Token)</span>
                <span className="text-[11px] text-slate-400">Out-of-band cryptographic prompt; 1-tap approve/deny challenge</span>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                <span className="font-semibold text-white block mb-0.5">Inbound Callback Gateway</span>
                <span className="text-[11px] text-slate-400">Immediate routing into active session if customer calls bank CLI</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-emerald-400 font-mono">
            <span>RTP Audio Stream</span>
            <span>&lt;--- Bidirectional ---&gt;</span>
          </div>
        </div>

        {/* Zone 2: ElevenLabs Platform */}
        <div className="rounded-xl bg-slate-950/80 border border-cyan-500/40 p-4 flex flex-col justify-between relative shadow-lg shadow-cyan-500/5">
          <div className="absolute top-2 right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            ELEVENLABS STACK
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
              <BotIcon className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Zone 2: ElevenLabs Engine
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                <span className="font-semibold text-white block mb-0.5">Eleven v3 Multilingual TTS</span>
                <span className="text-[11px] text-slate-400">Conversational Emirati Arabic &amp; UAE English accent rendering</span>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                <span className="font-semibold text-white block mb-0.5">Scribe v2 STT (Keyterm Biased)</span>
                <span className="text-[11px] text-slate-400">Vocabulary biasing for merchant names, AED currency, card tokens</span>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                <span className="font-semibold text-white block mb-0.5">Agent Workflows (Deterministic FSM)</span>
                <span className="text-[11px] text-slate-400">Enforces linear steps: Disclosure -&gt; Auth -&gt; Triage -&gt; Freeze -&gt; (H)</span>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                <span className="font-semibold text-white block mb-0.5">Server Webhook Tools &amp; Testing</span>
                <span className="text-[11px] text-slate-400">Scoped mTLS calls; continuous regression testing suite</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-cyan-400 font-mono">
            <span>PII Boundary ●</span>
            <span>Tokenized Relay</span>
          </div>
        </div>

        {/* Zone 3: Institution Core Systems */}
        <div className="rounded-xl bg-slate-950/80 border border-purple-500/30 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
              <Building2 className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Zone 3: Bank Core Systems
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                <span className="font-semibold text-white block mb-0.5">Falcon / FICO Risk Engine</span>
                <span className="text-[11px] text-slate-400">Emits real-time fraud alert event triggers within 200ms</span>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                <span className="font-semibold text-white block mb-0.5">Core Banking CMS API</span>
                <span className="text-[11px] text-slate-400">Idempotent POST /cards/temp-freeze for instant protective block</span>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                <span className="font-semibold text-white block mb-0.5">Human Fraud Desk (H)</span>
                <span className="text-[11px] text-slate-400">Cisco / Genesys warm SIP transfer for permanent actions and dispute</span>
              </li>
              <li className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                <span className="font-semibold text-white block mb-0.5">CBUAE SIEM Audit Archive</span>
                <span className="text-[11px] text-slate-400">Immutable encrypted storage of audio, transcripts, and disposition</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-purple-400 font-mono">
            <span>Circuit Breaker Fallback</span>
            <span>Auto Failover &gt; 1200ms</span>
          </div>
        </div>

      </div>
    </div>
  );
}
