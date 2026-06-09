// src/app/menu/page.tsx
import { getMenu } from '@/lib/menu-service';
import Category from './Category';

export default async function MenuPage() {
  const menu = await getMenu();

  return (
    <main>
      <h1 data-testid="restaurant-name">{menu.restaurantName}</h1>
      <>
        {menu.categories.map((category) => (
          <Category key={category.id} {...category} />
        ))}
      </>
    </main>
  );
}
