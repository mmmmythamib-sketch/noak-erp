import { AuditLogEntry, DivisionId } from '../../shared/types';
import { DatabaseManager } from '../database/connection';

export class AuditService {
  private db: DatabaseManager;

  constructor() {
    this.db = DatabaseManager.getInstance();
  }

  /**
   * Masks sensitive fields like passwords, secrets, tokens before saving to audit logs.
   */
  private maskSensitiveData(data?: Record<string, any>): Record<string, any> | undefined {
    if (!data) return undefined;
    const masked = { ...data };
    const sensitiveKeys = ['password', 'passwordHash', 'token', 'secret', 'apiKey'];
    for (const key of Object.keys(masked)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
        masked[key] = '********';
      }
    }
    return masked;
  }

  /**
   * Writes an immutable audit entry to the database.
   */
  async log(params: {
    userId: string;
    username: string;
    action: string;
    entityType: string;
    entityId: string;
    divisionId?: DivisionId | null;
    previousValues?: Record<string, any>;
    newValues?: Record<string, any>;
    reason?: string;
  }): Promise<void> {
    const id = crypto.randomUUID();
    const prevMasked = this.maskSensitiveData(params.previousValues);
    const newMasked = this.maskSensitiveData(params.newValues);

    try {
      await this.db.query(
        `INSERT INTO audit_logs (
          id, user_id, username, action, entity_type, entity_id, division_id,
          previous_values, new_values, reason, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
        [
          id,
          params.userId,
          params.username,
          params.action,
          params.entityType,
          params.entityId,
          params.divisionId || null,
          prevMasked ? JSON.stringify(prevMasked) : null,
          newMasked ? JSON.stringify(newMasked) : null,
          params.reason || null,
        ]
      );
    } catch (err) {
      console.error('Failed to write audit log entry:', err);
    }
  }
}
