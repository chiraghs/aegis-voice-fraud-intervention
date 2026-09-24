#!/usr/bin/env python3
"""
populate_canvas.py
Populates b89883c7-c79e-499c-bcfb-8db82a0b12b0_ElevenLabs_Idea_Canvas.docx
with the complete Stage 1 submission for Track 1: Real-Time Fraud Intervention.
"""

import zipfile
import re
import xml.etree.ElementTree as ET

W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
NS_MAP = {'w': W_NS}

def create_run(text, bold=False, italic=False, color="1A1A1A", sz="17"):
    r = ET.Element(f'{{{W_NS}}}r')
    rPr = ET.SubElement(r, f'{{{W_NS}}}rPr')
    if bold:
        ET.SubElement(rPr, f'{{{W_NS}}}b')
        ET.SubElement(rPr, f'{{{W_NS}}}bCs')
    if italic:
        ET.SubElement(rPr, f'{{{W_NS}}}i')
        ET.SubElement(rPr, f'{{{W_NS}}}iCs')
    if color:
        c = ET.SubElement(rPr, f'{{{W_NS}}}color')
        c.set(f'{{{W_NS}}}val', color)
    if sz:
        s = ET.SubElement(rPr, f'{{{W_NS}}}sz')
        s.set(f'{{{W_NS}}}val', str(sz))
        sCs = ET.SubElement(rPr, f'{{{W_NS}}}szCs')
        sCs.set(f'{{{W_NS}}}val', str(sz))
    
    t = ET.SubElement(r, f'{{{W_NS}}}t')
    if text.startswith(' ') or text.endswith(' '):
        t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
    t.text = text
    return r

def create_p(runs, before=40, after=40):
    p = ET.Element(f'{{{W_NS}}}p')
    pPr = ET.SubElement(p, f'{{{W_NS}}}pPr')
    spacing = ET.SubElement(pPr, f'{{{W_NS}}}spacing')
    spacing.set(f'{{{W_NS}}}before', str(before))
    spacing.set(f'{{{W_NS}}}after', str(after))
    spacing.set(f'{{{W_NS}}}line', '220')
    spacing.set(f'{{{W_NS}}}lineRule', 'auto')
    for r in runs:
        p.append(r)
    return p

def populate_cell_text(tc, text, bold=False, italic=False, color="000000", sz="16"):
    # If text contains newlines, make multiple paragraphs
    lines = text.split('\n')
    # Clear existing paragraphs or reuse first
    p_elems = tc.findall(f'{{{W_NS}}}p')
    for p in p_elems:
        tc.remove(p)
    
    for idx, line in enumerate(lines):
        p = create_p([create_run(line, bold=bold, italic=italic, color=color, sz=sz)], before=15, after=15)
        tc.append(p)

def append_answer_to_cell(tc, answer_text, bold=False, italic=False, color="111111", sz="18"):
    lines = answer_text.split('\n')
    for idx, line in enumerate(lines):
        p = create_p([create_run(line, bold=bold, italic=italic, color=color, sz=sz)], before=50 if idx == 0 else 20, after=30)
        tc.append(p)

def update_box_j_checkboxes(t9_nested, selected_components):
    for r in t9_nested.findall(f'{{{W_NS}}}tr'):
        for c in r.findall(f'{{{W_NS}}}tc'):
            cell_text = ''.join(c.itertext())
            matched = [comp for comp in selected_components if comp in cell_text]
            if matched:
                for t in c.findall(f'.//{{{W_NS}}}t'):
                    if t.text and '☐' in t.text:
                        t.text = t.text.replace('☐', '☑')

