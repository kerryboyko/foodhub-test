// src/lib/menu-service.test.ts
import { describe, expect, it } from 'vitest';
import { getMenu } from './menu-service';

describe('getMenu', () => {
  it('returns validated restaurant menu data', () => {
    const menu = getMenu();

    expect(menu.restaurantId).toBe('takeaway_001');
    expect(menu.restaurantName).toBe('Harbour Wok & Grill');
    expect(menu.currency).toBe('EUR');
    expect(menu.categories).toHaveLength(5);
  });

  it('returns categories with menu items', () => {
    const menu = getMenu();

    expect(menu.categories[0]).toMatchObject({
      id: 'cat_starters',
      name: 'Starters',
    });

    expect(menu.categories[0].items.length).toBeGreaterThan(0);
  });

  it('returns menu items with required fields', () => {
    const menu = getMenu();
    const firstItem = menu.categories[0].items[0];

    expect(firstItem).toMatchObject({
      id: 'item_1001',
      name: 'Vegetable Spring Rolls',
      priceCents: 595,
      available: true,
    });

    expect(firstItem.allergens).toContain('gluten');
  });
});
