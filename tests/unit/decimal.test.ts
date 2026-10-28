import { describe, it, expect } from 'vitest';
import { PreciseMoney, formatThousands, cleanNumeric, formatInputNumber } from '../../src/core/utils/decimal';

describe('PreciseMoney — Financial Arithmetic & Rounding', () => {
  it('prevents floating point inaccuracies (e.g. 0.1 + 0.2 === 0.3)', () => {
    const a = new PreciseMoney('0.1');
    const b = new PreciseMoney('0.2');
    const sum = a.add(b);
    expect(sum.toDbString(2)).toBe('0.30');
    expect(sum.equals('0.3')).toBe(true);
  });

  it('handles multiplication and exact rounding (HALF_UP)', () => {
    const qty = new PreciseMoney('3.555');
    const price = new PreciseMoney('12500');
    const total = qty.mul(price);
    // 3.555 * 12500 = 44437.5
    expect(total.toDbString(2)).toBe('44437.50');
    expect(total.formatIQD()).toBe('44,438 د.ع');
  });

  it('rejects division by zero with an explicit error', () => {
    const a = new PreciseMoney('50000');
    expect(() => a.div(0)).toThrow('Division by zero');
  });

  it('handles negative, positive, and zero assertions', () => {
    expect(new PreciseMoney('0').isZero()).toBe(true);
    expect(new PreciseMoney('-10.5').isNegative()).toBe(true);
    expect(new PreciseMoney('10.5').isPositive()).toBe(true);
  });

  it('accepts and cleans numeric strings containing commas', () => {
    const money = new PreciseMoney('1,500,000');
    expect(money.toDbString(0)).toBe('1500000');
    expect(money.formatIQD()).toBe('1,500,000 د.ع');

    const sum = money.add('250,500');
    expect(sum.formatIQD()).toBe('1,750,500 د.ع');
  });

  it('formats number thousands separators and handles live input formatting', () => {
    expect(formatThousands('1500000')).toBe('1,500,000');
    expect(formatThousands(2500000.75)).toBe('2,500,000.75');
    expect(cleanNumeric('1,500,000')).toBe('1500000');
    expect(formatInputNumber('1250000')).toBe('1,250,000');
    expect(formatInputNumber('1,250,000')).toBe('1,250,000');
  });
});
