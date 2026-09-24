"use client";

import React, { useState } from 'react';
import { ShieldCheckIcon, GlobeIcon, ActivityIcon, BotIcon } from './Icons';
import { Language } from '@/lib/types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  activeAlertsCount: number;
}

export function Header({
  language,
  onLanguageChange,
  apiKey,
  onApiKeyChange,
  activeAlertsCount
}: HeaderProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [keyInput, setKeyInput] = useState(apiKey);

  const handleSaveKey = () => {
    onApiKeyChange(keyInput);
    setShowConfig(false);
  };

  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand & Subtext */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
            <ShieldCheckIcon className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                AegisVoice <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">AI DEFENSE</span>
              </span>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">DIFC / CBUAE Compliant</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {language === 'ar' 
                ? 'نظام التدخل الصوتي الفوري لمكافحة الاحتيال المصرفي في الإمارات' 
                : 'Real-Time Voice Fraud Intervention for UAE Retail Banking'}
            </p>
          </div>
        </div>

        {/* Live Status Indicators & Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
          
          {/* Engine Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-white/10 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Eleven v3 + Scribe v2</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-mono">240ms</span>
          </div>

          {/* Active Risk Alerts Counter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>{activeAlertsCount} {language === 'ar' ? 'تنبيهات احتيال نشطة' : 'Active Fraud Alerts'}</span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center rounded-lg bg-slate-900 p-0.5 border border-white/10">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                language === 'en' 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('ar')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                language === 'ar' 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              العربية
            </button>
          </div>

          {/* ElevenLabs API Key Modal Trigger */}
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 transition"
          >
            <BotIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>{apiKey ? 'ElevenLabs Key (Set)' : 'ElevenLabs API'}</span>
          </button>
        </div>
      </div>

      {/* API Key Modal Drawer */}
      {showConfig && (
        <div className="max-w-7xl mx-auto mt-3 p-4 rounded-xl bg-slate-900/95 border border-cyan-500/30 text-xs text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
          <div className="flex items-center gap-2">
            <BotIcon className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="font-semibold text-white">ElevenLabs Platform Configuration</p>
              <p className="text-slate-400 text-[11px]">
                Enter your ElevenLabs API Key for real-time Eleven v3 TTS audio synthesis. If left blank, automatic browser synthesis with native accents will be used.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="password"
              placeholder="xi-api-key..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="bg-slate-950 border border-white/20 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 w-full sm:w-64"
            />
            <button
              onClick={handleSaveKey}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
