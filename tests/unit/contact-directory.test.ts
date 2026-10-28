import { describe, it, expect } from 'vitest';
import { PreciseMoney } from '../../src/core/utils/decimal';
import { ContactRecord, DivisionId } from '../../src/shared/types';
import { INITIAL_CONTACTS } from '../../src/renderer/data/initialData';

describe('Customers & Suppliers Division Filtering Engine', () => {
  const sampleContacts: ContactRecord[] = [
    {
      id: 'c-1',
      code: 'CUST-001',
      name: 'معرض الأثاث الملكي',
      type: 'CUSTOMER',
      phone: '07701111111',
      address: 'بغداد - الكرادة',
      divisionId: 'WOOD',
      totalAmount: '10000000.00',
      paidAmount: '6000000.00',
      remainingAmount: '4000000.00',
      isActive: true,
      createdAt: '2026-01-01',
    },
    {
      id: 'c-2',
      code: 'CUST-002',
      name: 'برج الأندلس للواجهات',
      type: 'CUSTOMER',
      phone: '07802222222',
      address: 'أربيل - عينكاوة',
      divisionId: 'ALUMINUM',
      totalAmount: '20000000.00',
      paidAmount: '15000000.00',
      remainingAmount: '5000000.00',
      isActive: true,
      createdAt: '2026-01-05',
    },
    {
      id: 'c-3',
      code: 'SUP-001',
      name: 'شركة ألواح الخشب التركية',
      type: 'SUPPLIER',
      phone: '07703333333',
      address: 'البصرة',
      divisionId: 'WOOD',
      totalAmount: '8000000.00',
      paidAmount: '8000000.00',
      remainingAmount: '0.00',
      isActive: true,
      createdAt: '2026-01-10',
    },
    {
      id: 'c-4',
      code: 'SUP-002',
      name: 'مصنع سحب الألمنيوم الوطني',
      type: 'SUPPLIER',
      phone: '07804444444',
      address: 'بغداد - عويريج',
      divisionId: 'ALUMINUM',
      totalAmount: '12000000.00',
      paidAmount: '10000000.00',
      remainingAmount: '2000000.00',
      isActive: true,
      createdAt: '2026-01-12',
    },
    {
      id: 'c-5',
      code: 'SUP-003',
      name: 'تجهيزات السلامة العامة والمشتركة',
      type: 'SUPPLIER',
      phone: '07705555555',
      address: 'بغداد - الباب الشرقي',
      divisionId: null, // Shared
      totalAmount: '1500000.00',
      paidAmount: '1500000.00',
      remainingAmount: '0.00',
      isActive: true,
      createdAt: '2026-01-15',
    },
  ];

  const filterContacts = (
    contactsList: ContactRecord[],
    divisionFilter: 'ALL' | 'WOOD' | 'ALUMINUM' | 'SHARED',
    typeFilter: 'ALL' | 'CUSTOMER' | 'SUPPLIER' | 'OUTSTANDING',
    searchQuery: string = '',
    activeGlobalDivision: DivisionId | 'ALL' = 'ALL'
  ) => {
    return contactsList.filter((c) => {
      let matchesDiv = true;
      if (divisionFilter === 'WOOD') {
        matchesDiv = c.divisionId === 'WOOD';
      } else if (divisionFilter === 'ALUMINUM') {
        matchesDiv = c.divisionId === 'ALUMINUM';
      } else if (divisionFilter === 'SHARED') {
        matchesDiv = !c.divisionId;
      } else {
        matchesDiv = activeGlobalDivision === 'ALL' || c.divisionId === activeGlobalDivision || !c.divisionId;
      }

      let matchesType = true;
      if (typeFilter === 'CUSTOMER') matchesType = c.type === 'CUSTOMER';
      else if (typeFilter === 'SUPPLIER') matchesType = c.type === 'SUPPLIER';
      else if (typeFilter === 'OUTSTANDING') matchesType = new PreciseMoney(c.remainingAmount).isPositive();

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.address && c.address.toLowerCase().includes(q));

      return matchesDiv && matchesType && matchesSearch;
    });
  };

  it('filters contacts strictly by Wood division', () => {
    const woodContacts = filterContacts(sampleContacts, 'WOOD', 'ALL');
    expect(woodContacts).toHaveLength(2);
    expect(woodContacts.every((c) => c.divisionId === 'WOOD')).toBe(true);
    expect(woodContacts.map((c) => c.code)).toEqual(['CUST-001', 'SUP-001']);
  });

  it('filters contacts strictly by Aluminum division', () => {
    const alumContacts = filterContacts(sampleContacts, 'ALUMINUM', 'ALL');
    expect(alumContacts).toHaveLength(2);
    expect(alumContacts.every((c) => c.divisionId === 'ALUMINUM')).toBe(true);
    expect(alumContacts.map((c) => c.code)).toEqual(['CUST-002', 'SUP-002']);
  });

  it('filters contacts strictly by Shared / General division', () => {
    const sharedContacts = filterContacts(sampleContacts, 'SHARED', 'ALL');
    expect(sharedContacts).toHaveLength(1);
    expect(sharedContacts[0].code).toBe('SUP-003');
    expect(sharedContacts[0].divisionId).toBeNull();
  });

  it('combines division filter with customer/supplier type filter', () => {
    // Only Aluminum Customers
    const alumCustomers = filterContacts(sampleContacts, 'ALUMINUM', 'CUSTOMER');
    expect(alumCustomers).toHaveLength(1);
    expect(alumCustomers[0].code).toBe('CUST-002');

    // Only Wood Suppliers
    const woodSuppliers = filterContacts(sampleContacts, 'WOOD', 'SUPPLIER');
    expect(woodSuppliers).toHaveLength(1);
    expect(woodSuppliers[0].code).toBe('SUP-001');

    // Only Wood Outstanding (unpaid balance)
    const woodOutstanding = filterContacts(sampleContacts, 'WOOD', 'OUTSTANDING');
    expect(woodOutstanding).toHaveLength(1);
    expect(woodOutstanding[0].code).toBe('CUST-001');
    expect(new PreciseMoney(woodOutstanding[0].remainingAmount).isPositive()).toBe(true);
  });

  it('combines division filter with search query', () => {
    // Search within Wood for "ألواح"
    const searchWood = filterContacts(sampleContacts, 'WOOD', 'ALL', 'ألواح');
    expect(searchWood).toHaveLength(1);
    expect(searchWood[0].code).toBe('SUP-001');

    // Searching for "ألواح" in Aluminum yields 0 results
    const searchAlum = filterContacts(sampleContacts, 'ALUMINUM', 'ALL', 'ألواح');
    expect(searchAlum).toHaveLength(0);
  });

  it('computes financial KPIs accurately per filtered division', () => {
    const woodFiltered = filterContacts(sampleContacts, 'WOOD', 'ALL');
    const totalTransactions = woodFiltered.reduce((acc, c) => acc.add(new PreciseMoney(c.totalAmount)), PreciseMoney.zero());
    const totalPaid = woodFiltered.reduce((acc, c) => acc.add(new PreciseMoney(c.paidAmount)), PreciseMoney.zero());
    const totalRemaining = woodFiltered.reduce((acc, c) => acc.add(new PreciseMoney(c.remainingAmount)), PreciseMoney.zero());

    // Wood: 10M + 8M = 18M
    expect(totalTransactions.toDbString(2)).toBe('18000000.00');
    // Wood paid: 6M + 8M = 14M
    expect(totalPaid.toDbString(2)).toBe('14000000.00');
    // Wood remaining: 4M + 0 = 4M
    expect(totalRemaining.toDbString(2)).toBe('4000000.00');

    const alumFiltered = filterContacts(sampleContacts, 'ALUMINUM', 'ALL');
    const alumTransactions = alumFiltered.reduce((acc, c) => acc.add(new PreciseMoney(c.totalAmount)), PreciseMoney.zero());
    const alumPaid = alumFiltered.reduce((acc, c) => acc.add(new PreciseMoney(c.paidAmount)), PreciseMoney.zero());
    const alumRemaining = alumFiltered.reduce((acc, c) => acc.add(new PreciseMoney(c.remainingAmount)), PreciseMoney.zero());

    // Alum: 20M + 12M = 32M
    expect(alumTransactions.toDbString(2)).toBe('32000000.00');
    // Alum paid: 15M + 10M = 25M
    expect(alumPaid.toDbString(2)).toBe('25000000.00');
    // Alum remaining: 5M + 2M = 7M
    expect(alumRemaining.toDbString(2)).toBe('7000000.00');
  });

  it('filters INITIAL_CONTACTS dataset correctly with Wood and Aluminum', () => {
    const woodContacts = filterContacts(INITIAL_CONTACTS, 'WOOD', 'ALL');
    const alumContacts = filterContacts(INITIAL_CONTACTS, 'ALUMINUM', 'ALL');
    const sharedContacts = filterContacts(INITIAL_CONTACTS, 'SHARED', 'ALL');

    expect(woodContacts.length).toBeGreaterThan(0);
    expect(alumContacts.length).toBeGreaterThan(0);
    expect(sharedContacts.length).toBeGreaterThan(0);
    expect(woodContacts.length + alumContacts.length + sharedContacts.length).toBe(INITIAL_CONTACTS.length);
  });
});