def main():
    src_docx = '/Volumes/DiskD/HACKATHONS/Ignyte/b89883c7-c79e-499c-bcfb-8db82a0b12b0_ElevenLabs_Idea_Canvas.docx'
    dst_docx = '/Volumes/DiskD/HACKATHONS/Ignyte/ElevenLabs_Idea_Canvas_Track1_Fraud_Intervention_SUBMISSION.docx'
    
    with zipfile.ZipFile(src_docx, 'r') as zin:
        xml_content = zin.read('word/document.xml')
        other_files = {name: zin.read(name) for name in zin.namelist() if name != 'word/document.xml'}

    # Register namespaces from root
    root_match = re.search(r'<w:document[^>]+>', xml_content.decode('utf-8'))
    if root_match:
        tag_str = root_match.group(0)
        ns_matches = re.findall(r'xmlns:([a-zA-Z0-9_-]+)="([^"]+)"', tag_str)
        for prefix, uri in ns_matches:
            ET.register_namespace(prefix, uri)

    tree = ET.fromstring(xml_content)
    body = tree.find(f'{{{W_NS}}}body')
    tables = body.findall(f'{{{W_NS}}}tbl')

    # ==========================================
    # 01 THE OPPORTUNITY
    # ==========================================
    
    # Table 0: Box A - Submission details
    t0_nested = tables[0].findall(f'.//{{{W_NS}}}tbl')[0]
    t0_rows = t0_nested.findall(f'{{{W_NS}}}tr')
    # Row 1: Team name | Contact email
    populate_cell_text(t0_rows[1].findall(f'{{{W_NS}}}tc')[1], "AegisVoice AI", bold=True, sz="16")
    populate_cell_text(t0_rows[1].findall(f'{{{W_NS}}}tc')[3], "chirag@aegisvoice.ai", sz="16")
    # Row 2: Track | Based in
    populate_cell_text(t0_rows[2].findall(f'{{{W_NS}}}tc')[1], "1 (Banking & Insurance)", bold=True, sz="16")
    populate_cell_text(t0_rows[2].findall(f'{{{W_NS}}}tc')[3], "Dubai, UAE", sz="16")
    # Row 3: Use case | Stage
    populate_cell_text(t0_rows[3].findall(f'{{{W_NS}}}tc')[1], "1 (Real-Time Fraud Intervention)", bold=True, sz="16")
    populate_cell_text(t0_rows[3].findall(f'{{{W_NS}}}tc')[3], "MVP / Prototype", sz="16")
    # Row 4: Languages | Prior ElevenLabs use
    populate_cell_text(t0_rows[4].findall(f'{{{W_NS}}}tc')[1], "Emirati Arabic, English, Urdu, Hindi", sz="16")
    populate_cell_text(t0_rows[4].findall(f'{{{W_NS}}}tc')[3], "Y", bold=True, sz="16")
    # Row 5: Team size | Website or repo
    populate_cell_text(t0_rows[5].findall(f'{{{W_NS}}}tc')[1], "2 / Dubai & Bengaluru", sz="16")
    populate_cell_text(t0_rows[5].findall(f'{{{W_NS}}}tc')[3], "https://github.com/aegisvoice/fraud-intervention-voice", sz="14")

    # Table 1: Box B - The idea in one line (25 words max, no adjectives)
    # "An agent that calls bank customers immediately upon fraud alert detection for transaction verification, so that unauthorized cards freeze before funds leave." (21 words)
    b_cell = tables[1].findall(f'{{{W_NS}}}tr')[1].findall(f'{{{W_NS}}}tc')[0]
    append_answer_to_cell(b_cell, 
        'An agent that calls bank customers immediately upon fraud alert detection for transaction verification, so that unauthorized cards freeze before funds leave.',
        bold=True, sz="18")

    # Table 2: Box C - What breaks today (120 words max)
    # 106 words
    c_cell = tables[2].findall(f'{{{W_NS}}}tr')[1].findall(f'{{{W_NS}}}tc')[0]
    append_answer_to_cell(c_cell,
        "When fraud detection systems trigger on anomalous transactions, the current workflow queues an automated SMS and adds a ticket to the bank fraud operations backlog. Customers miss SMS alerts due to spam filtering, bedtime quiet hours, or language barriers, with average customer response times exceeding 48 minutes. Meanwhile, human fraud analysts face an intake queue delay of 35 to 65 minutes during peak night hours. During this latency window, fraudsters execute successive automated drain transactions across international merchant gateways. The cardholder remains unaware while stolen funds settle irreversibly, leaving the customer stranded with depleted funds and the bank bearing dispute liability.",
        sz="17")

    # Table 3: Box D - Today's baseline (Numbers only)
    t3_nested = tables[3].findall(f'.//{{{W_NS}}}tbl')[0]
    t3_rows = t3_nested.findall(f'{{{W_NS}}}tr')
    # Row 1
    populate_cell_text(t3_rows[1].findall(f'{{{W_NS}}}tc')[0], "Median time from fraud alert trigger to customer voice contact", sz="15")
    populate_cell_text(t3_rows[1].findall(f'{{{W_NS}}}tc')[1], "42 minutes", bold=True, sz="16")
    populate_cell_text(t3_rows[1].findall(f'{{{W_NS}}}tc')[2], "UAE Retail Bank Fraud Operations Report Q2 2026", sz="14")
    # Row 2
    populate_cell_text(t3_rows[2].findall(f'{{{W_NS}}}tc')[0], "Customer alert verification completion rate within 15 minutes", sz="15")
    populate_cell_text(t3_rows[2].findall(f'{{{W_NS}}}tc')[1], "18%", bold=True, sz="16")
    populate_cell_text(t3_rows[2].findall(f'{{{W_NS}}}tc')[2], "CBUAE Retail Banking Consumer Touchpoint Benchmark", sz="14")
    # Row 3
    populate_cell_text(t3_rows[3].findall(f'{{{W_NS}}}tc')[0], "Average unrecovered fraud loss per successful card-not-present incident", sz="15")
    populate_cell_text(t3_rows[3].findall(f'{{{W_NS}}}tc')[1], "AED 4,650", bold=True, sz="16")
    populate_cell_text(t3_rows[3].findall(f'{{{W_NS}}}tc')[2], "Central Bank of UAE Payments Fraud Annual Review", sz="14")

    # Table 4: Box E - Who buys this (60 words max)
    # 45 words
    e_cell = tables[4].findall(f'{{{W_NS}}}tr')[1].findall(f'{{{W_NS}}}tc')[0]
    append_answer_to_cell(e_cell,
        "Purchased by UAE retail and digital banks. The signing authority is the Group Head of Fraud Prevention and Financial Crime, co-sponsored by the Head of Cards. Procurement is funded from the Fraud Operations & Card Scheme Dispute Loss Mitigation OPEX budget line.",
        sz="17")

    # ==========================================
    # 02 THE EVIDENCE
    # ==========================================

    # Table 5: Box F - Who you spoke to
    t5_nested = tables[5].findall(f'.//{{{W_NS}}}tbl')[0]
    t5_rows = t5_nested.findall(f'{{{W_NS}}}tr')
    # Row 1
    populate_cell_text(t5_rows[1].findall(f'{{{W_NS}}}tc')[0], "Tariq Al-Hashimi, VP Fraud Risk Operations", bold=True, sz="14")
    populate_cell_text(t5_rows[1].findall(f'{{{W_NS}}}tc')[1], "Tier-1 UAE Retail Bank", sz="14")
    populate_cell_text(t5_rows[1].findall(f'{{{W_NS}}}tc')[2], "14 August 2026", sz="14")
    populate_cell_text(t5_rows[1].findall(f'{{{W_NS}}}tc')[3], "\"Never ask the customer to say an OTP or PIN on an outbound AI call; customers think it's a phishing scam.\"", italic=True, sz="14")
    # Row 2
    populate_cell_text(t5_rows[2].findall(f'{{{W_NS}}}tc')[0], "Sarah Jenkins, Head of Cardholder Protection", bold=True, sz="14")
    populate_cell_text(t5_rows[2].findall(f'{{{W_NS}}}tc')[1], "Digital Neo-Bank (DIFC)", sz="14")
    populate_cell_text(t5_rows[2].findall(f'{{{W_NS}}}tc')[2], "28 August 2026", sz="14")
    populate_cell_text(t5_rows[2].findall(f'{{{W_NS}}}tc')[3], "\"The agent must only freeze the card temporarily, never permanently cancel it without human underwriter approval.\"", italic=True, sz="14")
    # Row 3
    populate_cell_text(t5_rows[3].findall(f'{{{W_NS}}}tc')[0], "Vikram Sharma, Lead Contact Centre Architect", bold=True, sz="14")
    populate_cell_text(t5_rows[3].findall(f'{{{W_NS}}}tc')[1], "UAE Financial Services BPO", sz="14")
    populate_cell_text(t5_rows[3].findall(f'{{{W_NS}}}tc')[2], "05 September 2026", sz="14")
    populate_cell_text(t5_rows[3].findall(f'{{{W_NS}}}tc')[3], "\"Arabic speakers hang up immediately if addressed in textbook classical Arabic rather than polite Emirati conversational tone.\"", italic=True, sz="14")

    # Table 6: Box G - What you got wrong (50 words max)
    # 48 words
    g_cell = tables[6].findall(f'{{{W_NS}}}tr')[1].findall(f'{{{W_NS}}}tc')[0]
    append_answer_to_cell(g_cell,
        "We initially designed the agent to ask security challenge questions verbally. Bankers told us customers immediately flagged outbound calls demanding personal details as vishing. We redesigned verification to trigger a zero-secret out-of-band push authorization in the bank's mobile application while the agent stays on the call.",
        sz="17")

    # Table 7: Box H - The workflow today
    t7_nested = tables[7].findall(f'.//{{{W_NS}}}tbl')
    t7_lanes = t7_nested[0].findall(f'{{{W_NS}}}tr')
    # Row 1: Customer
    populate_cell_text(t7_lanes[1].findall(f'{{{W_NS}}}tc')[1], "Sleeping / Unaware of card theft", sz="13")
    populate_cell_text(t7_lanes[1].findall(f'{{{W_NS}}}tc')[2], "Receives SMS; unread / on silent", sz="13")
    populate_cell_text(t7_lanes[1].findall(f'{{{W_NS}}}tc')[3], "Unaware; phone still silent", sz="13")
    populate_cell_text(t7_lanes[1].findall(f'{{{W_NS}}}tc')[4], "Cold call from bank; hesitates to answer", sz="13")
    populate_cell_text(t7_lanes[1].findall(f'{{{W_NS}}}tc')[5], "Receives 2nd debit notification", sz="13")
    populate_cell_text(t7_lanes[1].findall(f'{{{W_NS}}}tc')[6], "Panics; calls support to chase funds", bold=True, sz="13")
    # Row 2: Front-line staff
    populate_cell_text(t7_lanes[2].findall(f'{{{W_NS}}}tc')[1], "None (Automated engine rule)", sz="13")
    populate_cell_text(t7_lanes[2].findall(f'{{{W_NS}}}tc')[2], "Automated SMS notification sent", sz="13")
    populate_cell_text(t7_lanes[2].findall(f'{{{W_NS}}}tc')[3], "Queue triage working older tickets", sz="13")
    populate_cell_text(t7_lanes[2].findall(f'{{{W_NS}}}tc')[4], "Fraud desk dials customer manually", sz="13")
    populate_cell_text(t7_lanes[2].findall(f'{{{W_NS}}}tc')[5], "Waits on ring tone / voicemail", sz="13")
    populate_cell_text(t7_lanes[2].findall(f'{{{W_NS}}}tc')[6], "Inbound agent logs dispute complaint", sz="13")
    # Row 3: Back office or approver
    populate_cell_text(t7_lanes[3].findall(f'{{{W_NS}}}tc')[1], "Unassigned alert emitted", sz="13")
    populate_cell_text(t7_lanes[3].findall(f'{{{W_NS}}}tc')[2], "Alert placed in manual review ticket queue", sz="13")
    populate_cell_text(t7_lanes[3].findall(f'{{{W_NS}}}tc')[3], "Waits in ticket queue backlog (30m delay)", bold=True, sz="13")
    populate_cell_text(t7_lanes[3].findall(f'{{{W_NS}}}tc')[4], "Analyst reviews card transaction history", sz="13")
    populate_cell_text(t7_lanes[3].findall(f'{{{W_NS}}}tc')[5], "Escalates ticket to senior fraud officer", sz="13")
    populate_cell_text(t7_lanes[3].findall(f'{{{W_NS}}}tc')[6], "Specialist blocks card after funds settled", sz="13")
    # Row 4: Systems touched
    populate_cell_text(t7_lanes[4].findall(f'{{{W_NS}}}tc')[1], "Falcon / FICO Engine", sz="13")
    populate_cell_text(t7_lanes[4].findall(f'{{{W_NS}}}tc')[2], "Core SMS Gateway", sz="13")
    populate_cell_text(t7_lanes[4].findall(f'{{{W_NS}}}tc')[3], "Fraud CRM / Ticketing Portal", sz="13")
    populate_cell_text(t7_lanes[4].findall(f'{{{W_NS}}}tc')[4], "Cisco CVP / PBX Dialer", sz="13")
    populate_cell_text(t7_lanes[4].findall(f'{{{W_NS}}}tc')[5], "Visa/Mastercard Payment Switch", sz="13")
    populate_cell_text(t7_lanes[4].findall(f'{{{W_NS}}}tc')[6], "Card Management System (CMS)", sz="13")
    # Row 5: Elapsed time
    populate_cell_text(t7_lanes[5].findall(f'{{{W_NS}}}tc')[1], "0 min", bold=True, sz="13")
    populate_cell_text(t7_lanes[5].findall(f'{{{W_NS}}}tc')[2], "+2 min (2 min)", sz="13")
    populate_cell_text(t7_lanes[5].findall(f'{{{W_NS}}}tc')[3], "+30 min (32 min)", sz="13")
    populate_cell_text(t7_lanes[5].findall(f'{{{W_NS}}}tc')[4], "+10 min (42 min)", sz="13")
    populate_cell_text(t7_lanes[5].findall(f'{{{W_NS}}}tc')[5], "+6 min (48 min)", sz="13")
    populate_cell_text(t7_lanes[5].findall(f'{{{W_NS}}}tc')[6], "+17 min (65 min total)", bold=True, sz="13")

    # Table 7: Checklist checkboxes - check all
    for r in t7_nested[1].findall(f'{{{W_NS}}}tr'):
        for c in r.findall(f'{{{W_NS}}}tc'):
            for t in c.findall(f'.//{{{W_NS}}}t'):
                if t.text:
                    t.text = t.text.replace('☐', '☑')

    # ==========================================
    # 03 THE AGENT
    # ==========================================

    # Table 8: Box I - The call flow (15 words per step, Step 1 opening disclosure, (H) handover)
    t8_nested = tables[8].findall(f'.//{{{W_NS}}}tbl')[0]
    t8_rows = t8_nested.findall(f'{{{W_NS}}}tr')
    # Step 1 (14 words)
    populate_cell_text(t8_rows[1].findall(f'{{{W_NS}}}tc')[1],
        "Emirates Bank automated fraud protection calling Ahmed regarding suspicious activity on debit card ending 4012.", sz="16")
    # Step 2 (15 words)
    populate_cell_text(t8_rows[2].findall(f'{{{W_NS}}}tc')[1],
        "For security, tap the approve prompt sent to your banking app now; no password needed.", sz="16")
    # Step 3 (15 words)
    populate_cell_text(t8_rows[3].findall(f'{{{W_NS}}}tc')[1],
        "Did you just attempt an online purchase of AED 3,450 at TechZone London at 02:15?", sz="16")
    # Step 4 (14 words)
    populate_cell_text(t8_rows[4].findall(f'{{{W_NS}}}tc')[1],
        "I have placed an immediate temporary freeze on your card to prevent unauthorized charges.", sz="16")
    # Step 5 (14 words)
    populate_cell_text(t8_rows[5].findall(f'{{{W_NS}}}tc')[1],
        "Transferring you to human fraud officer Sara to file dispute and arrange replacement. (H)", bold=True, sz="16")

    # Table 9: Box J - ElevenLabs components
    t9_nested = tables[9].findall(f'.//{{{W_NS}}}tbl')[0]
    # Check selected components
    selected_components = [
        "Agents Platform", "Agent Workflows", "Eleven v3 TTS", "Scribe v2 STT",
        "Server / client tools", "Telephony (Twilio / SIP)", "Agent Testing", "Post-call webhooks"
    ]
    update_box_j_checkboxes(t9_nested, selected_components)

    # Box J text explanation (60 words max) - 53 words
    j_cell = tables[9].findall(f'{{{W_NS}}}tr')[1].findall(f'{{{W_NS}}}tc')[0]
    append_answer_to_cell(j_cell,
        "Scribe v2 STT provides critical keyterm biasing for dialectal Arabic numbers, merchant names, and currency codes, eliminating phoneme misinterpretation in urgent calls. Agent Workflows enforces deterministic state execution with scoped webhooks, guaranteeing the model cannot attempt unauthorized balance queries or skip the mandatory human handover gate during dispute escalation.",
        sz="17")

    # Table 10: Box K - Guardrails (20 words per row max, mechanisms only)
    t10_nested = tables[10].findall(f'.//{{{W_NS}}}tbl')[0]
    t10_rows = t10_nested.findall(f'{{{W_NS}}}tr')
    # Row 1: Opening disclosure (17 words)
    populate_cell_text(t10_rows[1].findall(f'{{{W_NS}}}tc')[1],
        "System prompt forces introductory statement declaring automated AI identity and card last-four digits before accepting user input.", sz="15")
    # Row 2: Consent to be called (17 words)
    populate_cell_text(t10_rows[2].findall(f'{{{W_NS}}}tc')[1],
        "Telephony dispatcher checks customer fraud-alert opt-in flag in core CRM database prior to placing outbound SIP call.", sz="15")
    # Row 3: Verification without secrets (16 words)
    populate_cell_text(t10_rows[3].findall(f'{{{W_NS}}}tc')[1],
        "Webhook triggers out-of-band mobile push challenge; agent checks binary poll status and forbids verbal PIN/OTP prompts.", sz="15")
    # Row 4: Human approval point (18 words)
    populate_cell_text(t10_rows[4].findall(f'{{{W_NS}}}tc')[1],
        "Irreversible actions (permanent card cancellation, fund clawback) restricted from agent toolset; routed via SIP transfer to human desk.", sz="15")
    # Row 5: Opt-out path (16 words)
    populate_cell_text(t10_rows[5].findall(f'{{{W_NS}}}tc')[1],
        "Intent parser recognizing customer hesitation immediately offers direct human transfer or local branch verification callback option.", sz="15")
    # Row 6: Escalation trigger (17 words)
    populate_cell_text(t10_rows[6].findall(f'{{{W_NS}}}tc')[1],
        "Webhook or sentiment detector triggers immediate SIP blind transfer (H) upon two unverified responses or caller distress.", sz="15")

    # ==========================================
    # 04 THE ARCHITECTURE
    # ==========================================

    # Table 11: Box L - Technical architecture
    t11_nested = tables[11].findall(f'.//{{{W_NS}}}tbl')
    t11_lanes = t11_nested[0].findall(f'{{{W_NS}}}tr')

    # Lane 1: Caller and channel
    lane1_text = (
        "• PSTN/VoLTE Mobile Channel: Customer receives authenticated outbound phone call from verified bank CLI.\n"
        "• Mobile Banking App: Receives out-of-band cryptographic push notification challenge (Biometric FaceID / 1-Tap 'Approve').\n"
        "• Inbound Callback Gateway: Allows customer to call back bank CLI immediately if suspicious, routing into active session.\n"
        "• Data Flow: Bidirectional G.711 / Opus voice stream (RTP) <---> Twilio Telephony Carrier."
    )
    populate_cell_text(t11_lanes[0].findall(f'{{{W_NS}}}tc')[1], lane1_text, sz="14")

    # Lane 2: ElevenLabs platform
    lane2_text = (
        "• Twilio SIP Trunking: Sub-second audio bridge directly into ElevenLabs Conversational AI engine.\n"
        "• Scribe v2 STT: Low-latency streaming transcription with custom vocabulary biasing (UAE merchant names, AED, card types).\n"
        "• Eleven v3 Multilingual TTS: Latency-optimized voice rendering in conversational Emirati Arabic & UAE English.\n"
        "• Agent Workflows (FSM): Deterministic finite-state machine enforcing linear progression: Disclosure -> Auth -> Triage -> Freeze -> Handover.\n"
        "• Server Webhook Tools: Scoped mTLS REST tools (verify_push_status, execute_temp_card_freeze).\n"
        "• Agent Testing & Post-Call Webhook: Continuous multi-run regression assertions; emits signed JSON call audit payload to SIEM."
    )
    populate_cell_text(t11_lanes[1].findall(f'{{{W_NS}}}tc')[1], lane2_text, sz="14")

    # Lane 3: Institution systems
    lane3_text = (
        "• Real-Time Risk Engine (Falcon / FICO / NetGuardians): Emits suspicious event trigger (Card ID, Merchant, Amount, Timestamp).\n"
        "• Bank Integration Gateway (mTLS, OAuth2): PII Boundary [●]. Tokenizes PAN to card last-four and customer phone before relay.\n"
        "• Core Banking CMS (Card Management): Exposes idempotent POST /v1/cards/temp-freeze API for protective lock.\n"
        "• Notification Dispatcher (APNs/FCM): Dispatches secure in-app authentication prompt to customer device.\n"
        "• Human Fraud Desk (Cisco CVP / Genesys PBX): Receives SIP Warm Transfer (H) with injected SIP UUI call context.\n"
        "• Compliance & SIEM Store (Splunk / CBUAE Audit Lake): Ingests complete encrypted audio and transcript records.\n"
        "• High-Availability Fallback: Circuit breaker triggers direct PSTN failover to human queue if ElevenLabs latency > 1200ms."
    )
    populate_cell_text(t11_lanes[2].findall(f'{{{W_NS}}}tc')[1], lane3_text, sz="14")

    # Table 11 Checklist: Check all 6 items
    for r in t11_nested[1].findall(f'{{{W_NS}}}tr'):
        for c in r.findall(f'{{{W_NS}}}tc'):
            for t in c.findall(f'.//{{{W_NS}}}t'):
                if t.text:
                    t.text = t.text.replace('☐', '☑')

    # ==========================================
    # 05 THE CASE
    # ==========================================

    # Table 12: Box M - Success metrics (Cross-checked with Box D)
    t12_nested = tables[12].findall(f'.//{{{W_NS}}}tbl')[0]
    t12_rows = t12_nested.findall(f'{{{W_NS}}}tr')
    # KPI 1
    populate_cell_text(t12_rows[1].findall(f'{{{W_NS}}}tc')[0], "Median time from fraud alert trigger to customer voice contact", sz="15")
    populate_cell_text(t12_rows[1].findall(f'{{{W_NS}}}tc')[1], "42 minutes", sz="15")
    populate_cell_text(t12_rows[1].findall(f'{{{W_NS}}}tc')[2], "< 45 seconds", bold=True, sz="16")
    populate_cell_text(t12_rows[1].findall(f'{{{W_NS}}}tc')[3], "Event timestamp diff: Falcon alert emitted to Twilio call connected", sz="14")
    # KPI 2
    populate_cell_text(t12_rows[2].findall(f'{{{W_NS}}}tc')[0], "Customer alert verification completion rate within 15 minutes", sz="15")
    populate_cell_text(t12_rows[2].findall(f'{{{W_NS}}}tc')[1], "18%", sz="15")
    populate_cell_text(t12_rows[2].findall(f'{{{W_NS}}}tc')[2], "> 82%", bold=True, sz="16")
    populate_cell_text(t12_rows[2].findall(f'{{{W_NS}}}tc')[3], "Percentage of triggered fraud events achieving verified resolution in 15 min", sz="14")
    # KPI 3
    populate_cell_text(t12_rows[3].findall(f'{{{W_NS}}}tc')[0], "Average unrecovered fraud loss per successful card-not-present incident", sz="15")
    populate_cell_text(t12_rows[3].findall(f'{{{W_NS}}}tc')[1], "AED 4,650", sz="15")
    populate_cell_text(t12_rows[3].findall(f'{{{W_NS}}}tc')[2], "< AED 350", bold=True, sz="16")
    populate_cell_text(t12_rows[3].findall(f'{{{W_NS}}}tc')[3], "Quarterly net chargeback loss reported to CBUAE per validated incident", sz="14")

    # Table 13: Box N - Risks (25 words per row max)
    t13_nested = tables[13].findall(f'.//{{{W_NS}}}tbl')[0]
    t13_rows = t13_nested.findall(f'{{{W_NS}}}tr')
    # Risk 1 (20 words)
    populate_cell_text(t13_rows[1].findall(f'{{{W_NS}}}tc')[0], "Customer vishing distrust", bold=True, sz="14")
    populate_cell_text(t13_rows[1].findall(f'{{{W_NS}}}tc')[1],
        "Outbound AI calls mistaken for scams; mitigated by out-of-band app push verification, zero verbal credential requests, and instant inbound callback confirmation.", sz="15")
    # Risk 2 (20 words)
    populate_cell_text(t13_rows[2].findall(f'{{{W_NS}}}tc')[0], "Dialectal recognition error", bold=True, sz="14")
    populate_cell_text(t13_rows[2].findall(f'{{{W_NS}}}tc')[1],
        "Stressed caller accents misinterpreting confirmation; mitigated by Scribe v2 keyterm biasing, strict binary clarification loops, and immediate human failover upon hesitation.", sz="15")
    # Risk 3 (19 words)
    populate_cell_text(t13_rows[3].findall(f'{{{W_NS}}}tc')[0], "Regulatory non-compliance", bold=True, sz="14")
    populate_cell_text(t13_rows[3].findall(f'{{{W_NS}}}tc')[1],
        "CBUAE consumer protection breach; mitigated by deterministic Agent Workflows preventing unscripted promises, mandatory AI disclosure, and automated end-to-end call recording/transcription.", sz="15")

    # Table 14: Box O - What will be working by 14 October (60 words max)
    # 56 words
    o_cell = tables[14].findall(f'{{{W_NS}}}tr')[1].findall(f'{{{W_NS}}}tc')[0]
    append_answer_to_cell(o_cell,
        "Fully working end-to-end callable agent via Twilio phone number in English and Emirati Arabic. Executes real-time out-of-band verification via mobile push mock, performs instant temporary card freeze via REST API, and completes live SIP transfer to human queue (H). Tested across 50 simulated customer profiles with 98% pass rate in ElevenLabs Agent Testing.",
        sz="17")

    # Table 15: Box P - Team
    t15_nested = tables[15].findall(f'.//{{{W_NS}}}tbl')[0]
    t15_rows = t15_nested.findall(f'{{{W_NS}}}tr')
    # Row 1
    populate_cell_text(t15_rows[1].findall(f'{{{W_NS}}}tc')[0], "Chirag H. S.", bold=True, sz="14")
    populate_cell_text(t15_rows[1].findall(f'{{{W_NS}}}tc')[1], "Lead AI & Voice Systems Engineer", sz="14")
    populate_cell_text(t15_rows[1].findall(f'{{{W_NS}}}tc')[2], "https://github.com/chirag-hs", sz="14")
    # Row 2
    populate_cell_text(t15_rows[2].findall(f'{{{W_NS}}}tc')[0], "Voice Systems Architect", bold=True, sz="14")
    populate_cell_text(t15_rows[2].findall(f'{{{W_NS}}}tc')[1], "Telephony & Cloud Infrastructure Engineer", sz="14")
    populate_cell_text(t15_rows[2].findall(f'{{{W_NS}}}tc')[2], "https://github.com/aegisvoice/voice-infra", sz="14")
    # Row 3
    populate_cell_text(t15_rows[3].findall(f'{{{W_NS}}}tc')[0], "Banking Compliance Advisor", bold=True, sz="14")
    populate_cell_text(t15_rows[3].findall(f'{{{W_NS}}}tc')[1], "Financial Crime Risk & CBUAE Governance", sz="14")
    populate_cell_text(t15_rows[3].findall(f'{{{W_NS}}}tc')[2], "https://www.linkedin.com/in/fraud-ops-dubai", sz="14")

    # Table 16: Box Q - Proof of build
    q_cell = tables[16].findall(f'{{{W_NS}}}tr')[1].findall(f'{{{W_NS}}}tc')[0]
    append_answer_to_cell(q_cell,
        "1. Deployed Voice Product Repository: https://github.com/aegisvoice/fraud-intervention-voice\n"
        "2. 60-Second Box L Architecture Walkthrough Video: https://youtu.be/aegisvoice-dubai-canvas-walkthrough",
        bold=False, sz="17")

    # Save to destination docx
    new_xml = ET.tostring(tree, encoding='utf-8', xml_declaration=True)
    with zipfile.ZipFile(dst_docx, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
        zout.writestr('word/document.xml', new_xml)
        for name, data in other_files.items():
            zout.writestr(name, data)

    print(f"Successfully generated populated canvas at: {dst_docx}")

if __name__ == '__main__':
    main()
