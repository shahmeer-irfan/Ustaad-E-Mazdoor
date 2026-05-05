/**
 * FACTORY PATTERN — User subclass instantiation
 *
 * Intent
 *   Hide the conditional logic of "given a profile row from the DB, what kind
 *   of behavior object do I instantiate?" behind a single static `create()`
 *   call. Callers ask the factory for "a user" and never branch on user_type.
 *
 * Why a Factory here
 *   Customers, Workers, and Admins share a base `User` shape but differ in
 *   permitted actions (post-job vs apply-job vs review-disputes). Without a
 *   Factory the discriminator (`user_type`) leaks into every consumer; with
 *   it, consumers depend on the abstract type alone.
 *
 * SRS reference: DC-2 — pattern #2; supports REQ-1.x (Authentication & RBAC).
 */

export type UserType = "client" | "freelancer" | "admin";

export interface ProfileRow {
  id:        string;
  clerk_id:  string;
  email:     string;
  full_name: string | null;
  user_type: UserType;
}

export abstract class User {
  constructor(public readonly profile: ProfileRow) {}
  abstract canPostJob():    boolean;
  abstract canApplyToJob(): boolean;
  abstract canReview():     boolean;
  abstract canResolveDisputes(): boolean;

  get id()       { return this.profile.id;       }
  get type()     { return this.profile.user_type;}
  get fullName() { return this.profile.full_name ?? this.profile.email; }
}

class Customer extends User {
  canPostJob()         { return true;  }
  canApplyToJob()      { return false; }
  canReview()          { return true;  }   // clients leave reviews on completed jobs
  canResolveDisputes() { return false; }
}

class Worker extends User {
  canPostJob()         { return false; }
  canApplyToJob()      { return true;  }
  canReview()          { return false; }   // freelancers can't leave a review on themselves
  canResolveDisputes() { return false; }
}

class Admin extends User {
  canPostJob()         { return false; }
  canApplyToJob()      { return false; }
  canReview()          { return false; }
  canResolveDisputes() { return true;  }
}

export class UserFactory {
  /**
   * Single entry point. Pick the right subclass based on the discriminator.
   * Throws on unknown user_type so a bad seed surfaces loudly.
   */
  static create(row: ProfileRow): User {
    switch (row.user_type) {
      case "client":     return new Customer(row);
      case "freelancer": return new Worker(row);
      case "admin":      return new Admin(row);
      default: {
        const t: never = row.user_type;
        throw new Error(`UserFactory: unknown user_type "${t}"`);
      }
    }
  }
}
