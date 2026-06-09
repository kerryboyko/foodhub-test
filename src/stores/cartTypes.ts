import type { MenuItem } from '@/schemas/menu';

export type CartItem = MenuItem & {
  quantity: number;
};
