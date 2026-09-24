"use client";

import React from 'react';
import { Language } from '@/lib/types';
import { SmartphoneIcon, BotIcon, Building2 } from './Icons';

export function ArchitectureView({ language }: { language: Language }) {
  return (
    <div className="card p-5 mt-6">
      
      {/* Header */}
      <div className="pb-4 mb-4 border-b border-hairline">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand" />
          {language === 'ar' ? 'البنية التقنية للنظام (Box L Architecture)' : 'System Architecture Across 3 Zones (Box L)'}
        </h3>
        <p className="text-xs text-ink-muted">
          {language === 'ar'
            ? 'مخطط تدفق البيانات، حدود الخصوصية (●)، ونقاط التحويل البشري والتعافي من الأعطال'
            : 'End-to-end data flow, personal data boundaries (●), human approval gate, and failover'}
        </p>
      </div>

      {/* 3-Zone Architecture Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Zone 1: Caller & Channel */}
        <div className="rounded-2xl bg-surface-2/60 border border-hairline p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-hairline">
              <SmartphoneIcon className="w-5 h-5 text-brand" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                Zone 1: Caller &amp; Channel
              </span>
            </div>
            
            <ul className="space-y-2.5 text-xs text-ink-secondary">
              <li className="p-3 rounded-xl bg-surface-1 border border-hairline shadow-sm">
                <span className="font-bold text-ink block mb-0.5">PSTN / VoLTE Mobile Voice</span>
                <span className="text-[11px] text-ink-muted">Sub-second outbound telephony bridge with verified bank caller CLI</span>
              </li>
              <li className="p-3 rounded-xl bg-surface-1 border border-hairline shadow-sm">
                <span className="font-bold text-ink block mb-0.5">Mobile Banking App (Push Token)</span>
                <span className="text-[11px] text-ink-muted">Out-of-band cryptographic prompt; 1-tap approve/deny challenge</span>
              </li>
              <li className="p-3 rounded-xl bg-surface-1 border border-hairline shadow-sm">
                <span className="font-bold text-ink block mb-0.5">Inbound Callback Gateway</span>
                <span className="text-[11px] text-ink-muted">Immediate routing into active session if customer calls bank CLI</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-2 border-t border-hairline flex items-center justify-between text-[10px] text-brand font-mono font-bold">
            <span>RTP Audio Stream</span>
            <span>&lt;--- Bidirectional ---&gt;</span>
          </div>
        </div>

        {/* Zone 2: ElevenLabs Platform */}
        <div className="rounded-2xl bg-brand-soft/30 border border-brand/30 p-4 flex flex-col justify-between relative shadow-sm">
          <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-soft text-brand-strong border border-brand/20">
            ELEVENLABS STACK
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-brand/20">
              <BotIcon className="w-5 h-5 text-brand" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                Zone 2: ElevenLabs Engine
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-ink-secondary">
              <li className="p-3 rounded-xl bg-surface-1 border border-hairline shadow-sm">
                <span className="font-bold text-ink block mb-0.5">Eleven v3 Multilingual TTS</span>
                <span className="text-[11px] text-ink-muted">Conversational Emirati Arabic &amp; UAE English accent rendering</span>
              </li>
              <li className="p-3 rounded-xl bg-surface-1 border border-hairline shadow-sm">
                <span className="font-bold text-ink block mb-0.5">Scribe v2 STT (Keyterm Biased)</span>
                <span className="text-[11px] text-ink-muted">Vocabulary biasing for merchant names, AED currency, card tokens</span>
              </li>
              <li className="p-3 rounded-xl bg-surface-1 border border-hairline shadow-sm">
                <span className="font-bold text-ink block mb-0.5">Agent Workflows (Deterministic FSM)</span>
                <span className="text-[11px] text-ink-muted">Enforces linear steps: Disclosure -&gt; Auth -&gt; Triage -&gt; Freeze -&gt; (H)</span>
              </li>
              <li className="p-3 rounded-xl bg-surface-1 border border-hairline shadow-sm">
                <span className="font-bold text-ink block mb-0.5">Server Webhook Tools &amp; Testing</span>
                <span className="text-[11px] text-ink-muted">Scoped mTLS calls; continuous regression testing suite</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-2 border-t border-brand/20 flex items-center justify-between text-[10px] text-brand font-mono font-bold">
            <span>PII Boundary ●</span>
            <span>Tokenized Relay</span>
          </div>
        </div>

        {/* Zone 3: Institution Core Systems */}
        <div className="rounded-2xl bg-surface-2/60 border border-hairline p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-hairline">
              <Building2 className="w-5 h-5 text-brand" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                Zone 3: Bank Core Systems
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-ink-secondary">
              <li className="p-3 rounded-xl bg-surface-1 border border-hairline shadow-sm">
                <span className="font-bold text-ink block mb-0.5">Falcon / FICO Risk Engine</span>
                <span className="text-[11px] text-ink-muted">Emits real-time fraud alert event triggers within 200ms</span>
              </li>
              <li className="p-3 rounded-xl bg-surface-1 border border-hairline shadow-sm">
                <span className="font-bold text-ink block mb-0.5">Core Banking CMS API</span>
                <span className="text-[11px] text-ink-muted">Idempotent POST /cards/temp-freeze for instant protective block</span>
              </li>
              <li className="p-3 rounded-xl bg-surface-1 border border-hairline shadow-sm">
                <span className="font-bold text-ink block mb-0.5">Human Fraud Desk (H)</span>
                <span className="text-[11px] text-ink-muted">Cisco / Genesys warm SIP transfer for permanent actions and dispute</span>
              </li>
              <li className="p-3 rounded-xl bg-surface-1 border border-hairline shadow-sm">
                <span className="font-bold text-ink block mb-0.5">CBUAE SIEM Audit Archive</span>
                <span className="text-[11px] text-ink-muted">Immutable encrypted storage of audio, transcripts, and disposition</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-2 border-t border-hairline flex items-center justify-between text-[10px] text-brand font-mono font-bold">
            <span>Circuit Breaker Fallback</span>
            <span>Auto Failover &gt; 1200ms</span>
          </div>
        </div>

      </div>
    </div>
  );
}
