import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import fs from 'fs';
import path from 'path';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password?: string;
  ssl?: boolean;
}

const DEFAULT_CONFIG: DatabaseConfig = {
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432', 10),
  database: process.env.PG_DATABASE || 'noak_erp',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  ssl: false,
};

export class DatabaseManager {
  private static instance: DatabaseManager;
  private pool: Pool | null = null;
  private config: DatabaseConfig = DEFAULT_CONFIG;

  private constructor() {
    this.loadConfig();
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  loadConfig(): DatabaseConfig {
    const configPath = path.resolve(process.cwd(), 'config.json');
    if (fs.existsSync(configPath)) {
      try {
        const fileContent = fs.readFileSync(configPath, 'utf8');
        const parsed = JSON.parse(fileContent);
        if (parsed.database) {
          this.config = { ...DEFAULT_CONFIG, ...parsed.database };
        }
      } catch (err) {
        console.warn('Could not parse config.json, using default database configuration.');
      }
    }
    return this.config;
  }

  saveConfig(newConfig: Partial<DatabaseConfig>): void {
    this.config = { ...this.config, ...newConfig };
    const configPath = path.resolve(process.cwd(), 'config.json');
    let existing: any = {};
    if (fs.existsSync(configPath)) {
      try {
        existing = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } catch {}
    }
    existing.database = this.config;
    fs.writeFileSync(configPath, JSON.stringify(existing, null, 2), 'utf8');
    
    // Reset pool on config change
    if (this.pool) {
      this.pool.end().catch(() => {});
      this.pool = null;
    }
  }

  getPool(): Pool {
    if (!this.pool) {
      this.pool = new Pool({
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.user,
        password: this.config.password,
        ssl: this.config.ssl ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      this.pool.on('error', (err) => {
        console.error('Unexpected error on idle PostgreSQL client', err);
      });
    }
    return this.pool;
  }

  async query<R extends QueryResultRow = any, I extends any[] = any[]>(
    text: string,
    params?: I
  ): Promise<QueryResult<R>> {
    const pool = this.getPool();
    return pool.query<R>(text, params);
  }

  /**
   * Executes a callback within a strict PostgreSQL ACID transaction.
   * If any step fails, changes are completely rolled back.
   */
  async withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const pool = this.getPool();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const res = await this.query('SELECT NOW() AS current_time, version()');
      return {
        success: true,
        message: `الاتصال بقاعدة البيانات ناجح: ${res.rows[0].version}`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `فشل الاتصال بقاعدة البيانات: ${error.message}`,
      };
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}
