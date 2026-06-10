// menu.test.ts

import { describe, expect, it } from 'vitest';

import {
  AllergenSchema,
  MenuItemSchema,
  MenuCategorySchema,
  RestaurantMenuSchema
} from './menu';

describe('AllergenSchema', () => {
  it('accepts valid allergens', () => {
    expect(AllergenSchema.safeParse('gluten').success).toBe(true);
    expect(AllergenSchema.safeParse('milk').success).toBe(true);
    expect(AllergenSchema.safeParse('egg').success).toBe(true);
  });

  it('rejects invalid allergens', () => {
    expect(AllergenSchema.safeParse('shellfish').success).toBe(false);
    expect(AllergenSchema.safeParse('cats').success).toBe(false);
  });
});

describe('MenuItemSchema', () => {
  const validItem = {
    id: 'pizza-1',
    name: 'Pepperoni Pizza',
    description: 'Pizza with pepperoni',
    priceCents: 1299,
    allergens: ['gluten', 'milk'],
    available: true,
    image: '/pizza.jpg'
  };

  it('accepts a valid menu item', () => {
    expect(MenuItemSchema.safeParse(validItem).success).toBe(true);
  });

  it('rejects negative prices', () => {
    const result = MenuItemSchema.safeParse({
      ...validItem,
      priceCents: -1
    });

    expect(result.success).toBe(false);
  });

  it('rejects non-integer prices', () => {
    const result = MenuItemSchema.safeParse({
      ...validItem,
      priceCents: 12.99
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid allergens', () => {
    const result = MenuItemSchema.safeParse({
      ...validItem,
      allergens: ['shellfish']
    });

    expect(result.success).toBe(false);
  });
});

describe('MenuCategorySchema', () => {
  it('accepts a valid category', () => {
    const result = MenuCategorySchema.safeParse({
      id: 'pizza',
      name: 'Pizza',
      items: [
        {
          id: 'pizza-1',
          name: 'Pepperoni Pizza',
          description: 'Pizza with pepperoni',
          priceCents: 1299,
          allergens: ['gluten'],
          available: true,
          image: '/pizza.jpg'
        }
      ]
    });

    expect(result.success).toBe(true);
  });
});

describe('RestaurantMenuSchema', () => {
  it('accepts a valid restaurant menu', () => {
    const result = RestaurantMenuSchema.safeParse({
      restaurantId: 'restaurant-1',
      restaurantName: 'Foodhub Pizza',
      currency: 'EUR',
      categories: [
        {
          id: 'pizza',
          name: 'Pizza',
          items: [
            {
              id: 'pizza-1',
              name: 'Pepperoni Pizza',
              description: 'Pizza with pepperoni',
              priceCents: 1299,
              allergens: ['gluten'],
              available: true,
              image: '/pizza.jpg'
            }
          ]
        }
      ]
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid nested menu items', () => {
    const result = RestaurantMenuSchema.safeParse({
      restaurantId: 'restaurant-1',
      restaurantName: 'Foodhub Pizza',
      currency: 'EUR',
      categories: [
        {
          id: 'pizza',
          name: 'Pizza',
          items: [
            {
              id: 'pizza-1',
              name: 'Pepperoni Pizza',
              description: 'Pizza with pepperoni',
              priceCents: -100,
              allergens: ['gluten'],
              available: true,
              image: '/pizza.jpg'
            }
          ]
        }
      ]
    });

    expect(result.success).toBe(false);
  });
});
