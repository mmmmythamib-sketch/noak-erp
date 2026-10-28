import { PreciseMoney } from '../../utils/decimal';
import { Partner, ProfitDistribution, DivisionId } from '../../../shared/types';

export interface CalculatedPartnerShare {
  partnerId: string;
  partnerName: string;
  profitPercentage: string;
  shareAmount: string;
}

export interface DistributionCalculationResult {
  divisionId: DivisionId;
  periodId: string;
  netPeriodProfit: string;
  reservePercentage: string;
  reserveAmount: string;
  distributableProfit: string;
  partnerShares: CalculatedPartnerShare[];
}

export class ProfitDistributionCalculator {
  /**
   * Calculates distributable profit and partners' respective shares for a specific division.
   * STRICT ENFORCEMENT:
   * 1. Partner must belong to the specified division (no cross-division distribution).
   * 2. Sum of partner percentages must equal 100%.
   * 3. Total distributed shares must exactly reconcile with distributable profit.
   */
  static calculateDistribution(
    divisionId: DivisionId,
    periodId: string,
    netProfitStr: string,
    reservePercentageStr: string = '0',
    partners: Partner[]
  ): DistributionCalculationResult {
    const netProfit = new PreciseMoney(netProfitStr);
    const reservePct = new PreciseMoney(reservePercentageStr);

    if (netProfit.isNegative() || netProfit.isZero()) {
      throw new Error('لا توجد أرباح قابلة للتوزيع (النتيجة المالية للفترة صفر أو خسارة).');
    }

    // Filter partners belonging strictly to this division
    const divisionPartners = partners.filter((p) => p.divisionId === divisionId && p.isActive);
    if (divisionPartners.length === 0) {
      throw new Error(`لا يوجد شركاء مسجلون في قسم (${divisionId === 'WOOD' ? 'النجارة' : 'الألمنيوم'}).`);
    }

    // Verify percentages sum up to 100%
    let totalPct = PreciseMoney.zero();
    for (const p of divisionPartners) {
      totalPct = totalPct.add(new PreciseMoney(p.profitPercentage));
    }

    if (!totalPct.equals('100')) {
      throw new Error(
        `خطأ في حصص الشركاء: مجموع نسب أرباح الشركاء لقسم (${divisionId}) هو (${totalPct.toDbString()}%) ويجب أن يكون 100.00% تماماً.`
      );
    }

    // Calculate reserve deduction if any
    let reserveAmount = PreciseMoney.zero();
    if (reservePct.isPositive()) {
      reserveAmount = netProfit.mul(reservePct).div(100);
    }

    const distributableProfit = netProfit.sub(reserveAmount);

    // Calculate individual partner shares
    const partnerShares: CalculatedPartnerShare[] = [];
    let allocatedTotal = PreciseMoney.zero();

    for (let i = 0; i < divisionPartners.length; i++) {
      const p = divisionPartners[i];
      const pPct = new PreciseMoney(p.profitPercentage);
      
      let pShare: PreciseMoney;
      // On the last partner, reconcile rounding differences to ensure exact zero-balance reconciliation
      if (i === divisionPartners.length - 1) {
        pShare = distributableProfit.sub(allocatedTotal);
      } else {
        pShare = distributableProfit.mul(pPct).div(100);
        allocatedTotal = allocatedTotal.add(pShare);
      }

      partnerShares.push({
        partnerId: p.id,
        partnerName: p.name,
        profitPercentage: p.profitPercentage,
        shareAmount: pShare.toDbString(2),
      });
    }

    return {
      divisionId,
      periodId,
      netPeriodProfit: netProfit.toDbString(2),
      reservePercentage: reservePct.toDbString(2),
      reserveAmount: reserveAmount.toDbString(2),
      distributableProfit: distributableProfit.toDbString(2),
      partnerShares,
    };
  }
}
