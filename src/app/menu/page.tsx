// src/app/menu/page.tsx
import { getMenu } from '@/lib/menu-service';

export default async function MenuPage() {
  const menu = await getMenu();

  return (
    <main>
      <h1>{menu.restaurantName}</h1>
      <pre>{JSON.stringify(menu, null, 2)}</pre>
    </main>
  );
}
