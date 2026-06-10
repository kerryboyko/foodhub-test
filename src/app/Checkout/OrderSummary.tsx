'use client';
import { formatPrice } from '@/lib/formatPrice';
import { useCartStore } from '@/stores/cartStore';

export default function OrderSummary() {
  const itemIds = useCartStore((state) => state.itemIds);
  const itemsById = useCartStore((state) => state.itemsById);

  // Without React Compiler, this would be a reasonable candidate
  // for useMemo since it derives an array from store state.
  // React Compiler can often optimize computations like this automatically.
  const items = itemIds.map((id) => itemsById[id]).filter(Boolean);

  return (
    <main>
      <>
        {items.map((item) => (
          <div key={item.id}>
            <h2>{item.name}</h2>
            <p>Quantity: {item.quantity}</p>
            <p>Price: {formatPrice(item.priceCents * item.quantity)}</p>
          </div>
        ))}
        <hr />
      </>
    </main>
  );
}
