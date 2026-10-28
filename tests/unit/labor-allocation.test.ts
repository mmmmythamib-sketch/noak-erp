import { describe, it, expect } from 'vitest';
import { SharedLaborAllocator } from '../../src/core/domain/payroll/labor-allocation';

describe('SharedLaborAllocator — Shared Labor Expense Allocation', () => {
  it('correctly allocates shared labor expense using configured percentages (e.g. 60% Wood, 40% Aluminum)', () => {
    // Total shared administration/design salaries: 4,500,000 IQD
    const result = SharedLaborAllocator.allocateSharedLabor('4500000.00', '60.00', '40.00');

    expect(result.woodAllocatedAmount).toBe('2700000.00'); // 4,500,000 * 0.60
    expect(result.aluminumAllocatedAmount).toBe('1800000.00'); // 4,500,000 * 0.40
    expect(result.isReconciled).toBe(true);
  });

  it('handles odd numbers without any rounding drift or double-counting', () => {
    // 1,000,001 IQD split 50/50
    const result = SharedLaborAllocator.allocateSharedLabor('1000001.00', '50.00', '50.00');

    expect(result.woodAllocatedAmount).toBe('500000.50');
    expect(result.aluminumAllocatedAmount).toBe('500000.50');
    expect(result.isReconciled).toBe(true);
  });

  it('rejects percentages that do not sum up to 100%', () => {
    expect(() => {
      SharedLaborAllocator.allocateSharedLabor('1000000.00', '50.00', '45.00');
    }).toThrow('نسب توزيع الأجور المشتركة غير صحيحة');
  });
});
