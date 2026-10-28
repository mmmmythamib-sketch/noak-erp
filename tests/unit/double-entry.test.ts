import { describe, it, expect } from 'vitest';
import { DoubleEntryValidator } from '../../src/core/domain/accounting/double-entry';
import { JournalEntry, JournalLine } from '../../src/shared/types';

describe('DoubleEntryValidator — Accounting Balancing & Invariants', () => {
  it('accepts a balanced journal entry where total debits equal total credits', () => {
    const lines: JournalLine[] = [
      { accountId: 'acc-1', debit: '1500000.00', credit: '0.00', description: 'صرف مواد' },
      { accountId: 'acc-2', debit: '0.00', credit: '1500000.00', description: 'مخزون مواد النجارة' },
    ];

    const result = DoubleEntryValidator.validateBalance(lines);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('rejects an unbalanced journal entry and reports the exact difference', () => {
    const lines: JournalLine[] = [
      { accountId: 'acc-1', debit: '1500000.00', credit: '0.00' },
      { accountId: 'acc-2', debit: '0.00', credit: '1400000.00' },
    ];

    const result = DoubleEntryValidator.validateBalance(lines);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('القيد غير متوازن');
    expect(result.errors[0]).toContain('100000.00'); // Difference of 100,000
  });

  it('rejects an entry with negative amounts or having both debit and credit on the same line', () => {
    const lines: JournalLine[] = [
      { accountId: 'acc-1', debit: '500.00', credit: '200.00' },
      { accountId: 'acc-2', debit: '-300.00', credit: '0.00' },
    ];

    const result = DoubleEntryValidator.validateBalance(lines);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('مبالغ سالبة'))).toBe(true);
    expect(result.errors.some((e) => e.includes('مدين ومبلغ دائن معاً'))).toBe(true);
  });

  it('creates an exact reversal entry with inverted debits and credits', () => {
    const originalEntry: JournalEntry = {
      id: 'entry-original-1',
      entryNumber: 'JV-2026-000010',
      date: '2026-05-10',
      description: 'فاتورة مبيعات رقم INV-2026-000005',
      status: 'POSTED',
      lines: [
        { accountId: 'ar-1200', debit: '3000000.00', credit: '0.00' },
        { accountId: 'rev-4100', debit: '0.00', credit: '3000000.00' },
      ],
      createdAt: '2026-05-10T10:00:00Z',
    };

    const reversal = DoubleEntryValidator.createReversalEntry(
      originalEntry,
      'JV-2026-000011',
      'إلغاء فاتورة مبيعات بسبب خطأ بالكميات',
      '2026-05-11',
      'user-admin-1'
    );

    expect(reversal.entryNumber).toBe('JV-2026-000011');
    expect(reversal.sourceDocumentId).toBe('entry-original-1');
    // Lines should be flipped:
    expect(reversal.lines[0].debit).toBe('0.00');
    expect(reversal.lines[0].credit).toBe('3000000.00');
    expect(reversal.lines[1].debit).toBe('3000000.00');
    expect(reversal.lines[1].credit).toBe('0.00');

    // Validated reversal itself balances
    expect(DoubleEntryValidator.validateBalance(reversal.lines).isValid).toBe(true);
  });
});
