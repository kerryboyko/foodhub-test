'use client';
import { useCartStore } from '@/stores/cartStore';

export default function OrderSummary() {
  const itemIds = useCartStore((state) => state.itemIds);
  const itemsById = useCartStore((state) => state.itemsById);
  const items = itemIds.map((id) => itemsById[id]).filter(Boolean);

  return (
    <main>
      <>
        {items.map((item) => (
          <div key={item.id}>
            <h2>{item.name}</h2>
            <p>Quantity: {item.quantity}</p>
            <p>
              Price: €{((item.priceCents * item.quantity) / 100).toFixed(2)}
            </p>
          </div>
        ))}
        <hr />
      </>
    </main>
  );
}
