import { z } from 'zod';

export const AllergenSchema = z.enum([
  'gluten',
  'soy',
  'fish',
  'peanuts',
  'milk',
  'egg',
  'mustard'
]);

export const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  priceCents: z.number().int().nonnegative(),
  allergens: z.array(AllergenSchema),
  available: z.boolean(),
  image: z.string()
});

export const MenuCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  items: z.array(MenuItemSchema)
});

export const RestaurantMenuSchema = z.object({
  restaurantId: z.string(),
  restaurantName: z.string(),
  currency: z.string(),
  categories: z.array(MenuCategorySchema)
});

export type Allergen = z.infer<typeof AllergenSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type MenuCategory = z.infer<typeof MenuCategorySchema>;
export type RestaurantMenu = z.infer<typeof RestaurantMenuSchema>;
