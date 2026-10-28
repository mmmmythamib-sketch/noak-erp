# NOAK ERP — Deployment & Operations Guide

## 1. Prerequisites & System Requirements
- **Operating System:** Windows 10 / Windows 11 / Windows Server (64-bit).
- **Database Engine:** PostgreSQL 14, 15, 16, or 17.
- **Hardware:** Dual-core processor or higher, 4 GB RAM minimum (8 GB recommended), 10 GB free disk space.
- **Local / LAN Network:** Standard TCP/IP networking (port 5432) for multi-workstation deployment.

---

## 2. PostgreSQL Setup & Initial Database Creation

### 2.1 Option A: Local Workstation (Single-Computer Deployment)
1. Download and install PostgreSQL from:
   `https://www.enterprisedb.com/downloads/postgres-postgresql-downloads`
   or via winget:
   ```cmd
   winget install PostgreSQL.PostgreSQL.16 --accept-source-agreements --accept-package-agreements
   ```
2. When prompted during installation, set a master password for user `postgres` (e.g. `YourSecurePassword123`).
3. Open `cmd` or `psql` and create the dedicated database:
   ```sql
   CREATE DATABASE noak_erp WITH ENCODING 'UTF8';
   ```

### 2.2 Option B: Central LAN Server Deployment
1. On the designated server computer, install PostgreSQL as a Windows Service.
2. Configure `postgresql.conf` to listen on all addresses:
   ```ini
   listen_addresses = '*'
   ```
3. Configure `pg_hba.conf` to authorize the office subnet (e.g., `192.168.1.0/24`):
   ```text
   host    noak_erp    all    192.168.1.0/24    scram-sha-256
   ```
4. Restart the PostgreSQL service.

---

## 3. Database Initialization & Schema Migrations
The database schema is initialized using versioned migration scripts located in:
`src/core/database/migrations/001_initial_schema.sql`

To apply migrations manually or via automated command:
```cmd
psql -U postgres -d noak_erp -f src/core/database/migrations/001_initial_schema.sql
```

The migration runner automatically creates:
- Division records (`WOOD` and `ALUMINUM`).
- Core user permissions.
- Full Chart of Accounts.
- Warehouse directories.
- Document sequence counters.
- Audit log tables.

---

## 4. Application Configuration (`config.json`)
The application loads connection parameters from `config.json` located in the application root directory:

```json
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "database": "noak_erp",
    "user": "postgres",
    "password": "YourSecurePassword123",
    "ssl": false
  },
  "company": {
    "nameAr": "شركة نوك للصناعات والديكور المحدودة",
    "currency": "IQD",
    "sharedLaborWoodPercentage": "50.00",
    "sharedLaborAluminumPercentage": "50.00"
  }
}
```
*Note: To switch from local deployment to LAN server, update `"host"` to the server's IP address (e.g., `"192.168.1.50"`). No application rebuilding or code changes required.*

---

## 5. Building the Standalone Windows Executable (.exe)
To package the application into a standalone Windows installer and portable `.exe`:
```cmd
npm run package:win
```
The resulting executable will be generated inside the `release/` directory:
- `NOAK ERP Setup 1.0.0.exe` (NSIS installer with desktop shortcut and uninstaller)
- `NOAK ERP 1.0.0.exe` (Portable executable)

---

## 6. Backup & Disaster Recovery Procedures

### 6.1 Creating Backups
- **Automated:** Backups run daily and are stored in the `/backups` directory.
- **Manual:** Navigate to **النسخ الاحتياطي والإعدادات** and click **إنشاء نسخة فورية**.
- Each backup file includes a computed SHA-256 integrity hash.

### 6.2 Retention Policy
- Backups are retained for 30 days.
- The safe-retention cleaner will **never** delete the only remaining backup file.

### 6.3 Restoration Procedure (Administrator Only)
1. Verify database integrity and compatibility.
2. Confirm that all active users are logged out.
3. Use the administrator restoration tool to apply the snapshot.
4. An immutable event is logged in `audit_logs` recording the user, timestamp, and backup hash.
