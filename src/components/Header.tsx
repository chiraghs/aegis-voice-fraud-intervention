"use client";

import React, { useState } from 'react';
import { ShieldCheckIcon, BotIcon, SunIcon, MoonIcon } from './Icons';
import { useTheme } from './ThemeProvider';
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
  const { theme, toggle } = useTheme();
  const [showConfig, setShowConfig] = useState(false);
  const [keyInput, setKeyInput] = useState(apiKey);

  const handleSaveKey = () => {
    onApiKeyChange(keyInput);
    setShowConfig(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-surface-1/90 backdrop-blur-md px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand & Subtext */}
        <div className="flex items-center gap-3.5">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md text-white transition-transform hover:scale-105"
            style={{ background: "var(--brand-gradient)" }}
          >
            <ShieldCheckIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-ink flex items-center gap-2">
                AegisVoice <span className="text-xs px-2 py-0.5 rounded-full bg-brand-soft text-brand-strong font-bold border border-brand/20">AI DEFENSE</span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted hidden sm:inline-block">
                DIFC · CBUAE Regulated
              </span>
            </div>
            <p className="text-xs text-ink-secondary font-medium">
              {language === 'ar' 
                ? 'نظام التدخل الصوتي الفوري لمكافحة الاحتيال المصرفي في الإمارات' 
                : 'Real-Time Voice Fraud Intervention for UAE Retail Banking'}
            </p>
          </div>
        </div>

        {/* Live Status Indicators & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Engine Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-2 border border-hairline text-xs">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <span className="text-ink font-medium">Eleven v3 + Scribe v2</span>
            <span className="text-ink-muted">|</span>
            <span className="text-brand font-mono font-bold">240ms</span>
          </div>

          {/* Active Risk Alerts Counter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent-soft border border-accent/30 text-xs text-accent-strong font-bold">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>{activeAlertsCount} {language === 'ar' ? 'تنبيهات احتيال' : 'Active Signals'}</span>
          </div>

          {/* Theme Toggle Button (Light / Dark) */}
          <button
            onClick={toggle}
            aria-label="Toggle color theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-hairline bg-surface-2 text-ink-secondary transition hover:border-accent/60 hover:text-accent shadow-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === "dark" ? <SunIcon className="w-4 h-4 text-accent" /> : <MoonIcon className="w-4 h-4 text-ink-secondary" />}
          </button>

          {/* Language Switcher */}
          <div className="flex items-center rounded-xl bg-surface-2 p-0.5 border border-hairline">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                language === 'en' 
                  ? 'bg-brand text-white shadow-sm' 
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('ar')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                language === 'ar' 
                  ? 'bg-brand text-white shadow-sm' 
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              عربي
            </button>
          </div>

          {/* ElevenLabs API Key Modal Trigger */}
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 hover:bg-surface-3 text-ink text-xs font-semibold border border-hairline transition shadow-sm"
          >
            <BotIcon className="w-3.5 h-3.5 text-brand" />
            <span className="hidden sm:inline">{apiKey ? 'API Key (Set)' : 'ElevenLabs API'}</span>
          </button>
        </div>
      </div>

      {/* API Key Modal Drawer */}
      {showConfig && (
        <div className="max-w-7xl mx-auto mt-3 p-4 rounded-2xl bg-surface-1 border border-brand/30 text-xs text-ink flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <BotIcon className="w-5 h-5 text-brand" />
            <div>
              <p className="font-bold text-ink">ElevenLabs Platform Configuration</p>
              <p className="text-ink-muted text-[11px]">
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
              className="bg-surface-2 border border-hairline rounded-xl px-3 py-1.5 text-ink font-mono text-xs focus:outline-none focus:border-brand w-full sm:w-64"
            />
            <button
              onClick={handleSaveKey}
              className="px-3.5 py-1.5 rounded-xl bg-brand hover:bg-brand-strong text-white font-bold transition shadow-sm"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
