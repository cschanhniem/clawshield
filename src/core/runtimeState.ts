import { createHash } from "node:crypto";
import type { ClawShieldConfig, RuntimeMode } from "./config.js";
import type { Finding, RiskEvaluation } from "../types/domain.js";

export interface SessionRiskSnapshot {
  evaluation: RiskEvaluation;
  lastUpdatedAt: number;
  fingerprint: string;
}

export interface IncidentRecord {
  key: string;
  title: string;
  severity: string;
  score: number;
  at: number;
  findingIds: string[];
}

export class ClawShieldRuntimeState {
  private readonly evaluationCache = new Map<string, RiskEvaluation>();
  private readonly sessionRisk = new Map<string, SessionRiskSnapshot>();
  private readonly notificationGate = new Map<string, { fingerprint: string; lastEmittedAt: number; suppressedCount: number }>();
  private readonly incidents: IncidentRecord[] = [];
  private modeOverride: RuntimeMode | undefined;

  constructor(private readonly config: ClawShieldConfig) {}

  fingerprint(input: string): string {
    return createHash("sha1").update(input).digest("hex").slice(0, 12);
  }

  getEffectiveMode(): RuntimeMode {
    return this.modeOverride ?? this.config.mode;
  }

  setModeOverride(mode: RuntimeMode | undefined): void {
    this.modeOverride = mode;
  }

  evaluateCached(content: string, compute: () => RiskEvaluation): RiskEvaluation {
    const key = this.fingerprint(content);
    const cached = this.evaluationCache.get(key);
    if (cached) {
      return cached;
    }

    const result = compute();
    this.evaluationCache.set(key, result);
    if (this.evaluationCache.size > this.config.cacheSize) {
      const oldest = this.evaluationCache.keys().next().value;
      if (oldest) {
        this.evaluationCache.delete(oldest);
      }
    }
    return result;
  }

  recordSessionRisk(sessionKey: string, evaluation: RiskEvaluation): SessionRiskSnapshot {
    const snapshot: SessionRiskSnapshot = {
      evaluation,
      lastUpdatedAt: Date.now(),
      fingerprint: this.fingerprint(
        `${evaluation.score}:${evaluation.findings.map((finding) => finding.id).sort().join(",")}`
      )
    };
    this.sessionRisk.set(sessionKey, snapshot);
    this.recordIncident(sessionKey, evaluation.findings, evaluation.score);
    this.cleanup();
    return snapshot;
  }

  getSessionRisk(sessionKey: string | undefined): SessionRiskSnapshot | undefined {
    if (!sessionKey) {
      return undefined;
    }
    const snapshot = this.sessionRisk.get(sessionKey);
    if (!snapshot) {
      return undefined;
    }
    if (Date.now() - snapshot.lastUpdatedAt > this.config.incidentTtlMs) {
      this.sessionRisk.delete(sessionKey);
      return undefined;
    }
    return snapshot;
  }

  shouldNotify(targetKey: string, fingerprint: string): { notify: boolean; suppressedCount: number } {
    const gate = this.notificationGate.get(targetKey);
    const now = Date.now();

    if (!gate || gate.fingerprint !== fingerprint || now - gate.lastEmittedAt > this.config.throttleWindowMs) {
      this.notificationGate.set(targetKey, {
        fingerprint,
        lastEmittedAt: now,
        suppressedCount: 0
      });
      return { notify: true, suppressedCount: gate?.suppressedCount ?? 0 };
    }

    gate.suppressedCount += 1;
    return { notify: false, suppressedCount: gate.suppressedCount };
  }

  getRecentIncidents(limit: number): IncidentRecord[] {
    this.cleanup();
    return this.incidents.slice(-limit).reverse();
  }

  findRecentFinding(findingId: string): IncidentRecord | undefined {
    this.cleanup();
    return [...this.incidents].reverse().find((incident) => incident.findingIds.includes(findingId));
  }

  private recordIncident(key: string, findings: Finding[], score: number): void {
    if (findings.length === 0) {
      return;
    }

    const highest = findings.reduce((current, finding) =>
      finding.score > current.score ? finding : current
    );

    this.incidents.push({
      key,
      title: highest.title,
      severity: highest.severity,
      score,
      at: Date.now(),
      findingIds: findings.map((finding) => finding.id)
    });
  }

  cleanup(): void {
    const cutoff = Date.now() - this.config.incidentTtlMs;

    for (const [key, snapshot] of this.sessionRisk.entries()) {
      if (snapshot.lastUpdatedAt < cutoff) {
        this.sessionRisk.delete(key);
      }
    }

    for (const [key, gate] of this.notificationGate.entries()) {
      if (gate.lastEmittedAt < cutoff) {
        this.notificationGate.delete(key);
      }
    }

    while (this.incidents.length > 200) {
      this.incidents.shift();
    }
    while (this.incidents.length > 0 && this.incidents[0]?.at < cutoff) {
      this.incidents.shift();
    }
  }
}
