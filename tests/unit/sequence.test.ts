import { describe, it, expect } from 'vitest';
import { SequenceFormatter } from '../../src/core/utils/sequence';

describe('SequenceFormatter — Concurrency-Safe Document Numbering', () => {
  it('formats document numbers with exact prefix, year, and padded zeros', () => {
    expect(SequenceFormatter.formatNumber('QUOTATION', 2026, 1)).toBe('Noak - 2026 - 0001');
    expect(SequenceFormatter.formatNumber('SALES_INVOICE', 2026, 42)).toBe('Noak - 2026 - 0042');
    expect(SequenceFormatter.formatNumber('MATERIAL_ISSUE', 2026, 125)).toBe('Noak - 2026 - 0125');
    expect(SequenceFormatter.formatNumber('RECEIPT_VOUCHER', 2026, 9)).toBe('Noak - 2026 - 0009');
    expect(SequenceFormatter.formatNumber('PAYMENT_VOUCHER', 2026, 15)).toBe('Noak - 2026 - 0015');
    expect(SequenceFormatter.formatNumber('JOURNAL_ENTRY', 2026, 88)).toBe('Noak - 2026 - 0088');
    expect(SequenceFormatter.formatNumber('WASTE_RECORD', 2026, 3)).toBe('Noak - 2026 - 0003');
    expect(SequenceFormatter.formatNumber('CONTRACT', 2026, 7)).toBe('Noak - 2026 - 0007');
    expect(SequenceFormatter.formatNumber('PROJECT', 2026, 14)).toBe('Noak - 2026 - 0014');
  });
});
