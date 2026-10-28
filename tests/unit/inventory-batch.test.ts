import { describe, it, expect } from 'vitest';
import { InventoryBatchEngine } from '../../src/core/domain/inventory/batch-engine';
import { InventoryBatch, MaterialIssue } from '../../src/shared/types';

describe('InventoryBatchEngine — Batch Costing, Non-Negative Stock & Divisional Isolation', () => {
  const sampleBatch: InventoryBatch = {
    id: 'batch-1',
    batchNumber: 'BATCH-2026-001',
    materialId: 'mat-mdf',
    warehouseId: 'wh-wood-1',
    divisionId: 'WOOD',
    purchaseInvoiceId: 'pur-1',
    initialQuantity: '50.0000',
    remainingQuantity: '30.0000',
    unitCost: '40000.00',
    receivedDate: '2026-05-01',
  };

  it('successfully issues stock when requested quantity is available in batch', () => {
    const result = InventoryBatchEngine.validateAndIssueStock(sampleBatch, '10', 'WOOD');
    expect(result.remainingQuantity).toBe('20.0000');
    expect(result.totalCost).toBe('400000.00'); // 10 * 40,000
    expect(result.unitCost).toBe('40000.00');
  });

  it('strictly rejects stock issue when requested quantity exceeds available batch quantity (No Negative Inventory)', () => {
    expect(() => {
      InventoryBatchEngine.validateAndIssueStock(sampleBatch, '35', 'WOOD');
    }).toThrow('رصيد الدفعة غير كافٍ');
  });

  it('strictly prevents issuing wood inventory to an aluminum project (Divisional Isolation)', () => {
    expect(() => {
      InventoryBatchEngine.validateAndIssueStock(sampleBatch, '5', 'ALUMINUM');
    }).toThrow('انتهاك العزل الفصلي للمخزون');
  });

  it('allows returning stock up to the originally issued quantity, and rejects excessive returns', () => {
    const originalIssue: MaterialIssue = {
      id: 'iss-1',
      issueNumber: 'ISS-2026-000001',
      projectId: 'proj-1',
      divisionId: 'WOOD',
      batchId: 'batch-1',
      materialId: 'mat-mdf',
      quantity: '8.0000',
      unitCost: '40000.00',
      totalCost: '320000.00',
      date: '2026-05-02',
      status: 'POSTED',
      issuedBy: 'user-wh',
      createdAt: '2026-05-02',
    };

    // Valid return of 3 boards
    const validReturn = InventoryBatchEngine.validateAndReturnStock(sampleBatch, originalIssue, '3.0000');
    expect(validReturn.newRemainingBatchQuantity).toBe('33.0000'); // 30 + 3
    expect(validReturn.totalRefundCost).toBe('120000.00'); // 3 * 40,000

    // Reject attempt to return 10 boards when only 8 were issued
    expect(() => {
      InventoryBatchEngine.validateAndReturnStock(sampleBatch, originalIssue, '10.0000');
    }).toThrow('لا يمكن إرجاع كمية (10.00) أكبر من الكمية التي تم صرفها أصلاً');
  });
});
