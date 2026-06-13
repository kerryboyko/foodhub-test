import Item from './Item';
import type { MenuCategory } from '@/schemas/menu';
import styles from './Category.module.scss';

export default function Category({ id, name, items }: MenuCategory) {
  return (
    <>
      <div className={styles.category} data-testid={`category-${id}`}>
        <h2 className={styles.category__name}>{name}</h2>
        <div>
          {items.map((item) => (
            <Item key={item.id} {...item} />
          ))}
        </div>
      </div>
    </>
  );
}
