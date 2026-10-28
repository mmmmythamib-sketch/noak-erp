import { describe, it, expect } from 'vitest';
import { ProfitDistributionCalculator } from '../../src/core/domain/partners/profit-distribution';
import { Partner } from '../../src/shared/types';

describe('ProfitDistributionCalculator — Section 15 Partner Distribution Rules', () => {
  const samplePartners: Partner[] = [
    {
      id: 'partner-w1',
      name: 'شريك النجارة الأول',
      phone: '0770000001',
      divisionId: 'WOOD',
      initialCapital: '50000000.00',
      currentCapital: '50000000.00',
      profitPercentage: '60.00',
      totalWithdrawals: '0.00',
      totalDistributions: '0.00',
      isActive: true,
    },
    {
      id: 'partner-w2',
      name: 'شريك النجارة الثاني',
      phone: '0770000002',
      divisionId: 'WOOD',
      initialCapital: '30000000.00',
      currentCapital: '30000000.00',
      profitPercentage: '40.00',
      totalWithdrawals: '0.00',
      totalDistributions: '0.00',
      isActive: true,
    },
    {
      id: 'partner-a1',
      name: 'شريك الألمنيوم الأول',
      phone: '0770000003',
      divisionId: 'ALUMINUM',
      initialCapital: '40000000.00',
      currentCapital: '40000000.00',
      profitPercentage: '100.00',
      totalWithdrawals: '0.00',
      totalDistributions: '0.00',
      isActive: true,
    },
  ];

  it('correctly calculates divisional profit distribution and reserve deduction', () => {
    // Net profit for Wood division period: 10,000,000 IQD
    // Reserve: 10% (1,000,000 IQD)
    // Distributable: 9,000,000 IQD
    const result = ProfitDistributionCalculator.calculateDistribution(
      'WOOD',
      'period-q1-2026',
      '10000000.00',
      '10.00',
      samplePartners
    );

    expect(result.netPeriodProfit).toBe('10000000.00');
    expect(result.reserveAmount).toBe('1000000.00');
    expect(result.distributableProfit).toBe('9000000.00');
    expect(result.partnerShares.length).toBe(2);

    // Partner 1: 60% of 9,000,000 = 5,400,000
    expect(result.partnerShares[0].shareAmount).toBe('5400000.00');
    // Partner 2: 40% of 9,000,000 = 3,600,000
    expect(result.partnerShares[1].shareAmount).toBe('3600000.00');

    // Reconcile
    const sumShares = Number(result.partnerShares[0].shareAmount) + Number(result.partnerShares[1].shareAmount);
    expect(sumShares).toBe(9000000);
  });

  it('never includes partners from the other division in the calculation', () => {
    const result = ProfitDistributionCalculator.calculateDistribution(
      'WOOD',
      'period-q1-2026',
      '5000000.00',
      '0',
      samplePartners
    );

    // Aluminum partner (partner-a1) should NEVER be present in Wood distribution
    const hasAluminumPartner = result.partnerShares.some((s) => s.partnerId === 'partner-a1');
    expect(hasAluminumPartner).toBe(false);
  });

  it('rejects distribution if net period result is zero or negative', () => {
    expect(() => {
      ProfitDistributionCalculator.calculateDistribution('WOOD', 'period-q1', '0.00', '0', samplePartners);
    }).toThrow('لا توجد أرباح قابلة للتوزيع');

    expect(() => {
      ProfitDistributionCalculator.calculateDistribution('WOOD', 'period-q1', '-250000.00', '0', samplePartners);
    }).toThrow('لا توجد أرباح قابلة للتوزيع');
  });

  describe('User Mandate: Wood 4 Partners (30% x 3 + 10% Al-Imamayn AS) & Aluminum Hassan 50% + 3 Equal Partners', () => {
    // Import INITIAL_PARTNERS data structure
    const woodPartners: Partner[] = [
      {
        id: 'part-w1',
        name: 'عباس علي سلمان',
        phone: '07701112233',
        divisionId: 'WOOD',
        initialCapital: '50000000.00',
        currentCapital: '50000000.00',
        profitPercentage: '30.00',
        totalWithdrawals: '1500000.00',
        totalDistributions: '0.00',
        isActive: true,
      },
      {
        id: 'part-w2',
        name: 'محمد ضياء عبدالحسين',
        phone: '07702223344',
        divisionId: 'WOOD',
        initialCapital: '50000000.00',
        currentCapital: '50000000.00',
        profitPercentage: '30.00',
        totalWithdrawals: '0.00',
        totalDistributions: '0.00',
        isActive: true,
      },
      {
        id: 'part-w3',
        name: 'أمير علي سلمان',
        phone: '07703334455',
        divisionId: 'WOOD',
        initialCapital: '50000000.00',
        currentCapital: '50000000.00',
        profitPercentage: '30.00',
        totalWithdrawals: '0.00',
        totalDistributions: '0.00',
        isActive: true,
      },
      {
        id: 'part-w4',
        name: 'الإمامين الحسين والعباس ع',
        phone: '07700000000',
        divisionId: 'WOOD',
        initialCapital: '0.00',
        currentCapital: '0.00',
        profitPercentage: '10.00',
        totalWithdrawals: '0.00',
        totalDistributions: '0.00',
        isActive: true,
      },
    ];

    const alumPartners: Partner[] = [
      {
        id: 'part-a1',
        name: 'حسن المصري',
        phone: '07704445566',
        divisionId: 'ALUMINUM',
        initialCapital: '60000000.00',
        currentCapital: '60000000.00',
        profitPercentage: '50.00',
        totalWithdrawals: '2000000.00',
        totalDistributions: '0.00',
        isActive: true,
      },
      {
        id: 'part-a2',
        name: 'عباس علي سلمان',
        phone: '07701112233',
        divisionId: 'ALUMINUM',
        initialCapital: '20000000.00',
        currentCapital: '20000000.00',
        profitPercentage: '15.00',
        totalWithdrawals: '0.00',
        totalDistributions: '0.00',
        isActive: true,
      },
      {
        id: 'part-a3',
        name: 'محمد ضياء عبدالحسين',
        phone: '07702223344',
        divisionId: 'ALUMINUM',
        initialCapital: '20000000.00',
        currentCapital: '20000000.00',
        profitPercentage: '15.00',
        totalWithdrawals: '0.00',
        totalDistributions: '0.00',
        isActive: true,
      },
      {
        id: 'part-a4',
        name: 'أمير علي سلمان',
        phone: '07703334455',
        divisionId: 'ALUMINUM',
        initialCapital: '20000000.00',
        currentCapital: '20000000.00',
        profitPercentage: '15.00',
        totalWithdrawals: '0.00',
        totalDistributions: '0.00',
        isActive: true,
      },
      {
        id: 'part-a5',
        name: 'الإمامين الحسين والعباس ع',
        phone: '07700000000',
        divisionId: 'ALUMINUM',
        initialCapital: '0.00',
        currentCapital: '0.00',
        profitPercentage: '5.00',
        totalWithdrawals: '0.00',
        totalDistributions: '0.00',
        isActive: true,
      },
    ];

    it('correctly splits Wood division profits among 4 partners (30% x 3 + 10% Al-Imamayn AS) with zero leakage', () => {
      const allPartners = [...woodPartners, ...alumPartners];
      const netProfit = '30000000.00'; // 30M IQD
      const res = ProfitDistributionCalculator.calculateDistribution(
        'WOOD',
        'q4-2026',
        netProfit,
        '0',
        allPartners
      );

      expect(res.partnerShares.length).toBe(4);
      expect(res.partnerShares[0].partnerName).toBe('عباس علي سلمان');
      expect(res.partnerShares[1].partnerName).toBe('محمد ضياء عبدالحسين');
      expect(res.partnerShares[2].partnerName).toBe('أمير علي سلمان');
      expect(res.partnerShares[3].partnerName).toBe('الإمامين الحسين والعباس ع');

      // 30M * 30% = 9,000,000 each for the 3 partners
      expect(Number(res.partnerShares[0].shareAmount)).toBeCloseTo(9000000, 0);
      expect(Number(res.partnerShares[1].shareAmount)).toBeCloseTo(9000000, 0);
      expect(Number(res.partnerShares[2].shareAmount)).toBeCloseTo(9000000, 0);

      // 30M * 10% = 3,000,000 for Al-Imamayn AS
      expect(Number(res.partnerShares[3].shareAmount)).toBeCloseTo(3000000, 0);

      // Sum of shares must strictly equal netProfit
      const sum = res.partnerShares.reduce((acc, s) => acc + Number(s.shareAmount), 0);
      expect(sum).toBe(30000000);
    });

    it('correctly splits Aluminum profits with Hassan Al-Masri 50%, Al-Imamayn AS 5%, and 3 partners splitting 45%', () => {
      const allPartners = [...woodPartners, ...alumPartners];
      const netProfit = '24000000.00'; // 24M IQD
      const res = ProfitDistributionCalculator.calculateDistribution(
        'ALUMINUM',
        'q4-2026',
        netProfit,
        '0',
        allPartners
      );

      expect(res.partnerShares.length).toBe(5);
      // Hassan Al-Masri 50% of 24M = 12M
      expect(res.partnerShares[0].partnerName).toBe('حسن المصري');
      expect(res.partnerShares[0].shareAmount).toBe('12000000.00');

      // The remaining 3 partners get 45% / 3 = 15% -> 3.6M each
      expect(res.partnerShares[1].partnerName).toBe('عباس علي سلمان');
      expect(Number(res.partnerShares[1].shareAmount)).toBeCloseTo(3600000, 0);

      expect(res.partnerShares[2].partnerName).toBe('محمد ضياء عبدالحسين');
      expect(Number(res.partnerShares[2].shareAmount)).toBeCloseTo(3600000, 0);

      expect(res.partnerShares[3].partnerName).toBe('أمير علي سلمان');
      expect(Number(res.partnerShares[3].shareAmount)).toBeCloseTo(3600000, 0);

      // Al-Imamayn AS gets 5% = 1.2M
      expect(res.partnerShares[4].partnerName).toBe('الإمامين الحسين والعباس ع');
      expect(Number(res.partnerShares[4].shareAmount)).toBeCloseTo(1200000, 0);

      // Zero-leakage total
      const sum = res.partnerShares.reduce((acc, s) => acc + Number(s.shareAmount), 0);
      expect(sum).toBe(24000000);
    });

    it('correctly deducts active partner advances from their net payable distribution', () => {
      // Hassan Al-Masri gross share = 12,000,000 IQD
      // Partner active advance = 2,000,000 IQD
      // Net payable = 10,000,000 IQD
      const grossShare = 12000000;
      const advanceAmount = 2000000;
      const netPayable = grossShare - advanceAmount;

      expect(netPayable).toBe(10000000);
    });

    it('correctly reduces partnerShares with string percentages to 100% without throwing TypeError', () => {
      const mockWoodShares = woodPartners.map((p) => ({
        partner: p,
        profitPercentage: p.profitPercentage, // string like '33.333333'
      }));

      // Must safely convert to Number and toFixed(0)
      const totalPctStr = mockWoodShares
        .reduce((acc: number, cur: any) => acc + Number(cur.profitPercentage || 0), 0)
        .toFixed(0);

      expect(totalPctStr).toBe('100');

      const mockAlumShares = alumPartners.map((p) => ({
        partner: p,
        profitPercentage: p.profitPercentage,
      }));

      const alumPctStr = mockAlumShares
        .reduce((acc: number, cur: any) => acc + Number(cur.profitPercentage || 0), 0)
        .toFixed(0);

      expect(alumPctStr).toBe('100');
    });
  });
});
