import fs from 'fs';
import path from 'path';
import { DatabaseManager } from './connection';

export interface MigrationResult {
  appliedCount: number;
  appliedVersions: string[];
  message: string;
}

export class DatabaseMigrator {
  private db: DatabaseManager;
  private migrationsDir: string;

  constructor(migrationsDir?: string) {
    this.db = DatabaseManager.getInstance();
    this.migrationsDir = migrationsDir || path.resolve(__dirname, 'migrations');
  }

  async runMigrations(): Promise<MigrationResult> {
    const appliedVersions: string[] = [];

    // 1. Ensure migrations table exists
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(100) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 2. Query already applied migrations
    const res = await this.db.query('SELECT version FROM schema_migrations ORDER BY version ASC');
    const existing = new Set<string>(res.rows.map((r) => r.version));

    // 3. Find migration files
    if (!fs.existsSync(this.migrationsDir)) {
      return {
        appliedCount: 0,
        appliedVersions: [],
        message: 'مجلد ملفات الترحيل غير موجود.',
      };
    }

    const files = fs.readdirSync(this.migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const version = file.replace(/\.sql$/, '');
      if (existing.has(version)) {
        continue;
      }

      const filePath = path.join(this.migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      // Apply migration inside transaction
      await this.db.withTransaction(async (client) => {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (version, applied_at) VALUES ($1, NOW()) ON CONFLICT (version) DO NOTHING',
          [version]
        );
      });

      appliedVersions.push(version);
    }

    return {
      appliedCount: appliedVersions.length,
      appliedVersions,
      message: appliedVersions.length > 0
        ? `تم تطبيق ${appliedVersions.length} ترحيل بنجاح: ${appliedVersions.join(', ')}`
        : 'قاعدة البيانات محدثة بالكامل، لا توجد ترحيلات جديدة.',
    };
  }
}
