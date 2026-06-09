import Item from './Item';
import type { MenuCategory } from '@/schemas/menu';

export default function Category({ id, name, items }: MenuCategory) {
  return (
    <>
      <div data-testid={`category-${id}`}>
        <h2>{name}</h2>
        <div>
          {items.map((item) => (
            <Item key={item.id} {...item} />
          ))}
        </div>
      </div>
    </>
  );
}
