import { formatPrice } from './formatPrice';

describe('formatPrice()', () => {
  it('converts a price from cents to labeled euros', () => {
    expect(formatPrice(0)).toBe(`€0.00`);
    expect(formatPrice(100)).toBe(`€1.00`);
    expect(formatPrice(1323482)).toBe(`€13234.82`);
  });
});
