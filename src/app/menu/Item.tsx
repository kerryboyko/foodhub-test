import type { MenuItem } from '@/schemas/menu';
import styles from './Item.module.scss';
import { CartControl } from '@/components/CartControl';
import Link from 'next/link';
import { formatPrice } from '@/lib/formatPrice';

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
      {/* I used a plain img element because the application
         displays a small set of local assets with varying aspect ratios 
         and does not benefit materially from Next Image optimization. - kab*/}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.item__image}
        src={image}
        alt={`${name}: ${description}`}
      />
      <p className={styles.item__description}>{description}</p>
      <p className={styles.item__allergens}>
        Allergens: {allergens.join(', ') || 'None'}
      </p>
      <p className={styles.item__price}>
        Price: {formatPrice(priceCents)}
        {available ? '' : ' (Unavailable)'}
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
