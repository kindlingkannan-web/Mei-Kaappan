/**
 * Mei-Kaappan — Device Exposure Assessment Engine
 * Simulates and evaluates Android client security posture:
 * - Accessibility Service Abuse
 * - Screen Overlay (SYSTEM_ALERT_WINDOW)
 * - Notification Listener (OTP Interception)
 * - Remote Access Applications (AnyDesk, TeamViewer)
 * - Sideloaded APK from untrusted sources
 * 
 * NOTE: The web dashboard simulates findings for demonstration.
 * In production, an Android Java companion service submits real, consented scan payloads.
 */

import { DeviceFinding, Severity, DeviceInfo } from '../types';

export const SAMPLE_SIMULATED_FINDINGS: Omit<DeviceFinding, 'id' | 'deviceId' | 'detectionTimestamp'>[] = [
  {
    appOrSettingName: 'AnyDesk Remote Support',
    packageName: 'com.anydesk.anydeskandroid',
    category: 'REMOTE_ACCESS_TOOL',
    severity: 'HIGH',
    evidenceSource: 'ANDROID_CLIENT_SIMULATOR',
    explanation: 'Remote desktop tool installed with unattended access capabilities. Scammers frequently coerce victims to install this to observe screen and steal credentials.',
    recommendedRemediation: 'If you were instructed by a caller to install this app, uninstall it immediately.',
    reviewStatus: 'UNRESOLVED',
  },
  {
    appOrSettingName: 'Sideloaded "ElectricityBill_Update.apk"',
    packageName: 'com.utility.billpay.update',
    category: 'ACCESSIBILITY_ABUSE',
    severity: 'CRITICAL',
    evidenceSource: 'ANDROID_CLIENT_SIMULATOR',
    explanation: 'Unsigned package installed outside Google Play Store has requested Accessibility Service permissions. This enables keystroke logging and full screen capture.',
    recommendedRemediation: 'Revoke Accessibility Service permission in Android Settings > Accessibility, then uninstall the APK.',
    reviewStatus: 'UNRESOLVED',
  },
  {
    appOrSettingName: 'SMS / Notification Listener Active',
    packageName: 'com.device.notif.sync',
    category: 'NOTIFICATION_LISTENER',
    severity: 'CRITICAL',
    evidenceSource: 'ANDROID_CLIENT_SIMULATOR',
    explanation: 'Third-party app has permission to read all incoming notifications, allowing it to secretly intercept 2FA bank OTPs.',
    recommendedRemediation: 'Revoke "Notification Access" permission under Special App Access settings.',
    reviewStatus: 'UNRESOLVED',
  },
  {
    appOrSettingName: 'Display Over Other Apps (Overlay)',
    packageName: 'com.quicksupport.helper',
    category: 'OVERLAY_PERMISSION',
    severity: 'HIGH',
    evidenceSource: 'ANDROID_CLIENT_SIMULATOR',
    explanation: 'App can draw fake login transparent overlays on top of genuine banking apps to harvest passwords.',
    recommendedRemediation: 'Turn off "Allow display over other apps" permission for this package.',
    reviewStatus: 'UNRESOLVED',
  },
  {
    appOrSettingName: 'Developer Options & USB Debugging',
    category: 'UNKNOWN_PERMISSION',
    severity: 'SUSPICIOUS',
    evidenceSource: 'SYSTEM_AUDIT',
    explanation: 'USB Debugging is enabled on the device, lowering sandbox protections against tethered ADB extraction.',
    recommendedRemediation: 'Turn off Developer Options in Android Settings if not actively needed.',
    reviewStatus: 'UNRESOLVED',
  },
];

export function runSimulatedDeviceScan(deviceId: string = 'dev_demo_01'): {
  findings: DeviceFinding[];
  deviceInfo: DeviceInfo;
  overallScore: number;
  overallSeverity: Severity;
} {
  const now = new Date().toISOString();

  // Pick a realistic sample of findings for the simulation
  const findings: DeviceFinding[] = SAMPLE_SIMULATED_FINDINGS.map((sample, idx) => ({
    ...sample,
    id: `finding_${Date.now()}_${idx}`,
    deviceId,
    detectionTimestamp: now,
  }));

  // Calculate health score: 100 minus severity weights
  let deductions = 0;
  for (const f of findings) {
    if (f.severity === 'CRITICAL') deductions += 35;
    else if (f.severity === 'HIGH') deductions += 20;
    else if (f.severity === 'SUSPICIOUS') deductions += 10;
  }

  const overallScore = Math.max(15, 100 - deductions);

  let overallSeverity: Severity = 'SAFE';
  if (overallScore < 45) overallSeverity = 'CRITICAL';
  else if (overallScore < 70) overallSeverity = 'HIGH';
  else if (overallScore < 85) overallSeverity = 'SUSPICIOUS';
  else overallSeverity = 'SAFE';

  const deviceInfo: DeviceInfo = {
    id: deviceId,
    userId: 'usr_demo_101',
    deviceName: 'Samsung Galaxy S23 (Simulated Android Client)',
    platform: 'ANDROID',
    osVersion: 'Android 14 (OneUI 6.1)',
    lastScanTimestamp: now,
    securityHealthScore: overallScore,
    activeThreatCount: findings.filter((f) => f.reviewStatus === 'UNRESOLVED').length,
  };

  return {
    findings,
    deviceInfo,
    overallScore,
    overallSeverity,
  };
}
