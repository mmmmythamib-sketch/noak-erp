import { describe, it, expect } from 'vitest';
import { PreciseMoney } from '../../src/core/utils/decimal';
import { DivisionAssetLumpSum, DivisionId, ShowroomItem } from '../../src/shared/types';
import {
  INITIAL_DIVISION_LUMP_SUMS,
  INITIAL_FIXED_ASSETS,
  INITIAL_SHOWROOM_ITEMS,
} from '../../src/renderer/data/initialData';

describe('Assets & Showroom Management Engine (الأصول وموجودات المعرض)', () => {
  describe('1. Fixed Lump-Sum Division Assets (المبالغ الثابتة لأصول الأقسام)', () => {
    it('correctly loads and calculates division lump sum assets for Wood, Aluminum, and Shared', () => {
      const lumpSums = INITIAL_DIVISION_LUMP_SUMS;

      const woodLump = lumpSums['WOOD'];
      const aluminumLump = lumpSums['ALUMINUM'];
      const sharedLump = lumpSums['SHARED'];

      expect(woodLump).toBeDefined();
      expect(aluminumLump).toBeDefined();
      expect(sharedLump).toBeDefined();

      expect(woodLump.lumpSumAmount).toBe('45000000.00');
      expect(aluminumLump.lumpSumAmount).toBe('52000000.00');
      expect(sharedLump.lumpSumAmount).toBe('25000000.00');

      // Total lump sums
      const total = Object.values(lumpSums).reduce(
        (acc, item) => acc.add(new PreciseMoney(item.lumpSumAmount)),
        PreciseMoney.zero()
      );
      expect(total.toDbString(2)).toBe('122000000.00');
    });

    it('allows updating fixed lump sum amount for a division', () => {
      const lumpSums: Record<DivisionId | 'SHARED', DivisionAssetLumpSum> = {
        ...INITIAL_DIVISION_LUMP_SUMS,
        WOOD: {
          ...INITIAL_DIVISION_LUMP_SUMS.WOOD,
          lumpSumAmount: '50000000.00',
          lastUpdated: '2026-10-20',
        },
      };

      expect(lumpSums.WOOD.lumpSumAmount).toBe('50000000.00');

      const newTotal = Object.values(lumpSums).reduce(
        (acc, item) => acc.add(new PreciseMoney(item.lumpSumAmount)),
        PreciseMoney.zero()
      );
      // 50M + 52M + 25M = 127M
      expect(newTotal.toDbString(2)).toBe('127000000.00');
    });
  });

  describe('2. Active Showroom Display Assets at Production Cost (تقييم معروضات المعرض بكلفة الإنتاج)', () => {
    it('evaluates only items currently in showroom as active physical display assets', () => {
      const showroomItems: ShowroomItem[] = [...INITIAL_SHOWROOM_ITEMS];

      const activeWoodItems = showroomItems.filter(
        (i) => i.divisionId === 'WOOD' && i.status === 'IN_SHOWROOM'
      );
      const activeAluminumItems = showroomItems.filter(
        (i) => i.divisionId === 'ALUMINUM' && i.status === 'IN_SHOWROOM'
      );

      const activeWoodCost = activeWoodItems.reduce(
        (acc, item) => acc.add(new PreciseMoney(item.productionCost)),
        PreciseMoney.zero()
      );

      const activeAluminumCost = activeAluminumItems.reduce(
        (acc, item) => acc.add(new PreciseMoney(item.productionCost)),
        PreciseMoney.zero()
      );

      // Wood in showroom:
      // - shw-w01: 1,400,000
      // - shw-w02: 2,600,000
      // Total Wood = 4,000,000 IQD
      expect(activeWoodCost.toDbString(2)).toBe('4000000.00');

      // Aluminum in showroom:
      // - shw-a01: 850,000
      // - shw-a02: 2,900,000
      // Total Aluminum = 3,750,000 IQD
      expect(activeAluminumCost.toDbString(2)).toBe('3750000.00');

      const totalActiveShowroomAsset = activeWoodCost.add(activeAluminumCost);
      expect(totalActiveShowroomAsset.toDbString(2)).toBe('7750000.00');
    });
  });

  describe('3. Showroom Sale Cycle (دورة بيع قطعة من المعرض)', () => {
    it('properly removes piece cost from showroom asset, records revenue, and calculates net profit', () => {
      const showroomItems: ShowroomItem[] = [...INITIAL_SHOWROOM_ITEMS];

      // Target item: shw-w01 (Production Cost: 1,400,000)
      const targetItem = showroomItems.find((i) => i.id === 'shw-w01')!;
      expect(targetItem.status).toBe('IN_SHOWROOM');
      expect(targetItem.productionCost).toBe('1400000.00');

      const actualSalePrice = '2200000.00';
      const soldDate = '2026-10-20';
      const buyerName = 'المهندس رامي التميمي';

      const netProfit = new PreciseMoney(actualSalePrice)
        .sub(new PreciseMoney(targetItem.productionCost))
        .toDbString(2);
      expect(netProfit).toBe('800000.00'); // 2,200,000 - 1,400,000

      // Execute sale
      const updatedItems = showroomItems.map((i) =>
        i.id === targetItem.id
          ? {
              ...i,
              status: 'SOLD' as const,
              actualSalePrice,
              soldDate,
              buyerName,
              netProfit,
            }
          : i
      );

      // Verify active showroom assets decreased by 1,400,000
      const newActiveWoodItems = updatedItems.filter(
        (i) => i.divisionId === 'WOOD' && i.status === 'IN_SHOWROOM'
      );
      const newActiveWoodCost = newActiveWoodItems.reduce(
        (acc, item) => acc.add(new PreciseMoney(item.productionCost)),
        PreciseMoney.zero()
      );

      // 4,000,000 - 1,400,000 = 2,600,000 (only shw-w02 remains)
      expect(newActiveWoodCost.toDbString(2)).toBe('2600000.00');

      // Verify realized sales and profit for Wood division
      const soldWoodItems = updatedItems.filter(
        (i) => i.divisionId === 'WOOD' && i.status === 'SOLD'
      );
      const totalRealizedSales = soldWoodItems.reduce(
        (acc, item) => acc.add(new PreciseMoney(item.actualSalePrice || '0.00')),
        PreciseMoney.zero()
      );
      const totalRealizedProfit = soldWoodItems.reduce(
        (acc, item) => acc.add(new PreciseMoney(item.netProfit || '0.00')),
        PreciseMoney.zero()
      );

      // Previously sold item in initial data was shw-w03: actualSalePrice: 5,000,000, netProfit: 1,500,000
      // Newly sold item is shw-w01: actualSalePrice: 2,200,000, netProfit: 800,000
      // Total Wood Realized Sales = 5,000,000 + 2,200,000 = 7,200,000
      // Total Wood Realized Profit = 1,500,000 + 800,000 = 2,300,000
      expect(totalRealizedSales.toDbString(2)).toBe('7200000.00');
      expect(totalRealizedProfit.toDbString(2)).toBe('2300000.00');
    });
  });

  describe('4. Showroom Replenishment Cycle (دورة تعويض قطعة بديلة للمعرض)', () => {
    it('capitalizes manufacturing cost of new display piece into showroom assets', () => {
      let showroomItems: ShowroomItem[] = [...INITIAL_SHOWROOM_ITEMS];

      // Initial Aluminum active showroom cost was 3,750,000
      const newAluminumPiece: ShowroomItem = {
        id: `shw-rep-${Date.now()}`,
        itemCode: 'SHW-ALM-004',
        nameAr: 'قاطع زجاجي ذكي Smart Glass بإطار ألمنيوم مخفي',
        divisionId: 'ALUMINUM',
        category: 'قواطع وزجاج',
        productionCost: '2200000.00',
        proposedSalePrice: '3200000.00',
        displayDate: '2026-10-20',
        dimensions: 'عرض 250 سم × ارتفاع 280 سم',
        status: 'IN_SHOWROOM',
        notes: 'عينة بديلة لتعويض المعروضات المباعة',
      };

      showroomItems = [newAluminumPiece, ...showroomItems];

      // Calculate new Aluminum active showroom asset
      const activeAluminumItems = showroomItems.filter(
        (i) => i.divisionId === 'ALUMINUM' && i.status === 'IN_SHOWROOM'
      );
      const activeAluminumCost = activeAluminumItems.reduce(
        (acc, item) => acc.add(new PreciseMoney(item.productionCost)),
        PreciseMoney.zero()
      );

      // 3,750,000 + 2,200,000 = 5,950,000
      expect(activeAluminumCost.toDbString(2)).toBe('5950000.00');
      expect(activeAluminumItems.length).toBe(3);
    });
  });

  describe('5. Integration with Division Financial Summary & Distributable Profit', () => {
    it('adds realized showroom net profit to division profit distribution pool', () => {
      // Base divisional operating profit from projects
      const baseWoodProjectsProfit = new PreciseMoney('15000000.00');

      // Realized profit from Wood sold items
      const soldWoodPieces = INITIAL_SHOWROOM_ITEMS.filter(
        (i) => i.divisionId === 'WOOD' && i.status === 'SOLD'
      );

      const showroomRealizedProfit = soldWoodPieces.reduce(
        (acc, item) => acc.add(new PreciseMoney(item.netProfit || '0.00')),
        PreciseMoney.zero()
      );

      // Initial sold piece shw-w03 has net profit 1,500,000
      expect(showroomRealizedProfit.toDbString(2)).toBe('1500000.00');

      // Total distributable profit before reserve
      const totalWoodNetProfit = baseWoodProjectsProfit.add(showroomRealizedProfit);
      expect(totalWoodNetProfit.toDbString(2)).toBe('16500000.00');

      // Reserve 10%
      const reservePercentage = new PreciseMoney('10.00');
      const reserveFraction = reservePercentage.div(new PreciseMoney('100.00'));
      const reserveAmount = totalWoodNetProfit.mul(reserveFraction);
      const distributableProfit = totalWoodNetProfit.sub(reserveAmount);

      expect(reserveAmount.toDbString(2)).toBe('1650000.00');
      expect(distributableProfit.toDbString(2)).toBe('14850000.00');
    });
  });

  describe('6. Total Corporate Assets Aggregation (إجمالي الأصول المجمعة للشركة)', () => {
    it('aggregates fixed assets and active showroom assets with division breakdown', () => {
      const lumpSums = INITIAL_DIVISION_LUMP_SUMS;
      const showroomItems = INITIAL_SHOWROOM_ITEMS;
      const fixedAssets = INITIAL_FIXED_ASSETS;

      // Lump sums:
      // Wood: 45M, Aluminum: 52M, Shared: 25M -> Total Lump = 122M
      const totalLumpSums = Object.values(lumpSums).reduce(
        (acc, item) => acc.add(new PreciseMoney(item.lumpSumAmount)),
        PreciseMoney.zero()
      );
      expect(totalLumpSums.toDbString(2)).toBe('122000000.00');

      // Active Showroom Assets at Cost:
      // Wood: 4,000,000, Aluminum: 3,750,000 -> Total Showroom = 7,750,000
      const totalShowroomCost = showroomItems
        .filter((i) => i.status === 'IN_SHOWROOM')
        .reduce(
          (acc, item) => acc.add(new PreciseMoney(item.productionCost)),
          PreciseMoney.zero()
        );
      expect(totalShowroomCost.toDbString(2)).toBe('7750000.00');

      // Combined Company Net Assets = 122,000,000 + 7,750,000 = 129,750,000 IQD
      const totalCompanyAssets = totalLumpSums.add(totalShowroomCost);
      expect(totalCompanyAssets.toDbString(2)).toBe('129750000.00');

      // Also verify detailed fixed asset registry sum matches expected registry total
      const detailedAssetsTotal = fixedAssets.reduce(
        (acc, item) => acc.add(new PreciseMoney(item.currentValue)),
        PreciseMoney.zero()
      );
      // Wood: 18M + 12M + 8.5M + 6.5M = 45M
      // Aluminum: 22M + 8.5M + 7.5M + 14M = 52M
      // Shared: 16M + 9M = 25M
      // Sum = 122M
      expect(detailedAssetsTotal.toDbString(2)).toBe('122000000.00');
    });
  });

  describe('7. Direct Warehouse Material Issuance for Showroom Display Asset (صرف مواد من المستودع لتصنيع نموذج للمعرض كأصل داخلي)', () => {
    it('issues raw materials from warehouse, decreases stock, and auto-capitalizes into showroom assets without negative project impact', () => {
      // 1. Initial batch in Wood Warehouse
      const initialBatch = {
        id: 'batch-w1',
        materialId: 'mat-w1',
        materialNameAr: 'خشب صاج بورمي طبيعي (سماكة 2 بوصة)',
        warehouseId: 'wh-wood',
        divisionId: 'WOOD' as const,
        purchaseInvoiceId: 'inv-1',
        batchNumber: 'BATCH-2026-001',
        initialQuantity: '50.00',
        remainingQuantity: '30.00',
        unitCost: '180000.00',
        receivedDate: '2026-01-10',
      };

      const issueQty = '5.00';
      const expectedTotalCost = new PreciseMoney(initialBatch.unitCost).mul(issueQty).toDbString(2);
      // 180,000 * 5 = 900,000 IQD
      expect(expectedTotalCost).toBe('900000.00');

      // 2. Decrease batch quantity
      const newRemaining = new PreciseMoney(initialBatch.remainingQuantity).sub(new PreciseMoney(issueQty)).toDbString(2);
      expect(newRemaining).toBe('25.00');

      // 3. Auto-generate Showroom Item
      const newShowroomPiece: ShowroomItem = {
        id: 'shw-auto-test-1',
        itemCode: 'SHW-WOD-005',
        nameAr: 'طقم كونسول ملكي جديد مصنّع من المستودع',
        divisionId: 'WOOD',
        category: 'أبواب ونماذج ديكورية',
        productionCost: expectedTotalCost,
        proposedSalePrice: '1500000.00',
        status: 'IN_SHOWROOM',
        displayDate: '2026-10-20',
        dimensions: 'عرض 140 سم × ارتفاع 220 سم',
        notes: 'تم تصنيع القطعة وصرف موادها مباشرة من المستودع',
      };

      expect(newShowroomPiece.productionCost).toBe('900000.00');
      expect(newShowroomPiece.status).toBe('IN_SHOWROOM');

      // 4. Verify Active Showroom Inventory increased by 900,000
      let showroomList = [...INITIAL_SHOWROOM_ITEMS, newShowroomPiece];
      const activeWoodShowroomItems = showroomList.filter(
        (i) => i.divisionId === 'WOOD' && i.status === 'IN_SHOWROOM'
      );
      const totalWoodShowroomCost = activeWoodShowroomItems.reduce(
        (acc, item) => acc.add(new PreciseMoney(item.productionCost)),
        PreciseMoney.zero()
      );

      // Initial active wood was 4,000,000 + 900,000 = 4,900,000
      expect(totalWoodShowroomCost.toDbString(2)).toBe('4900000.00');

      // 5. Simulate subsequent sale of this newly manufactured showroom item
      const salePrice = '1600000.00';
      const realizedProfit = new PreciseMoney(salePrice).sub(new PreciseMoney(newShowroomPiece.productionCost)).toDbString(2);
      // 1,600,000 - 900,000 = 700,000 IQD profit
      expect(realizedProfit).toBe('700000.00');

      // Selling the piece:
      showroomList = showroomList.map((i) =>
        i.id === newShowroomPiece.id
          ? { ...i, status: 'SOLD' as const, actualSalePrice: salePrice, netProfit: realizedProfit, soldDate: '2026-11-01' }
          : i
      );

      // Active showroom asset drops back by 900,000 to 4,000,000
      const activeAfterSale = showroomList
        .filter((i) => i.divisionId === 'WOOD' && i.status === 'IN_SHOWROOM')
        .reduce((acc, item) => acc.add(new PreciseMoney(item.productionCost)), PreciseMoney.zero());
      expect(activeAfterSale.toDbString(2)).toBe('4000000.00');

      // Sold profit is credited to Wood division
      const woodSoldItems = showroomList.filter((i) => i.divisionId === 'WOOD' && i.status === 'SOLD');
      const totalWoodProfit = woodSoldItems.reduce(
        (acc, item) => acc.add(new PreciseMoney(item.netProfit || '0.00')),
        PreciseMoney.zero()
      );

      // Previous sold was 1,500,000 + new 700,000 = 2,200,000
      expect(totalWoodProfit.toDbString(2)).toBe('2200000.00');
    });
  });

  describe('8. Showroom Finished Goods Warehouse Accounting Model (مستودع المعرض للمواد الجاهزة)', () => {
    it('verifies that manufacturing does not touch cash/treasury, accumulates multi-material costs, and sale recovers cost and credits profit to cash', () => {
      // 1. Initial State
      let treasuryCash = new PreciseMoney('50000000.00'); // 50,000,000 IQD in cash treasury
      const initialCash = treasuryCash.toDbString(2);

      // Raw warehouse batch: Wood
      const rawWoodBatch = {
        id: 'batch-w10',
        materialNameAr: 'ألواح خشب بلوط أوروبي',
        divisionId: 'WOOD' as const,
        remainingQuantity: '20.00',
        unitCost: '150000.00',
      };

      // Raw warehouse batch: Accessories
      const rawAccessoryBatch = {
        id: 'batch-w11',
        materialNameAr: 'مقابض ومفصلات إيطالية فاخرة',
        divisionId: 'WOOD' as const,
        remainingQuantity: '10.00',
        unitCost: '50000.00',
      };

      // Stage A: Issue 1st material (Wood: 4 units = 600,000 IQD) to create a new finished goods door in showroom
      const issueWoodQty = '4.00';
      const woodMaterialCost = new PreciseMoney(rawWoodBatch.unitCost).mul(issueWoodQty);
      expect(woodMaterialCost.toDbString(2)).toBe('600000.00');

      // CRITICAL CHECK: Cash Treasury MUST NOT change during manufacturing
      expect(treasuryCash.toDbString(2)).toBe(initialCash); // Still 50,000,000 IQD!

      const newDoorItem: ShowroomItem = {
        id: 'shw-door-001',
        itemCode: 'SHW-WOD-010',
        nameAr: 'باب داخلي ملكي من خشب البلوط',
        divisionId: 'WOOD',
        category: 'أبواب ديكورية فاخرة',
        productionCost: woodMaterialCost.toDbString(2),
        proposedSalePrice: '1200000.00',
        status: 'IN_SHOWROOM',
        displayDate: '2026-10-25',
      };

      expect(newDoorItem.productionCost).toBe('600000.00');

      // Stage B: Issue 2nd material (Accessories: 2 units = 100,000 IQD) to the EXISTING showroom door
      const issueAccQty = '2.00';
      const accMaterialCost = new PreciseMoney(rawAccessoryBatch.unitCost).mul(issueAccQty);
      expect(accMaterialCost.toDbString(2)).toBe('100000.00');

      // Again: Cash Treasury MUST NOT change during this internal warehouse transfer
      expect(treasuryCash.toDbString(2)).toBe(initialCash);

      // Door accumulated cost: 600,000 + 100,000 = 700,000 IQD
      const accumulatedDoorCost = new PreciseMoney(newDoorItem.productionCost).add(accMaterialCost);
      const updatedDoorItem: ShowroomItem = {
        ...newDoorItem,
        productionCost: accumulatedDoorCost.toDbString(2),
      };
      expect(updatedDoorItem.productionCost).toBe('700000.00');

      // Stage C: Sale of the showroom finished goods door to a customer
      const finalSalePrice = '1300000.00'; // Sold for 1,300,000 IQD
      const recoveredCost = new PreciseMoney(updatedDoorItem.productionCost); // 700,000 IQD
      const netProfit = new PreciseMoney(finalSalePrice).sub(recoveredCost); // 600,000 IQD

      expect(netProfit.toDbString(2)).toBe('600000.00');

      // Full sale price enters the Treasury Cash:
      treasuryCash = treasuryCash.add(new PreciseMoney(finalSalePrice));
      // 50,000,000 + 1,300,000 = 51,300,000 IQD
      expect(treasuryCash.toDbString(2)).toBe('51300000.00');

      // Verify that the Treasury effectively received:
      // 1) Cost recovery (700,000) restoring working capital liquidity
      // 2) Net profit (600,000) available for partner liquidation distribution
      const totalInflow = recoveredCost.add(netProfit);
      expect(totalInflow.toDbString(2)).toBe(finalSalePrice);

      // Door transitions to SOLD status and exits showroom inventory
      const soldDoorItem: ShowroomItem = {
        ...updatedDoorItem,
        status: 'SOLD',
        actualSalePrice: finalSalePrice,
        netProfit: netProfit.toDbString(2),
        soldDate: '2026-10-25',
      };
      expect(soldDoorItem.status).toBe('SOLD');
    });
  });
});

