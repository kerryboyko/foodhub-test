// Item.test.tsx
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Item from './Item';
import type { MenuItem } from '@/schemas/menu';

// Mock next/image so it behaves like a normal img in tests
vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img {...props} />;
  },
}));

describe('Item', () => {
  const baseItem: MenuItem = {
    id: 'burger-1',
    name: 'Big Beefy Burger',
    description: 'A smoky beef burger with cheddar and pickles.',
    priceCents: 1099,
    available: true,
    allergens: ['gluten', 'milk'],
    image: '/images/burger.jpg',
  };

  it('renders item details', () => {
    render(<Item {...baseItem} />);

    expect(screen.getByTestId('item-burger-1')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Big Beefy Burger' }),
    ).toBeInTheDocument();

    expect(
      screen.getByText('A smoky beef burger with cheddar and pickles.'),
    ).toBeInTheDocument();

    expect(screen.getByText(/Price: 10.99/)).toBeInTheDocument();
    expect(screen.getByText('Allergens: gluten, milk')).toBeInTheDocument();

    expect(
      screen.getByAltText(
        'Big Beefy Burger: A smoky beef burger with cheddar and pickles.',
      ),
    ).toBeInTheDocument();
  });

  it('shows unavailable text when item is unavailable', () => {
    render(<Item {...baseItem} available={false} />);

    expect(screen.getByText(/Price: 10.99/)).toHaveTextContent(
      'Price: 10.99 (Unavailable)',
    );
  });

  it('shows None when there are no allergens', () => {
    render(<Item {...baseItem} allergens={[]} />);

    expect(screen.getByText('Allergens: None')).toBeInTheDocument();
  });
});
