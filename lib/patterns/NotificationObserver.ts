/**
 * OBSERVER PATTERN — Notification fan-out
 *
 * Intent
 *   When a domain event fires (job posted, proposal received, review left)
 *   any number of channels must react: in-app toast, email, SMS, webhook,
 *   audit log. Hard-coding each consumer at the publisher would couple the
 *   API route to every channel; the Observer pattern decouples them.
 *
 * Why an Observer here
 *   New channels can be added (push notifications, Slack alerts, etc.) by
 *   `subject.subscribe(...)` without editing the publisher. Each observer
 *   handles its own failure isolation.
 *
 * SRS reference: DC-2 — pattern #3; supports REQ-5.x (Notifications).
 *
 * Note: this module is intentionally framework-agnostic. Channel observers
 * are stub-implemented for the academic prototype; production wiring would
 * inject real Twilio / SendGrid / WebSocket clients.
 */

export type DomainEvent =
  | { type: "job.posted";        jobId: string; clientId: string;     title: string }
  | { type: "proposal.created";  jobId: string; freelancerId: string; budget: number }
  | { type: "proposal.accepted"; proposalId: string; jobId: string;   freelancerId: string }
  | { type: "review.created";    jobId: string; freelancerId: string; rating: number };

export interface Observer {
  readonly name: string;
  notify(event: DomainEvent): Promise<void> | void;
}

export class NotificationSubject {
  private observers: Observer[] = [];

  subscribe(o: Observer): () => void {
    this.observers.push(o);
    return () => {
      this.observers = this.observers.filter((x) => x !== o);
    };
  }

  async publish(event: DomainEvent): Promise<void> {
    // Fan-out concurrently; one observer's failure must not block the others.
    await Promise.allSettled(
      this.observers.map(async (o) => {
        try { await o.notify(event); }
        catch (err) {
          console.error(`[Observer:${o.name}] failed for ${event.type}:`, err);
        }
      })
    );
  }
}

// ── Concrete observers (stubs for academic demo) ──────────────────────────

class ConsoleAuditObserver implements Observer {
  name = "console-audit";
  notify(e: DomainEvent) {
    console.info(`[audit] ${e.type}`, e);
  }
}

class InAppToastObserver implements Observer {
  name = "in-app-toast";
  notify(e: DomainEvent) {
    // In production this would push over a WebSocket. Logged here for the demo.
    console.info(`[toast] ${e.type}`);
  }
}

class EmailObserver implements Observer {
  name = "email";
  async notify(e: DomainEvent) {
    // Production: SendGrid / Resend client. Stubbed for the academic build.
    console.info(`[email] would send for ${e.type}`);
  }
}

// Exported singleton subject, pre-wired with the default channel set.
export const notifications = new NotificationSubject();
notifications.subscribe(new ConsoleAuditObserver());
notifications.subscribe(new InAppToastObserver());
notifications.subscribe(new EmailObserver());
