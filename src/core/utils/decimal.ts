import Decimal from 'decimal.js';

// Configure default precision for accounting and inventory calculations
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export class PreciseMoney {
  private val: Decimal;

  constructor(value: number | string | Decimal | PreciseMoney) {
    if (value instanceof PreciseMoney) {
      this.val = new Decimal(value.val);
    } else if (value instanceof Decimal) {
      this.val = new Decimal(value);
    } else if (typeof value === 'number' || typeof value === 'string') {
      const cleanStr = String(value).replace(/,/g, '').trim();
      this.val = new Decimal(cleanStr === '' ? '0' : cleanStr);
    } else {
      this.val = new Decimal(0);
    }
  }

  static zero(): PreciseMoney {
    return new PreciseMoney(0);
  }

  add(other: PreciseMoney | number | string): PreciseMoney {
    const o = new PreciseMoney(other);
    return new PreciseMoney(this.val.plus(o.val));
  }

  sub(other: PreciseMoney | number | string): PreciseMoney {
    const o = new PreciseMoney(other);
    return new PreciseMoney(this.val.minus(o.val));
  }

  mul(other: PreciseMoney | number | string): PreciseMoney {
    const o = new PreciseMoney(other);
    return new PreciseMoney(this.val.times(o.val));
  }

  div(other: PreciseMoney | number | string): PreciseMoney {
    const o = new PreciseMoney(other);
    if (o.val.isZero()) {
      throw new Error('Division by zero');
    }
    return new PreciseMoney(this.val.dividedBy(o.val));
  }

  isZero(): boolean {
    return this.val.isZero();
  }

  isPositive(): boolean {
    return this.val.isPositive() && !this.val.isZero();
  }

  isNegative(): boolean {
    return this.val.isNegative();
  }

  equals(other: PreciseMoney | number | string): boolean {
    const o = new PreciseMoney(other);
    return this.val.equals(o.val);
  }

  greaterThan(other: PreciseMoney | number | string): boolean {
    const o = new PreciseMoney(other);
    return this.val.greaterThan(o.val);
  }

  lessThan(other: PreciseMoney | number | string): boolean {
    const o = new PreciseMoney(other);
    return this.val.lessThan(o.val);
  }

  /**
   * Returns exact decimal string representation for database storage (NUMERIC)
   */
  toDbString(decimals: number = 2): string {
    return this.val.toFixed(decimals, Decimal.ROUND_HALF_UP);
  }

  /**
   * Formatted string for Iraqi Dinar (IQD)
   */
  formatIQD(): string {
    const parts = this.val.toFixed(0, Decimal.ROUND_HALF_UP).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${parts[0]} د.ع`;
  }

  /**
   * Formatted numeric string with commas
   */
  formatQuantity(decimals: number = 2): string {
    return this.val.toFixed(decimals, Decimal.ROUND_HALF_UP);
  }

  toNumber(): number {
    return this.val.toNumber();
  }

  toDecimal(): Decimal {
    return this.val;
  }
}

/**
 * Formats any number or string into a thousand-separated string (e.g. 1500000 -> 1,500,000)
 */
export function formatThousands(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '';
  const clean = String(val).replace(/,/g, '').trim();
  if (isNaN(Number(clean))) return String(val);
  const parts = clean.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * Strips commas and returns a clean numeric string for calculations or DB storage
 */
export function cleanNumeric(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return '';
  return String(val).replace(/,/g, '').trim();
}

/**
 * Formats input value live on change to automatically insert commas as the user types
 */
export function formatInputNumber(rawVal: string): string {
  let clean = rawVal.replace(/[^0-9.]/g, '');
  const dotCount = (clean.match(/\./g) || []).length;
  if (dotCount > 1) {
    const firstDotIndex = clean.indexOf('.');
    clean = clean.slice(0, firstDotIndex + 1) + clean.slice(firstDotIndex + 1).replace(/\./g, '');
  }
  if (clean === '') return '';
  const parts = clean.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
