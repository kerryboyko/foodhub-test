// src/app/menu/page.tsx
import { getMenu } from '@/lib/menu-service';
import Category from './Category';
import styles from './menupage.module.scss';
import CartBar from '@/components/CartBar/CartBar';

export default async function MenuPage() {
  const menu = await getMenu();

  return (
    <main className={styles.menupage__container}>
      <div className={styles.menupage}>
        <h1 className={styles.restarauntName} data-testid="restaurant-name">
          {menu.restaurantName}
        </h1>
        <>
          {menu.categories.map((category) => (
            <Category key={category.id} {...category} />
          ))}
        </>
        <CartBar />
      </div>
    </main>
  );
}
