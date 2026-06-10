import type { MenuItem } from '@/schemas/menu';
import Image from 'next/image';
import styles from './Item.module.scss';
import { CartControl } from '@/components/CartControl';
import Link from 'next/link';

export default function Item({
  id,
  name,
  description,
  priceCents,
  available,
  allergens,
  image
}: MenuItem) {
  return (
    <div key={id} className={styles.item} data-testid={`item-${id}`}>
      <h3 className={styles.item__name}>{name}</h3>
      <Image
        className={styles.item__image}
        src={image}
        width={200}
        height={150}
        alt={`${name}: ${description}`}
      />
      <p className={styles.item__description}>{description}</p>
      <p className={styles.item__allergens}>
        Allergens: {allergens.join(', ') || 'None'}
      </p>
      <p className={styles.item__price}>
        Price: €{(priceCents / 100).toFixed(2)}{' '}
        {available ? '' : '(Unavailable)'}
      </p>
      <CartControl
        item={{
          id,
          name,
          description,
          priceCents,
          available,
          allergens,
          image
        }}
      />
      <div>
        <Link href="/cart">Go To Cart</Link>
      </div>
    </div>
  );
}
