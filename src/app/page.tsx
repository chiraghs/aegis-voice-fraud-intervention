"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { KPICards } from '@/components/KPICards';
import { FraudFeed } from '@/components/FraudFeed';
import { CallCockpit } from '@/components/CallCockpit';
import { PhoneSimulator } from '@/components/PhoneSimulator';
import { GuardrailsView } from '@/components/GuardrailsView';
import { ArchitectureView } from '@/components/ArchitectureView';
import { 
  INITIAL_ALERTS, 
  INITIAL_GUARDRAILS, 
  getInitialCallSession 
} from '@/lib/fraudStore';
import { FraudAlert, CallSession, Language } from '@/lib/types';
import { speakText, DEFAULT_CONFIG } from '@/lib/elevenLabsService';

export default function Home() {
  const [alerts, setAlerts] = useState<FraudAlert[]>(INITIAL_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert>(INITIAL_ALERTS[0]);
  const [session, setSession] = useState<CallSession>(getInitialCallSession(INITIAL_ALERTS[0]));
  const [language, setLanguage] = useState<Language>('en');
  const [apiKey, setApiKey] = useState<string>(DEFAULT_CONFIG.apiKey || '');
  const [activeTab, setActiveTab] = useState<'console' | 'guardrails' | 'architecture'>('console');

  // Timer effect for active calls
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (session.active) {
      timer = setInterval(() => {
        setSession(prev => ({
          ...prev,
          durationSeconds: prev.durationSeconds + 1
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [session.active]);

  // Start Voice Intervention Call
  const handleStartIntervention = (alert: FraudAlert) => {
    setSelectedAlert(alert);
    const newSession = getInitialCallSession(alert, language);
    newSession.active = true;
    newSession.startTime = Date.now();
    newSession.audioState = 'ringing';
    setSession(newSession);

    // Update alert status
    setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, status: 'calling' } : a));
  };

  // Customer Answers Phone Call
  const handleAcceptCall = async () => {
    setSession(prev => ({
      ...prev,
      audioState: 'speaking'
    }));

    // Step 1: Deliver Opening AI Disclosure (Canvas Box I Step 1)
    await deliverWorkflowStep(1);
  };

  // Deliver a specific workflow step
  const deliverWorkflowStep = async (stepNum: 1 | 2 | 3 | 4 | 5) => {
    const stepDef = session.steps[stepNum - 1];
    const textEn = stepDef.scriptSnippetEn;
    const textAr = stepDef.scriptSnippetAr;
    const textToSpeak = language === 'ar' ? textAr : textEn;

    // Add agent message to transcript
    const msgId = `MSG-${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setSession(prev => ({
      ...prev,
      currentStep: stepNum,
      audioState: 'speaking',
      transcript: [
        ...prev.transcript,
        {
          id: msgId,
          speaker: 'agent',
          textEn,
          textAr,
          timestamp: nowTime
        }
      ],
      steps: prev.steps.map(s => s.step === stepNum ? { ...s, state: 'in_progress' } : s)
    }));

    // Trigger audio playback via ElevenLabs / browser synthesis
    await speakText(
      textToSpeak,
      language,
      apiKey,
      () => {
        setSession(prev => ({ ...prev, audioState: 'speaking' }));
      },
      () => {
        setSession(prev => ({ ...prev, audioState: 'listening' }));

        // Trigger in-app push prompt automatically when reaching Step 2
        if (stepNum === 2) {
          setSession(prev => ({ ...prev, pushChallengeStatus: 'pending' }));
        }
      }
    );
  };

  // Advance to Next Workflow Step
  const handleNextStep = () => {
    if (session.currentStep < 5) {
      const nextStep = (session.currentStep + 1) as 1 | 2 | 3 | 4 | 5;
      deliverWorkflowStep(nextStep);
    }
  };

  // Trigger Customer Verbal Reply Simulation
  const handleTriggerCustomerReply = async (replyType: 'confirm_fraud' | 'deny_fraud' | 'opt_out') => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    let textEn = '';
    let textAr = '';

    if (replyType === 'confirm_fraud') {
      textEn = "No, that wasn't me! I am in Dubai right now, I did not make that purchase in London!";
      textAr = "لا، لم أقم بهذه المعاملة إطلاقاً! أنا في دبي حالياً ولم أشترِ أي شيء من لندن!";
    } else if (replyType === 'deny_fraud') {
      textEn = "Yes, that was me buying a laptop online.";
      textAr = "نعم، هذه معاملتي وكنت أشتري جهاز كمبيوتر عبر الإنترنت.";
    } else {
      textEn = "I don't trust this call, can I speak to someone at the Dubai Mall branch?";
      textAr = "أنا لست مطمئناً لهذه المكالمة، هل يمكنني التحدث مع موظف بفرع دبي مول؟";
    }

    setSession(prev => ({
      ...prev,
      transcript: [
        ...prev.transcript,
        {
          id: `CUST-${Date.now()}`,
          speaker: 'customer',
          textEn,
          textAr,
          timestamp: nowTime
        }
      ]
    }));

    // Auto-advance to Step 4 (Pre-approved freeze) if fraud confirmed
    if (replyType === 'confirm_fraud' && session.currentStep === 3) {
      setTimeout(() => {
        deliverWorkflowStep(4);
      }, 1000);
    }
  };

  // Approve Mobile App Push Challenge (Zero-Secret)
  const handleApprovePush = () => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSession(prev => ({
      ...prev,
      pushChallengeStatus: 'approved',
      transcript: [
        ...prev.transcript,
        {
          id: `AUTH-${Date.now()}`,
          speaker: 'system',
          textEn: '✓ Mobile App Push Authentication Approved (FaceID Verified, No PIN Requested)',
          textAr: '✓ تم التحقق بنجاح عبر إشعار تطبيق البنك (بصمة الوجه، دون طلب كلمة سر)',
          timestamp: nowTime,
          verified: true
        }
      ]
    }));

    // Auto-advance to Step 3 (Transaction Inquiry)
    setTimeout(() => {
      deliverWorkflowStep(3);
    }, 1200);
  };

  // Deny Mobile App Push Challenge (Indicates fraud)
  const handleDenyPush = () => {
    handleTriggerCustomerReply('confirm_fraud');
  };

  // Execute Core Banking Card Freeze API
  const handleExecuteFreeze = () => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Update session
    setSession(prev => ({
      ...prev,
      cardFreezeExecuted: true,
      transcript: [
        ...prev.transcript,
        {
          id: `SYS-${Date.now()}`,
          speaker: 'system',
          textEn: `🔒 Core Banking CMS API: Card ending ${selectedAlert.cardLastFour} TEMPORARILY FROZEN. Zero liability applied.`,
          textAr: `🔒 نظام البطاقات المصرفي: تم تجميد البطاقة المنتهية بـ ${selectedAlert.cardLastFour} مؤقتاً بنجاح.`,
          timestamp: nowTime
        }
      ]
    }));

    // Update alert in store
    setAlerts(prev => prev.map(a => 
      a.id === selectedAlert.id 
        ? { ...a, cardStatus: 'temporary_frozen', status: 'confirmed_fraud' } 
        : a
    ));

    // Auto-advance to Step 5 (Human Handover)
    setTimeout(() => {
      deliverWorkflowStep(5);
    }, 1200);
  };

  // Execute Human Handover SIP Transfer (H)
  const handleHandoverHuman = () => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    setSession(prev => ({
      ...prev,
      transferredToHuman: true,
      transcript: [
        ...prev.transcript,
        {
          id: `HO-${Date.now()}`,
          speaker: 'system',
          textEn: `👤 SIP Warm Transfer: Call connected to Senior Fraud Officer Sara Al-Ghurair (H) with injected incident payload.`,
          textAr: `👤 تم التحويل الصوتي المباشر لضابطة الاحتيال سارة الغرير (H) مع نقل كامل سجل وسياق المكالمة.`,
          timestamp: nowTime
        }
      ]
    }));

    setAlerts(prev => prev.map(a => 
      a.id === selectedAlert.id ? { ...a, status: 'escalated_to_human' } : a
    ));
  };

  // End Call
  const handleEndCall = () => {
    setSession(prev => ({
      ...prev,
      active: false,
      audioState: 'idle'
    }));
  };

  return (
    <div className="min-h-screen app-mesh text-ink flex flex-col transition-colors">
      
      {/* Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        activeAlertsCount={alerts.filter(a => a.status !== 'resolved').length}
      />

      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 flex-1 flex flex-col">
        
        {/* Institutional KPIs matching Canvas Box D and Box M */}
        <KPICards language={language} />

        {/* View Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-hairline pb-3">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              activeTab === 'console'
                ? 'bg-brand text-white shadow-brand/20'
                : 'text-ink-secondary hover:text-ink bg-surface-1 border border-hairline hover:border-brand/40'
            }`}
          >
            {language === 'ar' ? 'غرفة العمليات والمحاكاة الحية' : 'Live SOC Intervention Console'}
          </button>
          
          <button
            onClick={() => setActiveTab('guardrails')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              activeTab === 'guardrails'
                ? 'bg-brand text-white shadow-brand/20'
                : 'text-ink-secondary hover:text-ink bg-surface-1 border border-hairline hover:border-brand/40'
            }`}
          >
            {language === 'ar' ? 'الضوابط الرقابية (Box K)' : 'CBUAE Guardrails Suite (Box K)'}
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              activeTab === 'architecture'
                ? 'bg-brand text-white shadow-brand/20'
                : 'text-ink-secondary hover:text-ink bg-surface-1 border border-hairline hover:border-brand/40'
            }`}
          >
            {language === 'ar' ? 'البنية التقنية (Box L)' : 'Architecture & 3 Zones (Box L)'}
          </button>
        </div>

        {/* TAB 1: CONSOLE & PHONE SIMULATOR */}
        {activeTab === 'console' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 4 Cols: Real-Time Fraud Alert Feed */}
            <div className="lg:col-span-4 h-full">
              <FraudFeed
                alerts={alerts}
                selectedAlertId={selectedAlert.id}
                onSelectAlert={setSelectedAlert}
                onStartIntervention={handleStartIntervention}
                isCalling={session.active}
                language={language}
              />
            </div>

            {/* Middle 5 Cols: Voice Call Cockpit & Synchronized Transcript */}
            <div className="lg:col-span-5 h-full">
              <CallCockpit
                session={session}
                alert={selectedAlert}
                onNextStep={handleNextStep}
                onTriggerCustomerReply={handleTriggerCustomerReply}
                onApprovePush={handleApprovePush}
                onExecuteFreeze={handleExecuteFreeze}
                onHandoverHuman={handleHandoverHuman}
                onEndCall={handleEndCall}
                language={language}
              />
            </div>

            {/* Right 3 Cols: Smartphone Simulator (Inspired by Alpha-Fin) */}
            <div className="lg:col-span-3 flex justify-center">
              <PhoneSimulator
                session={session}
                alert={selectedAlert}
                onAcceptCall={handleAcceptCall}
                onDeclineCall={handleEndCall}
                onApprovePush={handleApprovePush}
                onDenyPush={handleDenyPush}
                language={language}
              />
            </div>

          </div>
        )}

        {/* TAB 2: GUARDRAILS SUITE */}
        {activeTab === 'guardrails' && (
          <GuardrailsView
            guardrails={INITIAL_GUARDRAILS}
            language={language}
          />
        )}

        {/* TAB 3: TECHNICAL ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <ArchitectureView
            language={language}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-hairline py-4 px-6 text-center text-xs text-ink-muted">
        AegisVoice AI • Built for ElevenLabs × Ignyte Future of Voice AI Challenge • DIFC / CBUAE Consumer Protection Regulated
      </footer>
    </div>
  );
}
