import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { DatabaseManager } from '../database/connection';
import { AuditService } from './audit.service';

export interface BackupMetadata {
  backupId: string;
  filename: string;
  filePath: string;
  createdAt: string;
  appVersion: string;
  checksumSha256: string;
  fileSizeBytes: number;
}

export class BackupService {
  private db: DatabaseManager;
  private audit: AuditService;
  private backupDir: string;

  constructor(backupDir?: string) {
    this.db = DatabaseManager.getInstance();
    this.audit = new AuditService();
    this.backupDir = backupDir || path.resolve(process.cwd(), 'backups');

    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * Generates a JSON-based database snapshot backup with SHA-256 checksum.
   */
  async createBackup(userId: string, username: string): Promise<BackupMetadata> {
    const backupId = crypto.randomUUID();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `noak_erp_backup_${timestamp}.json`;
    const filePath = path.join(this.backupDir, filename);

    // Fetch snapshot of critical tables
    const tables = [
      'divisions',
      'users',
      'user_permissions',
      'chart_of_accounts',
      'accounting_periods',
      'journal_entries',
      'journal_lines',
      'customers',
      'suppliers',
      'warehouses',
      'materials',
      'purchases',
      'purchase_lines',
      'inventory_batches',
      'quotations',
      'quotation_lines',
      'contracts',
      'contract_installments',
      'projects',
      'material_issues',
      'sales_invoices',
      'receipt_vouchers',
      'payment_vouchers',
      'partners',
      'profit_distributions',
      'employees',
      'attendance_records',
      'payroll_runs',
      'company_settings',
    ];

    const dataSnapshot: Record<string, any[]> = {};
    for (const table of tables) {
      try {
        const res = await this.db.query(`SELECT * FROM ${table}`);
        dataSnapshot[table] = res.rows;
      } catch (e) {
        dataSnapshot[table] = [];
      }
    }

    const payload = {
      meta: {
        backupId,
        createdAt: new Date().toISOString(),
        appVersion: '1.0.0',
        dbVersion: '001_initial_schema',
      },
      data: dataSnapshot,
    };

    const content = JSON.stringify(payload, null, 2);
    fs.writeFileSync(filePath, content, 'utf8');

    const checksum = crypto.createHash('sha256').update(content).digest('hex');
    const stat = fs.statSync(filePath);

    // Log to audit trail
    await this.audit.log({
      userId,
      username,
      action: 'CREATE_BACKUP',
      entityType: 'BACKUP',
      entityId: backupId,
      newValues: { filename, fileSizeBytes: stat.size, checksumSha256: checksum },
    });

    return {
      backupId,
      filename,
      filePath,
      createdAt: payload.meta.createdAt,
      appVersion: payload.meta.appVersion,
      checksumSha256: checksum,
      fileSizeBytes: stat.size,
    };
  }

  /**
   * Lists existing backups with verification metadata.
   */
  listBackups(): BackupMetadata[] {
    if (!fs.existsSync(this.backupDir)) return [];

    const files = fs.readdirSync(this.backupDir).filter((f) => f.endsWith('.json'));
    const backups: BackupMetadata[] = [];

    for (const file of files) {
      const p = path.join(this.backupDir, file);
      try {
        const content = fs.readFileSync(p, 'utf8');
        const json = JSON.parse(content);
        const checksum = crypto.createHash('sha256').update(content).digest('hex');
        const stat = fs.statSync(p);

        backups.push({
          backupId: json.meta?.backupId || file,
          filename: file,
          filePath: p,
          createdAt: json.meta?.createdAt || stat.mtime.toISOString(),
          appVersion: json.meta?.appVersion || '1.0.0',
          checksumSha256: checksum,
          fileSizeBytes: stat.size,
        });
      } catch {}
    }

    return backups.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  /**
   * Safe retention cleanup: retains backups for 30 days, but NEVER deletes the only remaining backup.
   */
  cleanExpiredBackups(retentionDays: number = 30): { deleted: string[]; retained: number } {
    const backups = this.listBackups();
    if (backups.length <= 1) {
      // Never delete if only one backup exists
      return { deleted: [], retained: backups.length };
    }

    const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
    const deleted: string[] = [];

    // Keep at least one newest backup regardless of age
    for (let i = 1; i < backups.length; i++) {
      const b = backups[i];
      const backupTime = new Date(b.createdAt).getTime();
      if (backupTime < cutoff) {
        try {
          fs.unlinkSync(b.filePath);
          deleted.push(b.filename);
        } catch {}
      }
    }

    return {
      deleted,
      retained: backups.length - deleted.length,
    };
  }
}
