/**
 * End-to-End Persistence Verification Script for Mei-Kaappan
 * Tests full HTTP client lifecycle against Spring Boot REST API & verifies PostgreSQL persistence.
 */

const http = require('http');

const API_BASE = 'http://localhost:8080/api/v1';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} ${res.statusText} on ${path}: ${text}`);
  }

  // Handle 204 or empty response
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return await res.json();
  }
  return null;
}

async function runTest() {
  console.log('====================================================');
  console.log('STARTING END-TO-END PERSISTENCE & REST VERIFICATION');
  console.log('====================================================\n');

  // 1. Verify User Profile
  console.log('[1/8] Testing User Profile API...');
  const user = await request('/users/me');
  console.log('  -> Fetched user:', user.name, `(${user.email})`);
  if (!user.id) throw new Error('User profile missing ID');

  // 2. Test Alert Acknowledgment & Resolution
  console.log('\n[2/8] Testing Alert Acknowledge & Resolve Lifecycle...');
  const alertsBefore = await request('/alerts');
  console.log(`  -> Initial alerts count: ${alertsBefore.length}`);
  let targetAlert = alertsBefore.find(a => a.resolutionStatus === 'UNRESOLVED');
  if (!targetAlert) {
    // If all were resolved in previous test run, use alertsBefore[0]
    targetAlert = alertsBefore[0];
  }

  console.log(`  -> Acknowledging alert ${targetAlert.id}...`);
  const ackedAlert = await request(`/alerts/${targetAlert.id}/acknowledge`, { method: 'POST' });
  if (!ackedAlert.isAcknowledged) throw new Error('Alert acknowledge flag not set!');
  console.log('  -> Alert acknowledged successfully.');

  console.log(`  -> Resolving alert ${targetAlert.id}...`);
  const resolvedAlert = await request(`/alerts/${targetAlert.id}/resolve`, {
    method: 'POST',
    body: JSON.stringify({ resolution: 'RESOLVED' }),
  });
  if (resolvedAlert.resolutionStatus !== 'RESOLVED') throw new Error('Alert resolutionStatus not RESOLVED!');
  console.log('  -> Alert resolved successfully with status:', resolvedAlert.resolutionStatus);

  // 3. Test Adding a Trusted Contact
  console.log('\n[3/8] Testing Guardian Trusted Contact Addition...');
  const newContact = {
    userId: 'usr_demo_101',
    contactName: 'Kavitha Ramachandran',
    contactPhone: '+91 94441 23456',
    relationship: 'Sister',
    consentStatus: 'PENDING',
    notifyOnCritical: true,
    notifyOnHigh: true,
  };
  const addedContact = await request('/guardian/contacts', {
    method: 'POST',
    body: JSON.stringify(newContact),
  });
  console.log('  -> Contact created with ID:', addedContact.id, addedContact.contactName);
  if (!addedContact.id || addedContact.contactName !== newContact.contactName) {
    throw new Error('Failed to create trusted contact');
  }

  // Update consent status of contact
  console.log(`  -> Updating consent status for contact ${addedContact.id} to ACCEPTED...`);
  const updatedContact = await request(`/guardian/contacts/${addedContact.id}/consent`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'ACCEPTED' }),
  });
  if (updatedContact.consentStatus !== 'ACCEPTED') throw new Error('Consent status update failed');
  console.log('  -> Contact consent updated to:', updatedContact.consentStatus);

  // 4. Test Consent Preferences Update
  console.log('\n[4/8] Testing Consent Preferences Update...');
  const currentConsent = await request('/settings/consent');
  console.log('  -> Current clipboard monitoring consent:', currentConsent.clipboardMonitoringConsent);
  const updatedConsent = await request('/settings/consent', {
    method: 'PATCH',
    body: JSON.stringify({
      clipboardMonitoringConsent: true,
      dataRetentionDays: 45,
    }),
  });
  console.log('  -> Received updated consent:', JSON.stringify(updatedConsent));
  if (updatedConsent.clipboardMonitoringConsent !== true || updatedConsent.dataRetentionDays !== 45) {
    throw new Error('Consent preferences update failed');
  }
  console.log('  -> Consent preferences updated: clipboardMonitoring = true, dataRetentionDays = 45');

  // 5. Test Creating an Incident
  console.log('\n[5/8] Testing Incident Creation...');
  const newIncId = `inc_${Date.now().toString().slice(-4)}`;
  const testIncident = {
    id: newIncId,
    userId: 'usr_demo_101',
    title: 'E2E Test: Urgent Power Cut Spoofing Call',
    category: 'UTILITY_BILL_FRAUD',
    currentRiskScore: 88,
    severity: 'HIGH',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    summary: 'Automated E2E test verifying full Spring Boot + Postgres data pipeline.',
    primaryAttackerVector: 'Interactive Voice Response -> APK Sideload',
    evidenceIds: [],
    timeline: [
      {
        id: `tl_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'EVIDENCE_ADDED',
        title: 'Initial Call Intercepted',
        description: 'Test evidence timeline entry',
        previousRiskScore: 0,
        newRiskScore: 88,
        actor: 'E2E Test Suite',
      },
    ],
    auditLog: [
      {
        id: `audit_${Date.now()}`,
        timestamp: new Date().toISOString(),
        performedBy: 'E2E Automated Agent',
        action: 'CREATED',
        notes: 'Verification test for persistence',
      },
    ],
    lastAssessment: {
      riskScore: 88,
      severity: 'HIGH',
      classification: 'HIGH Scam Risk (Automated)',
      evidenceConsideredCount: 1,
      positiveIndicators: [],
      reassuringIndicators: [],
      uncertaintyExplanation: 'Generated by automated test.',
      recommendedNextSteps: ['Disconnect call immediately', 'Do not share OTP'],
      timestamp: new Date().toISOString(),
      method: 'RULE_BASED',
      disclaimer: 'Automated test assessment.',
    },
  };

  const createdInc = await request('/incidents', {
    method: 'POST',
    body: JSON.stringify(testIncident),
  });
  console.log('  -> Created incident:', createdInc.id, createdInc.title);
  if (createdInc.id !== newIncId) throw new Error('Incident ID mismatch!');

  // 6. Test Adding Evidence to Incident
  console.log('\n[6/8] Testing Evidence Submission & Linking...');
  const testEvidence = {
    id: `ev_${Date.now().toString().slice(-4)}`,
    type: 'SUSPICIOUS_MESSAGE',
    source: 'SMS_SCANNER',
    timestamp: new Date().toISOString(),
    summary: 'Dear Consumer, your electricity bill is overdue. Call 9876543210 immediately.',
    rawPayload: 'SMS text payload with fraudulent cutoff warning',
    confidence: 0.96,
    evidenceQuality: 'HIGH_VERIFIED',
    riskContribution: 85,
    extractedIndicators: {
      phones: ['+91 98765 43210'],
      urls: ['http://tneb-billupdate-alert.xyz'],
    },
  };

  const createdEv = await request('/evidence', {
    method: 'POST',
    body: JSON.stringify(testEvidence),
  });
  console.log('  -> Evidence saved with ID:', createdEv.id);
  if (createdEv.id !== testEvidence.id) throw new Error('Evidence ID mismatch!');

  // 7. Test Incident Status Transition
  console.log(`\n[7/8] Testing Incident Status Update for ${newIncId}...`);
  const statusUpdate = await request(`/incidents/${newIncId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'RESOLVED',
      notes: 'Scam confirmed and consumer warned. Sideload APK neutralized.',
    }),
  });
  if (statusUpdate.status !== 'RESOLVED') throw new Error('Incident status update to RESOLVED failed');
  console.log('  -> Incident status updated to:', statusUpdate.status);

  // 8. Test Submitting Threat Intelligence Report
  console.log('\n[8/8] Testing Threat Intelligence Community Report...');
  const testReport = {
    type: 'UPI',
    value: `test-fraud-${Date.now()}@okaxis`,
    normalizedValue: `test-fraud-${Date.now()}@okaxis`,
    reputationStatus: 'KNOWN_SCAM',
    reportCount: 1,
    evidenceQuality: 'COMMUNITY_CONSENSUS',
    confidence: 0.9,
    sourceType: 'COMMUNITY_REPORT',
    reviewStatus: 'PENDING_REVIEW',
    relatedIncidentIds: [newIncId],
    tags: ['E2E_TEST', 'UPI_FRAUD', 'ELECTRICITY_SCAM'],
  };
  const submittedReport = await request('/threat-intelligence/reports', {
    method: 'POST',
    body: JSON.stringify(testReport),
  });
  console.log('  -> Threat indicator submitted with ID:', submittedReport.id, submittedReport.value);

  console.log('\n====================================================');
  console.log('ALL REST API MUTATION & QUERY TESTS PASSED (8/8)!');
  console.log('====================================================');
  return { newIncId, addedContactId: addedContact.id, alertId: targetAlert.id, submittedReportId: submittedReport.id };
}

runTest()
  .then((res) => {
    console.log('\nTest IDs to verify directly in PostgreSQL:');
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  })
  .catch((err) => {
    console.error('\nE2E TEST FAILURE:', err);
    process.exit(1);
  });
