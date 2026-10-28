import crypto from 'crypto';
import { User, UserRole, PermissionAction, PermissionResource, DivisionId } from '../../shared/types';
import { DatabaseManager } from '../database/connection';

export class AuthService {
  private db: DatabaseManager;

  constructor() {
    this.db = DatabaseManager.getInstance();
  }

  /**
   * Hashes a password using PBKDF2/scrypt with a secure random salt.
   */
  static hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return reject(err);
        resolve(`${salt}:${derivedKey.toString('hex')}`);
      });
    });
  }

  /**
   * Verifies a password against the stored salt:hash string using timing-safe comparison.
   */
  static verifyPassword(password: string, storedHash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = storedHash.split(':');
      if (!salt || !key) return resolve(false);

      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return reject(err);
        try {
          const keyBuffer = Buffer.from(key, 'hex');
          resolve(crypto.timingSafeEqual(keyBuffer, derivedKey));
        } catch {
          resolve(false);
        }
      });
    });
  }

  /**
   * Checks whether a user has permission to perform an action on a resource.
   */
  static hasPermission(
    user: User,
    resource: PermissionResource,
    action: PermissionAction,
    targetDivisionId?: DivisionId | null
  ): boolean {
    // 1. Company Administrator has full access
    if (user.role === 'ADMIN') {
      return true;
    }

    // 2. Division Isolation Enforcement:
    // If a manager or employee belongs strictly to a division, they cannot touch other divisions.
    if (user.divisionId && targetDivisionId && user.divisionId !== targetDivisionId) {
      return false;
    }

    // 3. Role-based default rules
    if (user.role === 'ACCOUNTANT') {
      // Accountants have wide financial access except user management and system settings
      if (resource === 'SETTINGS' && (action === 'MANAGE_SETTINGS' || action === 'MANAGE_USERS')) {
        return false;
      }
      return true;
    }

    if (user.role === 'WAREHOUSE_KEEPER') {
      // Warehouse keeper can view inventory and post material issues/returns, but cannot approve finances
      if (resource === 'INVENTORY' || resource === 'MATERIAL_ISSUE') {
        return ['VIEW', 'CREATE', 'POST'].includes(action);
      }
      return false;
    }

    if (user.role === 'SALES_REP') {
      // Sales reps can create quotations, draft contracts, view customers
      if (['QUOTATION', 'CONTRACT'].includes(resource)) {
        return ['VIEW', 'CREATE', 'EDIT_DRAFT', 'SUBMIT'].includes(action);
      }
      return false;
    }

    // 4. Check explicit permissions array
    if (user.permissions && user.permissions.includes(`${resource}:${action}`)) {
      return true;
    }

    return false;
  }
}
