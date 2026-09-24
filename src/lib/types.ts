export type Language = 'en' | 'ar';

export type AlertSeverity = 'critical' | 'high' | 'medium';

export type AlertStatus = 
  | 'pending'
  | 'calling'
  | 'verifying'
  | 'confirmed_fraud'
  | 'confirmed_legitimate'
  | 'escalated_to_human'
  | 'resolved';

export interface FraudAlert {
  id: string;
  timestamp: string;
  timeAgo: string;
  customerName: string;
  customerNameAr: string;
  customerPhone: string;
  cardLastFour: string;
  cardType: 'Visa Signature' | 'Mastercard World Elite' | 'Emirates Islamic Platinum';
  amountAED: number;
  merchantName: string;
  merchantCategory: string;
  merchantLocation: string;
  transactionTime: string;
  riskScore: number; // 0 - 100
  severity: AlertSeverity;
  riskFactors: string[];
  status: AlertStatus;
  cardStatus: 'active' | 'temporary_frozen' | 'permanently_blocked';
  optInConsent: boolean;
}

export interface TranscriptMessage {
  id: string;
  speaker: 'agent' | 'customer' | 'system';
  textEn: string;
  textAr: string;
  timestamp: string;
  verified?: boolean;
}

export interface CallWorkflowStep {
  step: 1 | 2 | 3 | 4 | 5;
  title: string;
  titleAr: string;
  description: string;
  state: 'pending' | 'in_progress' | 'completed' | 'failed';
  isHumanHandover?: boolean;
  scriptSnippetEn: string;
  scriptSnippetAr: string;
}

export interface CallSession {
  sessionId: string;
  alertId: string;
  active: boolean;
  language: Language;
  startTime: number | null;
  durationSeconds: number;
  currentStep: 1 | 2 | 3 | 4 | 5;
  steps: CallWorkflowStep[];
  transcript: TranscriptMessage[];
  pushChallengeStatus: 'unissued' | 'pending' | 'approved' | 'denied';
  cardFreezeExecuted: boolean;
  transferredToHuman: boolean;
  humanAgentName?: string;
  audioState: 'idle' | 'ringing' | 'speaking' | 'listening' | 'holding';
}

export interface GuardrailItem {
  id: string;
  requirement: string;
  requirementAr: string;
  mechanism: string;
  mechanismAr: string;
  status: 'passed' | 'warning' | 'active';
  latencyMs: number;
}
