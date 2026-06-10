'use client';
import { CartControl } from '@/components/CartControl';
import { useCartStore } from '@/stores/cartStore';

export default function Cart() {
  const itemIds = useCartStore((state) => state.itemIds);
  const itemsById = useCartStore((state) => state.itemsById);
  const subtotalCents = useCartStore((state) => state.subtotalCents());
  const items = itemIds.map((id) => itemsById[id]).filter(Boolean);

  return (
    <main>
      <>
        <div>Subtotal: €{(subtotalCents / 100).toFixed(2)}</div>
        {items.map((item) => (
          <div key={item.id}>
            <h2>{item.name}</h2>
            <CartControl item={item} />
          </div>
        ))}
      </>
    </main>
  );
}
