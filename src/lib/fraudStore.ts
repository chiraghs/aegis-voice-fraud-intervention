import { FraudAlert, CallSession, CallWorkflowStep, TranscriptMessage, GuardrailItem } from './types';

export const INITIAL_ALERTS: FraudAlert[] = [
  {
    id: 'ALT-7701',
    timestamp: '2026-09-25T02:15:22Z',
    timeAgo: 'Just now',
    customerName: 'Ahmed Al-Maktoum',
    customerNameAr: 'أحمد المكتوم',
    customerPhone: '+971 50 842 1902',
    cardLastFour: '4012',
    cardType: 'Visa Signature',
    amountAED: 3450,
    merchantName: 'TechZone London',
    merchantCategory: 'Consumer Electronics (eCommerce)',
    merchantLocation: 'London, UK',
    transactionTime: '02:15 AM GST',
    riskScore: 94,
    severity: 'critical',
    riskFactors: [
      'Card-Not-Present (eCommerce)',
      'Unusual International Location (London)',
      'Velocity Spike (First transaction in 6 months in UK)',
      'Night-time Activity (02:15 AM)'
    ],
    status: 'pending',
    cardStatus: 'active',
    optInConsent: true
  },
  {
    id: 'ALT-7702',
    timestamp: '2026-09-25T02:08:14Z',
    timeAgo: '7 mins ago',
    customerName: 'Fatima Al-Zahra',
    customerNameAr: 'فاطمة الزهراء',
    customerPhone: '+971 52 319 4481',
    cardLastFour: '9183',
    cardType: 'Mastercard World Elite',
    amountAED: 8920,
    merchantName: 'LuxuryBoutique Paris',
    merchantCategory: 'Luxury Apparel (Cross-border)',
    merchantLocation: 'Paris, France',
    transactionTime: '02:08 AM GST',
    riskScore: 89,
    severity: 'critical',
    riskFactors: [
      'High-Value Transaction',
      'High-Risk Merchant Category',
      'IP Proxy / VPN Detected'
    ],
    status: 'pending',
    cardStatus: 'active',
    optInConsent: true
  },
  {
    id: 'ALT-7703',
    timestamp: '2026-09-25T01:54:02Z',
    timeAgo: '21 mins ago',
    customerName: 'Rahul Mehta',
    customerNameAr: 'راهول ميهتا',
    customerPhone: '+971 55 671 2938',
    cardLastFour: '6620',
    cardType: 'Visa Signature',
    amountAED: 5000,
    merchantName: 'KrungThai ATM Gateway',
    merchantCategory: 'ATM Cash Withdrawal',
    merchantLocation: 'Bangkok, Thailand',
    transactionTime: '01:54 AM GST',
    riskScore: 92,
    severity: 'critical',
    riskFactors: [
      'Foreign ATM Cash Out',
      'Card physically used in Dubai 2 hours prior',
      'Impossible Travel Velocity'
    ],
    status: 'pending',
    cardStatus: 'active',
    optInConsent: true
  },
  {
    id: 'ALT-7704',
    timestamp: '2026-09-25T01:30:19Z',
    timeAgo: '45 mins ago',
    customerName: 'Sara Al-Mansoor',
    customerNameAr: 'سارة المنصور',
    customerPhone: '+971 54 990 1276',
    cardLastFour: '1105',
    cardType: 'Emirates Islamic Platinum',
    amountAED: 1200,
    merchantName: 'StreamPlay Games Tokyo',
    merchantCategory: 'Digital Gaming Subscription',
    merchantLocation: 'Tokyo, Japan',
    transactionTime: '01:30 AM GST',
    riskScore: 86,
    severity: 'high',
    riskFactors: [
      'Rapid Micro-charge Pattern (4x in 3 minutes)',
      'Cross-border Digital Merchant'
    ],
    status: 'resolved',
    cardStatus: 'temporary_frozen',
    optInConsent: true
  }
];

