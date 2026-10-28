import { describe, it, expect } from 'vitest';
import { tafqeetIQD } from '../../src/core/utils/tafqeet';

describe('Arabic Tafqeet Utility for IQD', () => {
  it('converts zero properly', () => {
    expect(tafqeetIQD(0)).toBe('صفر دينار عراقي لا غير');
  });

  it('converts thousands and millions properly', () => {
    expect(tafqeetIQD(1000)).toContain('ألف');
    expect(tafqeetIQD(2000)).toContain('ألفان');
    expect(tafqeetIQD(5000000)).toContain('خمسة ملايين');
    expect(tafqeetIQD(2500000)).toContain('مليونان وخمسمائة ألف');
    expect(tafqeetIQD(18500000)).toContain('ثمانية عشر مليوناً');
  });

  it('formats with prefix and suffix', () => {
    const res = tafqeetIQD(1500000);
    expect(res.startsWith('فقط ')).toBe(true);
    expect(res.endsWith(' دينار عراقي لا غير')).toBe(true);
  });
});
