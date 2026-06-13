import type { MenuItem } from '@/schemas/menu';
import CartControl from '@/components/CartControl/CartControl';
import { formatPrice } from '@/lib/formatPrice';
import styles from './Item.module.scss';

export default function Item({
  id,
  name,
  description,
  priceCents,
  available,
  allergens,
  image
}: MenuItem) {
  const hasAllergens = Boolean(allergens.length);
  return (
    <div key={id} className={styles.item} data-testid={`item-${id}`}>
      <h3 className={styles.item__name}>{name}</h3>
      {/* Local menu assets have varying aspect ratios, and this component 
          intentionally preserves natural image height rather than forcing 
          a fixed thumbnail ratio. - kab*/}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.item__image}
        src={image}
        alt={`${name}: ${description}`}
      />
      <p className={styles.item__description}>{description}</p>
      {hasAllergens ? (
        <p data-testid="menu-item-allergens" className={styles.item__allergens}>
          Allergens: {allergens.join(', ')}
        </p>
      ) : null}
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
    </div>
  );
}