export const INITIAL_GUARDRAILS: GuardrailItem[] = [
  {
    id: 'GD-01',
    requirement: 'Mandatory AI Opening Disclosure',
    requirementAr: 'الإفصاح الإلزامي عن هوية الذكاء الاصطناعي',
    mechanism: 'System prompt enforces AI identity and card last-four declaration before accepting caller speech.',
    mechanismAr: 'الموجه يفرض إعلان هوية الذكاء الاصطناعي وآخر 4 أرقام من البطاقة فوراً.',
    status: 'passed',
    latencyMs: 12
  },
  {
    id: 'GD-02',
    requirement: 'Consent to be Called (CBUAE)',
    requirementAr: 'موافقة الاتصال الاستباقي (مصرف الإمارات المركزي)',
    mechanism: 'Telephony dispatcher verifies customer fraud-alert opt-in flag in CRM database before dialling.',
    mechanismAr: 'التحقق الآلي من علامة موافقة العميل قبل بدء المكالمة.',
    status: 'passed',
    latencyMs: 8
  },
  {
    id: 'GD-03',
    requirement: 'Zero-Secret / Zero-PIN Verification',
    requirementAr: 'التحقق الآمن دون طلب كلمات سر أو رموز OTP',
    mechanism: 'Webhook initiates out-of-band banking app push challenge; agent forbids verbal PIN/OTP inquiries.',
    mechanismAr: 'إرسال إشعار دفع لتطبيق البنك؛ منع طلب أي كلمة مرور شفهياً.',
    status: 'passed',
    latencyMs: 45
  },
  {
    id: 'GD-04',
    requirement: 'Pre-Approved Protective Action Only',
    requirementAr: 'إجراءات حمائية معتمدة مسبقاً فقط',
    mechanism: 'Tool scope restricted strictly to temporary card freeze; permanent cancellation restricted.',
    mechanismAr: 'تقييد صلاحيات الأداة بالتجميد المؤقت فقط دون الإلغاء النهائي.',
    status: 'passed',
    latencyMs: 18
  },
  {
    id: 'GD-05',
    requirement: 'Instant Opt-Out / Branch Callback',
    requirementAr: 'خيار الانسحاب أو معاودة الاتصال بالفرع',
    mechanism: 'Customer hesitation or distrust intent triggers immediate option for human transfer or callback.',
    mechanismAr: 'التردد أو الشك يحول المكالمة فوراً لفرع البنك أو الموظف البشري.',
    status: 'passed',
    latencyMs: 24
  },
  {
    id: 'GD-06',
    requirement: 'Deterministic Human Escalation Point (H)',
    requirementAr: 'نقطة تصعيد إجبارية للموظف البشري (H)',
    mechanism: 'Dispute filing and irreversible account decisions routed via SIP warm transfer to human desk.',
    mechanismAr: 'تحويل نزاع المعاملة والإجراءات غير القابلة للإلغاء لمكتب الاحتيال البشري.',
    status: 'passed',
    latencyMs: 31
  }
];

export const WORKFLOW_STEPS_TEMPLATE: CallWorkflowStep[] = [
  {
    step: 1,
    title: 'Opening AI Disclosure',
    titleAr: 'الإفصاح الأولي لهوية الذكاء الاصطناعي',
    description: 'Declares automated AI protection and identifies card last four digits (max 15 words)',
    state: 'pending',
    scriptSnippetEn: 'Emirates Bank automated fraud protection calling Ahmed regarding suspicious activity on debit card ending 4012.',
    scriptSnippetAr: 'حماية الاحتيال الآلية لبنك الإمارات تتصل بأحمد بخصوص نشاط مشبوه على البطاقة المنتهية بـ 4012.'
  },
  {
    step: 2,
    title: 'Zero-Secret Push Authentication',
    titleAr: 'التحقق الآمن عبر إشعار تطبيق البنك',
    description: 'Triggers out-of-band 1-tap cryptographic push; forbids asking PIN/password (max 15 words)',
    state: 'pending',
    scriptSnippetEn: 'For security, tap the approve prompt sent to your banking app now; no password needed.',
    scriptSnippetAr: 'للأمان، اضغط على زر الموافقة في تطبيقك المصرفي الآن؛ لا حاجة لكلمة مرور.'
  },
  {
    step: 3,
    title: 'Suspicious Transaction Inquiry',
    titleAr: 'الاستفسار عن المعاملة المشبوهة',
    description: 'Direct inquiry on amount, merchant, location, and time (max 15 words)',
    state: 'pending',
    scriptSnippetEn: 'Did you just attempt an online purchase of AED 3,450 at TechZone London at 02:15?',
    scriptSnippetAr: 'هل حاولت للتو الشراء بقيمة 3,450 درهماً عبر الإنترنت من تيك زون لندن الساعة 02:15؟'
  },
  {
    step: 4,
    title: 'Pre-Approved Protective Freeze',
    titleAr: 'تجميد حمائي مؤقت ومعتمد مسبقاً',
    description: 'Executes instant temporary card freeze via core banking API (max 15 words)',
    state: 'pending',
    scriptSnippetEn: 'I have placed an immediate temporary freeze on your card to prevent unauthorized charges.',
    scriptSnippetAr: 'لقد وضعت تجميداً مؤقتاً فورياً على بطاقتك لحمايتها من أي رسوم غير مصرح بها.'
  },
  {
    step: 5,
    title: 'Human Officer Handover (H)',
    titleAr: 'التحويل للموظف البشري المختص (H)',
    description: 'SIP warm transfer to human fraud underwriter Sara for irreversible dispute filing (max 15 words)',
    state: 'pending',
    isHumanHandover: true,
    scriptSnippetEn: 'Transferring you to human fraud officer Sara to file dispute and arrange replacement. (H)',
    scriptSnippetAr: 'أقوم بتحويلك الآن لضابطة الاحتيال سارة لتقديم طلب النزاع وإصدار بطاقة بديلة. (H)'
  }
];

export function getInitialCallSession(alert: FraudAlert, language: 'en' | 'ar' = 'en'): CallSession {
  return {
    sessionId: `SESS-${Date.now()}-${alert.cardLastFour}`,
    alertId: alert.id,
    active: false,
    language,
    startTime: null,
    durationSeconds: 0,
    currentStep: 1,
    steps: JSON.parse(JSON.stringify(WORKFLOW_STEPS_TEMPLATE)),
    transcript: [],
    pushChallengeStatus: 'unissued',
    cardFreezeExecuted: false,
    transferredToHuman: false,
    humanAgentName: 'Sara Al-Ghurair (Senior Fraud Officer)',
    audioState: 'idle'
  };
}
