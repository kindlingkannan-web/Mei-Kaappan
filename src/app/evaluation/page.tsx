'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Info,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

export default function ModelEvaluationPage() {
  const { modelEvaluation, userFeedback } = useApp();

  if (!modelEvaluation) return null;

  const {
    modelName,
    version,
    datasetVersion,
    testSamplesCount,
    precision,
    recall,
    f1Score,
    confusionMatrix,
    falsePositiveExamples,
    comparisonWithBaseline,
  } = modelEvaluation;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-1">
          <Cpu className="w-3.5 h-3.5" />
          Model Governance & Calibration
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Model Evaluation & Validation Workspace
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Transparent metrics comparing experimental NLP language models against deterministic rule baselines.
        </p>
      </div>

      {/* Model Metadata Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              {version}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Dataset: {datasetVersion}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
            {modelName}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluated on {testSamplesCount.toLocaleString()} curated Indian cyber scam SMS & email samples.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-500 flex-shrink-0" />
          <span>Illustrative validation metrics for future ML model comparison.</span>
        </div>
      </div>

      {/* 3 Core Metrics Cards: Precision, Recall, F1 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Precision Score
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-500">
              {(precision * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Proportion of flagged scams that were genuine threats
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Recall (Sensitivity)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-500">
              {(recall * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Proportion of actual scam attacks correctly detected
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            F1-Harmonic Mean
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-500">
              {(f1Score * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Balanced harmonic measure of precision & recall
          </p>
        </div>
      </div>

      {/* Confusion Matrix & Baseline Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            2x2 Confusion Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Validation distribution across {testSamplesCount} test observations
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* TP */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <span className="text-[10px] font-bold uppercase tracking-wider block">
                True Positives (TP)
              </span>
              <span className="text-2xl font-black mt-1 block">
                {confusionMatrix.truePositives}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Correctly identified malicious scams
              </span>
            </div>

            {/* FP */}
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
              <span className="text-[10px] font-bold uppercase tracking-wider block">
                False Positives (FP)
              </span>
              <span className="text-2xl font-black mt-1 block">
                {confusionMatrix.falsePositives}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Legitimate messages incorrectly flagged
              </span>
            </div>

            {/* FN */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
              <span className="text-[10px] font-bold uppercase tracking-wider block">
                False Negatives (FN)
              </span>
              <span className="text-2xl font-black mt-1 block">
                {confusionMatrix.falseNegatives}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Scams missed by the model
              </span>
            </div>

            {/* TN */}
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
              <span className="text-[10px] font-bold uppercase tracking-wider block">
                True Negatives (TN)
              </span>
              <span className="text-2xl font-black mt-1 block">
                {confusionMatrix.trueNegatives}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Correctly cleared legitimate messages
              </span>
            </div>
          </div>
        </div>

        {/* Baseline Comparison */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Comparison Against Rule-Based Baseline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Measures gain over traditional regex keywords and blacklists
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Baseline Architecture:
                </span>
                <p className="text-slate-500 text-[11px]">
                  {comparisonWithBaseline.baselineType}
                </p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px]">
                  <div>
                    <span className="text-slate-400">Baseline Prec:</span>
                    <p className="font-bold font-mono">
                      {(comparisonWithBaseline.baselinePrecision * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Baseline Recall:</span>
                    <p className="font-bold font-mono">
                      {(comparisonWithBaseline.baselineRecall * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Baseline F1:</span>
                    <p className="font-bold font-mono">
                      {(comparisonWithBaseline.baselineF1 * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <TrendingUp className="w-5 h-5 flex-shrink-0" />
                <span className="font-bold">
                  {comparisonWithBaseline.relativeImprovement}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* False Positive Case Studies */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          False Positive Error Analysis & Linguistic Nuance
        </h3>
        <p className="text-xs text-slate-500">
          Analysis of test samples where urgency cues resembled phishing attacks but were benign.
        </p>

        <div className="space-y-3 text-xs">
          {falsePositiveExamples.map((ex, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Sample Text: &ldquo;{ex.text}&rdquo;
                </span>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <span className="text-emerald-500 font-semibold">
                  Actual: {ex.actual}
                </span>
                <span>&bull;</span>
                <span className="text-red-500 font-semibold">
                  Predicted: {ex.predicted}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                <strong>Failure Rationale:</strong> {ex.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* User Community Feedback Telemetry */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Community Feedback Stream ({userFeedback.length} submissions)
        </h3>
        <p className="text-xs text-slate-500">
          Direct user responses validating automated predictions.
        </p>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {userFeedback.map((fb) => (
            <div key={fb.id} className="py-3 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${
                      fb.label === 'CORRECT'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    User Label: {fb.label}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Target: #{fb.targetId} ({fb.targetType})
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic">
                  &ldquo;{fb.userComments}&rdquo;
                </p>
              </div>

              <span className="text-[11px] text-slate-400 whitespace-nowrap">
                {new Date(fb.timestamp).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
