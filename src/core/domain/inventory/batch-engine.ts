import { PreciseMoney } from '../../utils/decimal';
import { InventoryBatch, MaterialIssue, DivisionId } from '../../../shared/types';

export class InventoryBatchEngine {
  /**
   * Validates and executes stock issuance from a specific purchase batch.
   * STRICT ENFORCEMENT:
   * 1. No negative inventory.
   * 2. Cannot issue more than remaining batch quantity.
   * 3. Batch division must strictly match project division.
   */
  static validateAndIssueStock(
    batch: InventoryBatch,
    requestedQuantityStr: string,
    targetProjectDivision: DivisionId
  ): {
    remainingQuantity: string;
    totalCost: string;
    unitCost: string;
  } {
    // 1. Division Isolation Check
    if (batch.divisionId !== targetProjectDivision) {
      throw new Error(
        `انتهاك العزل الفصلي للمخزون: لا يمكن صرف دفعة من قسم (${batch.divisionId === 'WOOD' ? 'النجارة' : 'الألمنيوم'}) لمشروع يتبع قسم (${targetProjectDivision === 'WOOD' ? 'النجارة' : 'الألمنيوم'}). التحويل بين الأقسام محظور قطعاً.`
      );
    }

    const requestedQty = new PreciseMoney(requestedQuantityStr);
    const availableQty = new PreciseMoney(batch.remainingQuantity);
    const unitCost = new PreciseMoney(batch.unitCost);

    if (requestedQty.isNegative() || requestedQty.isZero()) {
      throw new Error('كمية الصرف المطلوبة يجب أن تكون أكبر من الصفر.');
    }

    // 2. Negative Inventory Prevention
    if (requestedQty.greaterThan(availableQty)) {
      throw new Error(
        `رصيد الدفعة غير كافٍ: الكمية المطلوبة (${requestedQty.formatQuantity()}) تتجاوز الرصيد المتاح في الدفعة [${batch.batchNumber}] وهو (${availableQty.formatQuantity()}). الصرف بالسالب محظور.`
      );
    }

    const newRemaining = availableQty.sub(requestedQty);
    const totalCost = requestedQty.mul(unitCost);

    return {
      remainingQuantity: newRemaining.toDbString(4),
      totalCost: totalCost.toDbString(2),
      unitCost: unitCost.toDbString(2),
    };
  }

  /**
   * Validates return of issued material back to the original purchase batch.
   * Quantity returned cannot exceed the original issued quantity.
   */
  static validateAndReturnStock(
    batch: InventoryBatch,
    originalIssue: MaterialIssue,
    returnedQuantityStr: string
  ): {
    newRemainingBatchQuantity: string;
    totalRefundCost: string;
  } {
    const returnQty = new PreciseMoney(returnedQuantityStr);
    const issuedQty = new PreciseMoney(originalIssue.quantity);
    const batchRemaining = new PreciseMoney(batch.remainingQuantity);
    const unitCost = new PreciseMoney(batch.unitCost);

    if (returnQty.isNegative() || returnQty.isZero()) {
      throw new Error('الكمية المرجعة يجب أن تكون أكبر من الصفر.');
    }

    if (returnQty.greaterThan(issuedQty)) {
      throw new Error(
        `لا يمكن إرجاع كمية (${returnQty.formatQuantity()}) أكبر من الكمية التي تم صرفها أصلاً في مستند الصرف (${issuedQty.formatQuantity()}).`
      );
    }

    const newRemaining = batchRemaining.add(returnQty);
    const totalRefund = returnQty.mul(unitCost);

    return {
      newRemainingBatchQuantity: newRemaining.toDbString(4),
      totalRefundCost: totalRefund.toDbString(2),
    };
  }
}
