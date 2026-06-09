import menuJson from '@/data/menu.json';
import { RestaurantMenuSchema } from '@/schemas/menu';

// The service layer is responsible for validating menu data before it is
// exposed to the rest of the application.
//
// Centralising schema validation here ensures that server-rendered pages,
// API endpoints, and tests all consume the same validated data model.

export function getMenu() {
  return RestaurantMenuSchema.parse(menuJson);
}
