// getCheckoutTotals.test.ts

import { describe, expect, it } from 'vitest';

import { DELIVERY_FEE_CENTS, DELIVERY_WAIVER_MINIMUM } from '@/data/constants';
import { formatPrice } from '@/lib/formatPrice';
import { getCheckoutTotals } from './getCheckoutTotals';

describe('getCheckoutTotals', () => {
  it('returns no delivery charge for collection', () => {
    expect(
      getCheckoutTotals({
        fulfilmentType: 'collection',
        subtotalCents: 1299
      })
    ).toEqual({
      deliveryFeeDisplay: null,
      totalCents: 1299,
      deliveryChargeCents: 0
    });
  });

  it('adds delivery charge when delivery subtotal is below waiver minimum', () => {
    expect(
      getCheckoutTotals({
        fulfilmentType: 'delivery',
        subtotalCents: DELIVERY_WAIVER_MINIMUM - 1
      })
    ).toEqual({
      deliveryChargeCents: DELIVERY_FEE_CENTS,
      totalCents: DELIVERY_WAIVER_MINIMUM - 1 + DELIVERY_FEE_CENTS,
      deliveryFeeDisplay: `Delivery: ${formatPrice(DELIVERY_FEE_CENTS)}`
    });
  });

  it('does not add delivery charge when delivery subtotal equals waiver minimum', () => {
    expect(
      getCheckoutTotals({
        fulfilmentType: 'delivery',
        subtotalCents: DELIVERY_WAIVER_MINIMUM
      })
    ).toEqual({
      deliveryChargeCents: 0,
      totalCents: DELIVERY_WAIVER_MINIMUM,
      deliveryFeeDisplay: 'This order qualifies for free delivery!'
    });
  });

  it('does not add delivery charge when delivery subtotal exceeds waiver minimum', () => {
    expect(
      getCheckoutTotals({
        fulfilmentType: 'delivery',
        subtotalCents: DELIVERY_WAIVER_MINIMUM + 1
      })
    ).toEqual({
      deliveryChargeCents: 0,
      totalCents: DELIVERY_WAIVER_MINIMUM + 1,
      deliveryFeeDisplay: 'This order qualifies for free delivery!'
    });
  });

  it('adds delivery charge for delivery with zero subtotal', () => {
    expect(
      getCheckoutTotals({
        fulfilmentType: 'delivery',
        subtotalCents: 0
      })
    ).toEqual({
      deliveryChargeCents: DELIVERY_FEE_CENTS,
      totalCents: DELIVERY_FEE_CENTS,
      deliveryFeeDisplay: `Delivery: ${formatPrice(DELIVERY_FEE_CENTS)}`
    });
  });
});
