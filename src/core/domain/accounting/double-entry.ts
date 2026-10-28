import { PreciseMoney } from '../../utils/decimal';
import { JournalEntry, JournalLine, DocumentStatus } from '../../../shared/types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class DoubleEntryValidator {
  /**
   * Validates that total debits strictly equal total credits.
   * Every journal entry MUST satisfy: Total Debits = Total Credits.
   */
  static validateBalance(lines: JournalLine[]): ValidationResult {
    const errors: string[] = [];

    if (!lines || lines.length < 2) {
      errors.push('القيد المحاسبي يجب أن يحتوي على سطرين على الأقل (طرف مدين وطرف دائن).');
      return { isValid: false, errors };
    }

    let totalDebit = PreciseMoney.zero();
    let totalCredit = PreciseMoney.zero();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const debit = new PreciseMoney(line.debit || 0);
      const credit = new PreciseMoney(line.credit || 0);

      if (debit.isNegative() || credit.isNegative()) {
        errors.push(`السطر رقم ${i + 1}: لا يمكن إدخال مبالغ سالبة في المدين أو الدائن.`);
      }

      if (debit.isPositive() && credit.isPositive()) {
        errors.push(`السطر رقم ${i + 1}: لا يمكن أن يحتوي السطر الواحد على مبلغ مدين ومبلغ دائن معاً.`);
      }

      if (debit.isZero() && credit.isZero()) {
        errors.push(`السطر رقم ${i + 1}: يجب تحديد مبلغ مدين أو دائن أكبر من الصفر.`);
      }

      totalDebit = totalDebit.add(debit);
      totalCredit = totalCredit.add(credit);
    }

    if (!totalDebit.equals(totalCredit)) {
      errors.push(
        `القيد غير متوازن: إجمالي المدين (${totalDebit.toDbString()}) لا يساوي إجمالي الدائن (${totalCredit.toDbString()}). الفرق: ${totalDebit.sub(totalCredit).toDbString()}`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generates a reversal entry for a posted journal entry.
   * Reversal preserves the audit trail without modifying or deleting the original posted entry.
   */
  static createReversalEntry(
    original: JournalEntry,
    reversalEntryNumber: string,
    reason: string,
    reversalDate: string,
    userId: string
  ): JournalEntry {
    if (original.status !== 'POSTED') {
      throw new Error('لا يمكن عكس قيد غير مرحل.');
    }

    // Invert debits and credits
    const reversedLines: JournalLine[] = original.lines.map((line) => ({
      accountId: line.accountId,
      accountCode: line.accountCode,
      accountNameAr: line.accountNameAr,
      debit: line.credit, // Credit becomes Debit
      credit: line.debit, // Debit becomes Credit
      description: `عكس قيد: ${original.entryNumber} - السبب: ${reason}`,
      divisionId: line.divisionId,
      costCenterId: line.costCenterId,
    }));

    return {
      id: crypto.randomUUID(),
      entryNumber: reversalEntryNumber,
      date: reversalDate,
      description: `قيد تسوية وعكس للقيد رقم [${original.entryNumber}]. السبب: ${reason}`,
      divisionId: original.divisionId,
      status: 'POSTED',
      lines: reversedLines,
      sourceDocumentType: 'REVERSAL',
      sourceDocumentId: original.id,
      postedBy: userId,
      approvedBy: userId,
      createdAt: new Date().toISOString(),
    };
  }
}
