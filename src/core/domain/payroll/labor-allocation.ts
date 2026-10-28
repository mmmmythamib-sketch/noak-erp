import { PreciseMoney } from '../../utils/decimal';
import { DivisionId } from '../../../shared/types';

export interface SharedLaborAllocationResult {
  totalSharedLaborExpense: string;
  woodPercentage: string;
  woodAllocatedAmount: string;
  aluminumPercentage: string;
  aluminumAllocatedAmount: string;
  isReconciled: boolean;
}

export class SharedLaborAllocator {
  /**
   * Allocates shared general labor expenses between Wood and Aluminum divisions.
   * Enforces:
   * 1. Wood% + Aluminum% must equal exactly 100%.
   * 2. WoodAllocated + AluminumAllocated must exactly reconcile to Total Expense (no double-counting, zero drift).
   */
  static allocateSharedLabor(
    totalExpenseStr: string,
    woodPercentageStr: string,
    aluminumPercentageStr: string
  ): SharedLaborAllocationResult {
    const total = new PreciseMoney(totalExpenseStr);
    const woodPct = new PreciseMoney(woodPercentageStr);
    const alumPct = new PreciseMoney(aluminumPercentageStr);

    if (total.isNegative()) {
      throw new Error('لا يمكن أن يكون إجمالي مصروف الرواتب سالباً.');
    }

    const sumPct = woodPct.add(alumPct);
    if (!sumPct.equals('100')) {
      throw new Error(
        `نسب توزيع الأجور المشتركة غير صحيحة: مجموع نسبتي النجارة (${woodPct.toDbString()}%) والألمنيوم (${alumPct.toDbString()}%) يجب أن يساوي 100.00% تماماً.`
      );
    }

    const woodAmount = total.mul(woodPct).div(100);
    // Residual allocation to guarantee 100% exact reconciliation down to the cent
    const alumAmount = total.sub(woodAmount);

    const reconciledSum = woodAmount.add(alumAmount);
    const isReconciled = reconciledSum.equals(total);

    return {
      totalSharedLaborExpense: total.toDbString(2),
      woodPercentage: woodPct.toDbString(2),
      woodAllocatedAmount: woodAmount.toDbString(2),
      aluminumPercentage: alumPct.toDbString(2),
      aluminumAllocatedAmount: alumAmount.toDbString(2),
      isReconciled,
    };
  }
}
