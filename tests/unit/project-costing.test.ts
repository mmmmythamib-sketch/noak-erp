import { describe, it, expect } from 'vitest';
import { ProjectCostingEngine } from '../../src/core/domain/costing/project-costing';
import { MaterialIssue } from '../../src/shared/types';

describe('ProjectCostingEngine — Section 14 Costing & Profitability Rules', () => {
  it('calculates project material cost strictly from actual issued batches', () => {
    const issues: MaterialIssue[] = [
      {
        id: 'iss-1',
        issueNumber: 'ISS-2026-000001',
        projectId: 'proj-1',
        divisionId: 'WOOD',
        batchId: 'batch-wood-1',
        materialId: 'mat-mdf',
        quantity: '10',
        unitCost: '35000.00', // 10 * 35,000 = 350,000
        totalCost: '350000.00',
        date: '2026-05-01',
        status: 'POSTED',
        issuedBy: 'wh-keeper',
        createdAt: '2026-05-01',
      },
      {
        id: 'iss-2',
        issueNumber: 'ISS-2026-000002',
        projectId: 'proj-1',
        divisionId: 'WOOD',
        batchId: 'batch-wood-2',
        materialId: 'mat-hinges',
        quantity: '40',
        unitCost: '2500.00', // 40 * 2,500 = 100,000
        totalCost: '100000.00',
        date: '2026-05-02',
        status: 'POSTED',
        issuedBy: 'wh-keeper',
        createdAt: '2026-05-02',
      },
    ];

    const totalCost = ProjectCostingEngine.calculateMaterialCost(issues);
    // Total material cost = 350,000 + 100,000 = 450,000
    expect(totalCost.toDbString(2)).toBe('450000.00');
  });

  it('computes project gross profit as Revenue - Material Cost (without labor or rent)', () => {
    const issues: MaterialIssue[] = [
      {
        id: 'iss-1',
        issueNumber: 'ISS-2026-000001',
        projectId: 'proj-1',
        divisionId: 'WOOD',
        batchId: 'batch-1',
        materialId: 'mat-1',
        quantity: '5',
        unitCost: '100000.00', // 500,000
        totalCost: '500000.00',
        date: '2026-05-01',
        status: 'POSTED',
        issuedBy: 'wh-keeper',
        createdAt: '2026-05-01',
      },
    ];

    // Contract Revenue = 1,200,000 IQD
    const summary = ProjectCostingEngine.computeProjectProfitability('proj-1', '1200000.00', issues);
    expect(summary.totalRevenue).toBe('1200000.00');
    expect(summary.actualMaterialCost).toBe('500000.00');
    // Gross profit = 1,200,000 - 500,000 = 700,000
    expect(summary.grossProfit).toBe('700000.00');
    // Margin = (700,000 / 1,200,000) * 100 = 58.33%
    expect(summary.grossProfitMarginPercent).toBe('58.33');
  });

  it('strictly rejects labor, rent, electricity, or overhead from project material cost', () => {
    expect(() => ProjectCostingEngine.assertValidMaterialCostComponent('LABOR')).toThrow(
      'انتهاك سياسة التكاليف (المادة 14)'
    );
    expect(() => ProjectCostingEngine.assertValidMaterialCostComponent('RENT')).toThrow(
      'انتهاك سياسة التكاليف (المادة 14)'
    );
    expect(() => ProjectCostingEngine.assertValidMaterialCostComponent('ELECTRICITY')).toThrow(
      'انتهاك سياسة التكاليف (المادة 14)'
    );
    expect(() => ProjectCostingEngine.assertValidMaterialCostComponent('WASTE')).toThrow(
      'انتهاك سياسة التكاليف (المادة 14)'
    );

    // Valid raw material direct component does not throw
    expect(() => ProjectCostingEngine.assertValidMaterialCostComponent('RAW_MATERIAL')).not.toThrow();
  });
});
