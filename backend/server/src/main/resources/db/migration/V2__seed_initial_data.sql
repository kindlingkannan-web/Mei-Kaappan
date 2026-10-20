-- Mei-Kaappan Database Seed Migration V2
-- Initial baseline data matching prototype demonstration

-- User Profile
INSERT INTO user_profiles (id, name, email, phone, guardian_mode_enabled, role, created_at, updated_at)
VALUES ('usr_demo_101', 'Ramesh Sundaram', 'ramesh.sundaram@demo.meikaappan.org', '+91 98765 43210', TRUE, 'DEMO_USER', '2026-09-01T00:00:00Z', '2026-10-19T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Consent Preferences
INSERT INTO consent_preferences (id, share_threat_intel, telemetry_enabled, guardian_alerts_enabled, sms_scanning_consent, clipboard_monitoring_consent, updated_at)
VALUES ('pref_01', TRUE, TRUE, TRUE, TRUE, FALSE, '2026-10-19T08:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- Device Info
INSERT INTO device_info (id, device_model, os_version, security_patch_level, last_audit_timestamp, health_score, developer_options_enabled, unknown_sources_allowed, active_vpn_detected)
VALUES ('dev_demo_01', 'Samsung Galaxy S23 (Demo Android)', 'Android 14 (OneUI 6.1)', '2026-09-01', '2026-10-19T08:30:00Z', 42, TRUE, TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Device Findings
INSERT INTO device_findings (id, device_id, category, title, description, severity, risk_weight, remediation, detected_at, review_status)
VALUES 
('df_01', 'dev_demo_01', 'ACCESSIBILITY_ABUSE', 'ElectricityBill_Update.apk', 'Sideloaded unsigned application has Accessibility Service enabled. Scammers can intercept screen contents, passwords, and banking apps in the background.', 'CRITICAL', 40, 'Revoke Accessibility Service permission in Settings immediately, then uninstall this APK.', '2026-10-19T08:30:00Z', 'UNRESOLVED'),
('df_02', 'dev_demo_01', 'REMOTE_ACCESS_TOOL', 'AnyDesk Remote Support', 'Remote access application installed recently. Threat actors frequently instruct victims to download this tool to observe bank transfers.', 'HIGH', 25, 'If you were directed by an unknown caller to install this, remove it immediately.', '2026-10-19T08:30:00Z', 'UNRESOLVED'),
('df_03', 'dev_demo_01', 'NOTIFICATION_LISTENER', 'SMS / Notification Listener Active', 'App has permission to intercept incoming SMS and notification alerts, enabling remote 2FA OTP capture.', 'CRITICAL', 35, 'Revoke Notification Access under Special App Access settings.', '2026-10-19T08:30:00Z', 'UNRESOLVED')
ON CONFLICT (id) DO NOTHING;

-- Trusted Contacts
INSERT INTO trusted_contacts (id, name, relationship, phone, email, notification_channels, consent_status, invited_at, is_primary)
VALUES 
('contact_01', 'Arun Sundaram (Son)', 'Son', '+91 98765 11223', 'arun.sundaram@demo.org', '["SMS", "PUSH"]', 'ACCEPTED', '2026-09-15T10:00:00Z', TRUE),
('contact_02', 'Kavitha Ramesh (Spouse)', 'Spouse', '+91 98765 44556', 'kavitha.ramesh@demo.org', '["SMS"]', 'ACCEPTED', '2026-09-20T14:15:00Z', FALSE),
('contact_03', 'Priya Rajan (Daughter)', 'Daughter', '+91 98765 99887', 'priya.rajan@demo.org', '["PUSH"]', 'PENDING', '2026-10-18T09:00:00Z', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Evidence Events
INSERT INTO evidence_events (id, incident_id, type, timestamp, severity, risk_points, source, heuristic_rule, explanation, payload)
VALUES 
('ev_101', 'inc_8941', 'SUSPICIOUS_MESSAGE', '2026-10-17T18:14:00Z', 'CRITICAL', 35, 'SMS_GATEWAY_EXTRACTOR', 'EXTREME_URGENCY_WITH_DEADLINE', 'Urgent electricity disconnection threat claiming bill unpaid and requiring immediate action.', '{"rawPayload": "Dear Consumer, Your electricity power will be disconnected tonight at 9.30 PM from electricity office because your previous month bill was not updated. Please immediately contact our bill officer at 9845012345 or update at http://electricity-bill-pay.xyz"}'),
('ev_102', 'inc_8941', 'SUSPICIOUS_URL', '2026-10-17T18:25:00Z', 'CRITICAL', 30, 'URL_SCANNER_ENGINE', 'SUSPICIOUS_TLD_PHISHING', 'Phishing domain with suspicious .xyz TLD hosting fake bill payment landing page.', '{"rawPayload": "http://electricity-bill-pay.xyz"}'),
('ev_103', 'inc_8941', 'DEVICE_RISK', '2026-10-18T09:10:00Z', 'CRITICAL', 40, 'ANDROID_CLIENT_SIMULATOR', 'SIDELOADED_ACCESSIBILITY_ABUSE', 'Sideloaded APK "ElectricityBill_Update.apk" granted Accessibility permissions.', '{"rawPayload": "Package: com.utility.billpay.update | Permissions: BIND_ACCESSIBILITY_SERVICE, RECEIVE_SMS"}'),
('ev_104', 'inc_8941', 'PAYMENT_REQUEST', '2026-10-18T10:45:00Z', 'HIGH', 25, 'PRE_PAYMENT_SAFETY_CHECK', 'UNKNOWN_VPA_UNVERIFIED_MERCHANT', 'User submitted ₹10 verification payment request to electricity.billing.dept@okaxis.', '{"rawPayload": "VPA: electricity.billing.dept@okaxis, Amount: 10, Note: Bill Update"}')
ON CONFLICT (id) DO NOTHING;

-- Incidents
INSERT INTO incidents (id, title, summary, severity, current_risk_score, status, created_at, updated_at, primary_attacker_vector, financial_exposure_amount, target_asset, explanation_narrative, evidence_ids, risk_breakdown, timeline, recommended_actions)
VALUES 
('inc_8941', 'Targeted Electricity Bill Disconnection Scam Journey', 'Multi-stage social engineering journey starting from an alarming SMS warning of electricity cutoff, progressing to phishing domain visit, malicious APK sideload, and targeted UPI transfer verification.', 'CRITICAL', 92, 'ACTIVE', '2026-10-17T18:14:00Z', '2026-10-18T10:45:00Z', 'Phishing SMS -> Malicious APK -> Fake UPI', 10.00, 'Electricity bill update', 'Risk escalated from 35/100 to 92/100 as the victim advanced from receiving an initial coercive message to installing a remote access trojan APK.', '["ev_101", "ev_102", "ev_103", "ev_104"]', '[]', '[]', '[]'),
('inc_7820', 'Bank KYC Account Suspension Phishing via WhatsApp', 'Victim received an unverified WhatsApp message stating SBI savings account will be blocked within 24 hours unless KYC PAN documents are verified via lookalike portal.', 'HIGH', 78, 'ACTIVE', '2026-10-16T14:20:00Z', '2026-10-16T15:10:00Z', 'WhatsApp Message -> Lookalike Domain', 0.00, 'Bank Account KYC Credentials', 'Urgent panic induction combined with deceptive domain registration imitating State Bank of India.', '["ev_201"]', '[]', '[]', '[]'),
('inc_6512', 'Digital Arrest Extortion Threat via Spoofed Police Number', 'Victim contacted by impersonator claiming to be Cyber Crime Branch inspector demanding video KYC and penalty payment for alleged illegal parcel.', 'CRITICAL', 96, 'UNDER_REVIEW', '2026-10-15T11:00:00Z', '2026-10-15T13:30:00Z', 'Voice Spoofing -> Video Extortion Call -> Demanded RTGS', 250000.00, 'Savings deposit', 'Severe psychological intimidation with fake judicial documents and continuous surveillance demand.', '["ev_301"]', '[]', '[]', '[]'),
('inc_5190', 'E-Commerce Festival Lottery Cashback Claim', 'SMS claiming prize of ₹25,000 won in festive lucky draw requiring ₹500 registration fee payment via UPI QR code.', 'SUSPICIOUS', 58, 'RESOLVED', '2026-10-12T09:15:00Z', '2026-10-12T10:00:00Z', 'SMS Phishing -> QR Code Advance Fee', 500.00, 'UPI Wallet', 'Advance-fee fraud relying on greed and lottery lure. Blocked prior to payment execution.', '["ev_401"]', '[]', '[]', '[]')
ON CONFLICT (id) DO NOTHING;

-- Alerts
INSERT INTO alerts (id, incident_id, title, message, severity, channel, timestamp, is_read, is_acknowledged, resolution_status, action_url)
VALUES 
('alt_901', 'inc_8941', 'Critical Scam Escalation: Unsigned APK Active', 'Malicious app with Accessibility permissions detected immediately after phishing SMS interaction.', 'CRITICAL', 'PUSH', '2026-10-18T09:12:00Z', FALSE, FALSE, 'UNRESOLVED', '/incidents/inc_8941'),
('alt_902', 'inc_8941', 'Pre-Payment Hazard Warning', 'UPI transfer initiated to flagged unverified VPA electricity.billing.dept@okaxis.', 'HIGH', 'IN_APP', '2026-10-18T10:46:00Z', FALSE, FALSE, 'UNRESOLVED', '/payment-check'),
('alt_903', 'inc_6512', 'Extortion Defense: Guardian Alert Dispatched', 'Digital Arrest extortion pattern detected. Notification sent to primary trusted guardian.', 'CRITICAL', 'SMS', '2026-10-15T11:05:00Z', TRUE, TRUE, 'RESOLVED', '/guardian')
ON CONFLICT (id) DO NOTHING;

-- Threat Indicators
INSERT INTO threat_indicators (id, type, value, category, reputation_status, confidence_score, report_count, first_reported, last_reported, tags, associated_scam_vector)
VALUES 
('ind_01', 'URL', 'http://electricity-bill-pay.xyz', 'PHISHING', 'MALICIOUS', 98, 47, '2026-10-10T00:00:00Z', '2026-10-18T10:00:00Z', '["utility", "phishing", "malicious_apk"]', 'Fake Electricity Disconnection'),
('ind_02', 'UPI', 'electricity.billing.dept@okaxis', 'FRAUDULENT_VPA', 'MALICIOUS', 95, 32, '2026-10-12T00:00:00Z', '2026-10-18T10:45:00Z', '["fake_merchant", "utility_scam"]', 'Fake Electricity Disconnection'),
('ind_03', 'PHONE', '+91 98450 12345', 'SCAM_CALLER', 'SUSPICIOUS', 88, 19, '2026-10-14T00:00:00Z', '2026-10-17T18:14:00Z', '["impersonation", "spoofed"]', 'Utility Bill Impersonation'),
('ind_04', 'URL', 'https://sbi-kyc-update-portal.online', 'PHISHING', 'MALICIOUS', 99, 114, '2026-09-28T00:00:00Z', '2026-10-19T00:00:00Z', '["bank_phishing", "credential_theft"]', 'SBI KYC Phishing'),
('ind_05', 'PHONE', '+91 80001 99999', 'EXTORTION', 'MALICIOUS', 96, 63, '2026-10-01T00:00:00Z', '2026-10-15T11:00:00Z', '["police_impersonation", "digital_arrest"]', 'Digital Arrest Cyber Cell')
ON CONFLICT (id) DO NOTHING;

-- User Feedback
INSERT INTO user_feedbacks (id, incident_id, rating, helpful, comments, user_action_taken, timestamp)
VALUES 
('fb_001', 'inc_8941', 5, TRUE, 'The explanation of the APK permission abuse stopped me from entering my UPI PIN. Very clear guidance!', 'UNINSTALLED_APK', '2026-10-18T12:00:00Z'),
('fb_002', 'inc_5190', 4, TRUE, 'Immediately recognized the festive reward lure as advance-fee fraud.', 'DELETED_SMS', '2026-10-12T11:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Model Evaluation
INSERT INTO model_evaluations (id, version, accuracy, precision_rate, recall_rate, f1_score, evaluated_at, total_test_samples, false_positive_rate, false_negative_rate)
VALUES 
('eval_v1_0', 'v1.4.2-ensemble', 0.9640, 0.9580, 0.9710, 0.9644, '2026-10-19T00:00:00Z', 2500, 0.0420, 0.0290)
ON CONFLICT (id) DO NOTHING;
