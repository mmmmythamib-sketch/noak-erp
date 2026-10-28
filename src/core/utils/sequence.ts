export interface DocumentSequenceDefinition {
  type: string;
  prefix: string;
  padding: number;
}

export const DOCUMENT_TYPES: Record<string, DocumentSequenceDefinition> = {
  QUOTATION: { type: 'QUOTATION', prefix: 'Noak', padding: 4 },
  CONTRACT: { type: 'CONTRACT', prefix: 'Noak', padding: 4 },
  PROJECT: { type: 'PROJECT', prefix: 'Noak', padding: 4 },
  PURCHASE: { type: 'PURCHASE', prefix: 'Noak', padding: 4 },
  MATERIAL_ISSUE: { type: 'MATERIAL_ISSUE', prefix: 'Noak', padding: 4 },
  MATERIAL_RETURN: { type: 'MATERIAL_RETURN', prefix: 'Noak', padding: 4 },
  SALES_INVOICE: { type: 'SALES_INVOICE', prefix: 'Noak', padding: 4 },
  RECEIPT_VOUCHER: { type: 'RECEIPT_VOUCHER', prefix: 'Noak', padding: 4 },
  PAYMENT_VOUCHER: { type: 'PAYMENT_VOUCHER', prefix: 'Noak', padding: 4 },
  PAYMENT: { type: 'PAYMENT', prefix: 'Noak', padding: 4 },
  EXPENSE: { type: 'EXPENSE', prefix: 'Noak', padding: 4 },
  JOURNAL_ENTRY: { type: 'JOURNAL_ENTRY', prefix: 'Noak', padding: 4 },
  WASTE_RECORD: { type: 'WASTE_RECORD', prefix: 'Noak', padding: 4 },
  PAYROLL_RUN: { type: 'PAYROLL_RUN', prefix: 'Noak', padding: 4 },
  PROFIT_DISTRIBUTION: { type: 'PROFIT_DISTRIBUTION', prefix: 'Noak', padding: 4 },
  PARTNER_ADVANCE: { type: 'PARTNER_ADVANCE', prefix: 'Noak', padding: 4 },
  SHOWROOM_SALE: { type: 'SHOWROOM_SALE', prefix: 'Noak', padding: 4 },
};

export class SequenceFormatter {
  /**
   * Formats a human-readable document number given its type, year, and sequence integer.
   * Unified format: 'Noak - year - 0001'
   * e.g., formatNumber('RECEIPT_VOUCHER', 2026, 1) -> 'Noak - 2026 - 0001'
   */
  static formatNumber(docType: string, year: number, sequenceValue: number): string {
    const config = DOCUMENT_TYPES[docType];
    const padding = config ? config.padding : 4;
    const paddedSeq = String(sequenceValue).padStart(padding, '0');
    return `Noak - ${year} - ${paddedSeq}`;
  }
}
