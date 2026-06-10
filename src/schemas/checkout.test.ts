// checkout.test.ts

import { describe, expect, it } from 'vitest';

import { CheckoutSchema } from './checkout';

const validDeliveryData = {
  name: 'Kerry Ann',
  phone: '0871234567',
  email: 'kerry@example.com',
  fulfilmentType: 'delivery',
  addressLine1: '123 Fake Street',
  addressLine2: '',
  postcode: 'D02 ABC1',
  notes: '',
  creditCard: '4242424242424242',
  ccExpiration: '12/30',
  ccCVCcode: '123'
};

const validCollectionData = {
  name: 'Kerry Ann',
  phone: '0871234567',
  email: 'kerry@example.com',
  fulfilmentType: 'collection',
  creditCard: '4242424242424242',
  ccExpiration: '12/30',
  ccCVCcode: '123'
};

describe('CheckoutSchema', () => {
  it('validates a delivery checkout with address fields', () => {
    const result = CheckoutSchema.safeParse(validDeliveryData);

    expect(result.success).toBe(true);
  });

  it('validates a collection checkout without address fields', () => {
    const result = CheckoutSchema.safeParse(validCollectionData);

    expect(result.success).toBe(true);
  });

  it('requires name, phone, and valid email', () => {
    const result = CheckoutSchema.safeParse({
      ...validDeliveryData,
      name: '',
      phone: '',
      email: 'not-an-email'
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toEqual(
        expect.objectContaining({
          name: ['Name is required'],
          phone: ['Phone is required'],
          email: ['Enter a valid email']
        })
      );
    }
  });

  it('requires address line 1 and postcode for delivery', () => {
    const result = CheckoutSchema.safeParse({
      ...validDeliveryData,
      addressLine1: '',
      postcode: ''
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toEqual(
        expect.objectContaining({
          addressLine1: ['Address is required for delivery'],
          postcode: ['Postcode is required for delivery']
        })
      );
    }
  });

  it('does not require address fields for collection', () => {
    const result = CheckoutSchema.safeParse({
      ...validCollectionData,
      addressLine1: '',
      postcode: ''
    });

    expect(result.success).toBe(true);
  });

  it('requires payment fields', () => {
    const result = CheckoutSchema.safeParse({
      ...validDeliveryData,
      creditCard: '',
      ccExpiration: '',
      ccCVCcode: ''
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toEqual(
        expect.objectContaining({
          creditCard: ['Card number is required'],
          ccExpiration: ['Expiration date is required'],
          ccCVCcode: ['CVC is required']
        })
      );
    }
  });
});
