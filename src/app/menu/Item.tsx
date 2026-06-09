import type { MenuItem } from '@/schemas/menu';
import Image from 'next/image';

export default function Item({
  id,
  name,
  description,
  priceCents,
  available,
  allergens,
  image,
}: MenuItem) {
  return (
    <div key={id} data-testid={`item-${id}`}>
      <h3>{name}</h3>
      <p>{description}</p>
      <p>
        Price: {(priceCents / 100).toFixed(2)}{' '}
        {available ? '' : '(Unavailable)'}
      </p>
      <p>Allergens: {allergens.join(', ') || 'None'}</p>
      <Image
        src={image}
        width={200}
        height={150}
        alt={`${name}: ${description}`}
      />
    </div>
  );
}
