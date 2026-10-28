import { PreciseMoney } from '../../utils/decimal';
import { MaterialIssue } from '../../../shared/types';

export interface ProjectCostSummary {
  projectId: string;
  totalRevenue: string;             // Invoiced revenue recognized
  actualMaterialCost: string;       // Sum of issued materials from actual purchase batches
  grossProfit: string;              // Revenue - actual material cost
  grossProfitMarginPercent: string; // (Gross Profit / Revenue) * 100
  issuedBatchesCount: number;
}

export class ProjectCostingEngine {
  /**
   * Calculates actual material cost strictly based on issued purchase batches.
   * FORBIDDEN: Including labor, rent, electricity, transport or overhead in project material cost.
   */
  static calculateMaterialCost(issues: MaterialIssue[]): PreciseMoney {
    let totalCost = PreciseMoney.zero();

    for (const issue of issues) {
      if (issue.status === 'CANCELLED') {
        continue; // Exclude cancelled material issues
      }

      const qty = new PreciseMoney(issue.quantity);
      const unitCost = new PreciseMoney(issue.unitCost);

      if (qty.isNegative() || unitCost.isNegative()) {
        throw new Error(`خطأ في تكلفة الصرف رقم [${issue.issueNumber}]: لا يمكن أن تكون الكمية أو التكلفة سالبة.`);
      }

      const issueTotal = qty.mul(unitCost);
      totalCost = totalCost.add(issueTotal);
    }

    return totalCost;
  }

  /**
   * Computes Project Gross Profit according to Section 14:
   * Gross Profit = Invoiced Revenue - Actual Issued Material Cost.
   */
  static computeProjectProfitability(
    projectId: string,
    invoicedRevenueStr: string,
    issues: MaterialIssue[]
  ): ProjectCostSummary {
    const revenue = new PreciseMoney(invoicedRevenueStr);
    const materialCost = this.calculateMaterialCost(issues);
    const grossProfit = revenue.sub(materialCost);

    let marginPercent = PreciseMoney.zero();
    if (revenue.isPositive()) {
      marginPercent = grossProfit.mul(100).div(revenue);
    }

    return {
      projectId,
      totalRevenue: revenue.toDbString(2),
      actualMaterialCost: materialCost.toDbString(2),
      grossProfit: grossProfit.toDbString(2),
      grossProfitMarginPercent: marginPercent.toDbString(2),
      issuedBatchesCount: issues.filter((i) => i.status !== 'CANCELLED').length,
    };
  }

  /**
   * Asserts that forbidden operating expense categories are NEVER mixed into project material cost.
   * If any system component attempts to classify labor, rent, or utilities as project material cost,
   * this check throws a strict domain policy violation.
   */
  static assertValidMaterialCostComponent(costCategory: string): void {
    const forbiddenCategories = [
      'LABOR',
      'WAGES',
      'SALARIES',
      'RENT',
      'ELECTRICITY',
      'WATER',
      'TRANSPORT',
      'OVERHEAD',
      'WASTE',
      'DAMAGED_MATERIAL',
    ];

    if (forbiddenCategories.includes(costCategory.toUpperCase().trim())) {
      throw new Error(
        `انتهاك سياسة التكاليف (المادة 14): لا يجوز تحميل مصاريف (${costCategory}) على تكلفة المواد المباشرة للمشروع. هذه مصاريف تشغيلية/تالف عام تُسجل في حساباتها المستقلة.`
      );
    }
  }
}
