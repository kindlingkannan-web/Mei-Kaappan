-- Mei-Kaappan Database Schema Migration V1
-- Target Database: PostgreSQL 12+

CREATE TABLE IF NOT EXISTS user_profiles (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    guardian_mode_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    role VARCHAR(32) NOT NULL DEFAULT 'USER',
    active_device_id VARCHAR(64) DEFAULT 'dev_demo_01',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consent_preferences (
    id VARCHAR(64) PRIMARY KEY,
    share_threat_intel BOOLEAN NOT NULL DEFAULT TRUE,
    telemetry_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    guardian_alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sms_scanning_consent BOOLEAN NOT NULL DEFAULT TRUE,
    clipboard_monitoring_consent BOOLEAN NOT NULL DEFAULT FALSE,
    share_critical_alerts_only BOOLEAN NOT NULL DEFAULT TRUE,
    data_retention_days INT NOT NULL DEFAULT 30,
    allow_anonymous_threat_reporting BOOLEAN NOT NULL DEFAULT TRUE,
    local_rule_processing_only BOOLEAN NOT NULL DEFAULT FALSE,
    simplified_explanations BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) DEFAULT 'usr_demo_101',
    category VARCHAR(64) NOT NULL DEFAULT 'BANKING_KYC_IMPERSONATION',
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    severity VARCHAR(32) NOT NULL,
    current_risk_score INT NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    primary_attacker_vector VARCHAR(64) NOT NULL,
    financial_exposure_amount NUMERIC(14, 2),
    target_asset VARCHAR(255),
    explanation_narrative TEXT,
    evidence_ids TEXT,
    risk_breakdown TEXT,
    timeline TEXT,
    recommended_actions TEXT,
    assigned_analyst VARCHAR(128)
);

CREATE TABLE IF NOT EXISTS evidence_events (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64),
    type VARCHAR(32) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    severity VARCHAR(32) NOT NULL,
    risk_points INT NOT NULL,
    source VARCHAR(128) NOT NULL,
    heuristic_rule VARCHAR(255) NOT NULL,
    explanation TEXT NOT NULL,
    payload TEXT,
    confidence NUMERIC(4, 2) DEFAULT 0.95,
    evidence_quality VARCHAR(64) DEFAULT 'HIGH_VERIFIED',
    normalized_value TEXT
);

CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(32) NOT NULL,
    channel VARCHAR(32) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    is_acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
    resolution_status VARCHAR(32) NOT NULL DEFAULT 'UNRESOLVED',
    action_url VARCHAR(255),
    guardian_notified BOOLEAN NOT NULL DEFAULT FALSE,
    guardian_acknowledged BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS threat_indicators (
    id VARCHAR(64) PRIMARY KEY,
    type VARCHAR(32) NOT NULL,
    value VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(64) NOT NULL,
    reputation_status VARCHAR(32) NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL DEFAULT 0.85,
    report_count INT NOT NULL DEFAULT 1,
    first_reported TIMESTAMPTZ NOT NULL,
    last_reported TIMESTAMPTZ NOT NULL,
    tags TEXT,
    associated_scam_vector VARCHAR(128),
    normalized_value VARCHAR(255),
    evidence_quality VARCHAR(64) DEFAULT 'HIGH_OFFICIAL',
    source_type VARCHAR(64) DEFAULT 'COMMUNITY_REPORT',
    review_status VARCHAR(64) DEFAULT 'VERIFIED'
);

CREATE TABLE IF NOT EXISTS device_info (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) DEFAULT 'usr_demo_101',
    device_model VARCHAR(128) NOT NULL,
    os_version VARCHAR(64) NOT NULL,
    security_patch_level VARCHAR(64) NOT NULL,
    last_audit_timestamp TIMESTAMPTZ NOT NULL,
    health_score INT NOT NULL,
    active_threat_count INT NOT NULL DEFAULT 3,
    developer_options_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    unknown_sources_allowed BOOLEAN NOT NULL DEFAULT FALSE,
    active_vpn_detected BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS device_findings (
    id VARCHAR(64) PRIMARY KEY,
    device_id VARCHAR(64) NOT NULL,
    category VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    package_name VARCHAR(128),
    description TEXT NOT NULL,
    severity VARCHAR(32) NOT NULL,
    risk_weight INT NOT NULL DEFAULT 25,
    remediation TEXT NOT NULL,
    detected_at TIMESTAMPTZ NOT NULL,
    evidence_source VARCHAR(64) DEFAULT 'ANDROID_CLIENT_SIMULATOR',
    review_status VARCHAR(32) NOT NULL DEFAULT 'UNRESOLVED'
);

CREATE TABLE IF NOT EXISTS trusted_contacts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) DEFAULT 'usr_demo_101',
    name VARCHAR(128) NOT NULL,
    relationship VARCHAR(64) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(128) NOT NULL,
    notification_channels TEXT,
    consent_status VARCHAR(32) NOT NULL,
    invited_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    notify_on_critical BOOLEAN NOT NULL DEFAULT TRUE,
    notify_on_high BOOLEAN NOT NULL DEFAULT TRUE,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS user_feedbacks (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64),
    target_type VARCHAR(64) DEFAULT 'INCIDENT',
    target_id VARCHAR(64),
    label VARCHAR(32) DEFAULT 'CORRECT',
    rating INT NOT NULL DEFAULT 5,
    helpful BOOLEAN NOT NULL DEFAULT TRUE,
    comments TEXT,
    user_action_taken VARCHAR(64),
    submitted_by VARCHAR(64) DEFAULT 'usr_demo_101',
    timestamp TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS model_evaluations (
    id VARCHAR(64) PRIMARY KEY,
    version VARCHAR(32) NOT NULL,
    model_name VARCHAR(128) DEFAULT 'Mei-Kaappan Scam Classifier Ensemble',
    dataset_version VARCHAR(64) DEFAULT 'v2.1-corpus-india',
    accuracy NUMERIC(6, 4) NOT NULL,
    precision_rate NUMERIC(6, 4) NOT NULL,
    recall_rate NUMERIC(6, 4) NOT NULL,
    f1_score NUMERIC(6, 4) NOT NULL,
    evaluated_at TIMESTAMPTZ NOT NULL,
    total_test_samples INT NOT NULL,
    false_positive_rate NUMERIC(6, 4) NOT NULL,
    false_negative_rate NUMERIC(6, 4) NOT NULL
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_evidence_incident_id ON evidence_events(incident_id);
CREATE INDEX IF NOT EXISTS idx_alerts_incident_id ON alerts(incident_id);
CREATE INDEX IF NOT EXISTS idx_alerts_resolution ON alerts(resolution_status);
CREATE INDEX IF NOT EXISTS idx_threat_indicators_value ON threat_indicators(value);
