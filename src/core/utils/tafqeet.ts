/**
 * Arabic Number to Words Converter for Iraqi Dinars (Tafqeet)
 * تفقيط المبالغ المالية باللغة العربية بالدينار العراقي
 */

const ONES = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
const TENS = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
const ELEVENS = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
const HUNDREDS = ['', 'مائة', 'مئتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

function convertHundreds(num: number): string {
  if (num === 0) return '';
  const h = Math.floor(num / 100);
  const remainder = num % 100;
  const parts: string[] = [];

  if (h > 0) {
    parts.push(HUNDREDS[h]);
  }

  if (remainder > 0) {
    if (remainder < 10) {
      parts.push(ONES[remainder]);
    } else if (remainder >= 10 && remainder < 20) {
      parts.push(ELEVENS[remainder - 10]);
    } else {
      const u = remainder % 10;
      const t = Math.floor(remainder / 10);
      if (u > 0) {
        parts.push(`${ONES[u]} و${TENS[t]}`);
      } else {
        parts.push(TENS[t]);
      }
    }
  }

  return parts.join(' و');
}

export function tafqeetIQD(amount: number | string): string {
  const numericVal = typeof amount === 'string' ? Math.floor(parseFloat(amount) || 0) : Math.floor(amount || 0);
  if (numericVal === 0) {
    return 'صفر دينار عراقي لا غير';
  }
  if (numericVal < 0) {
    const positivePart = tafqeetIQD(Math.abs(numericVal));
    return `سالب (${positivePart})`;
  }

  const billions = Math.floor(numericVal / 1000000000);
  const millions = Math.floor((numericVal % 1000000000) / 1000000);
  const thousands = Math.floor((numericVal % 1000000) / 1000);
  const remainder = numericVal % 1000;

  const chunks: string[] = [];

  // Billions
  if (billions > 0) {
    if (billions === 1) chunks.push('مليار');
    else if (billions === 2) chunks.push('ملياران');
    else if (billions >= 3 && billions <= 10) chunks.push(`${convertHundreds(billions)} مليارات`);
    else chunks.push(`${convertHundreds(billions)} مليار`);
  }

  // Millions
  if (millions > 0) {
    if (millions === 1) chunks.push('مليون');
    else if (millions === 2) chunks.push('مليونان');
    else if (millions >= 3 && millions <= 10) chunks.push(`${convertHundreds(millions)} ملايين`);
    else chunks.push(`${convertHundreds(millions)} مليوناً`);
  }

  // Thousands
  if (thousands > 0) {
    if (thousands === 1) chunks.push('ألف');
    else if (thousands === 2) chunks.push('ألفان');
    else if (thousands >= 3 && thousands <= 10) chunks.push(`${convertHundreds(thousands)} آلاف`);
    else chunks.push(`${convertHundreds(thousands)} ألف`);
  }

  // Remainder hundreds
  if (remainder > 0) {
    chunks.push(convertHundreds(remainder));
  }

  const resultWords = chunks.filter(Boolean).join(' و');
  return `فقط ${resultWords} دينار عراقي لا غير`;
}
