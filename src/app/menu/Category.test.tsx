// Category.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Category from './Category';
import type { MenuCategory } from '@/schemas/menu';

// We're mocking the Item component here to isolate our tests to just the Category component.
vi.mock('./Item', () => ({
  default: ({ id, name }: { id: string; name: string }) => (
    <div data-testid={`mock-item-${id}`}>{name}</div>
  )
}));

describe('Category', () => {
  const category: MenuCategory = {
    id: 'burgers',
    name: 'Burgers',
    items: [
      {
        id: 'classic-cheeseburger',
        name: 'Classic Cheeseburger',
        description:
          'Beef patty with cheddar, lettuce, tomato, and house sauce.',
        priceCents: 1099,
        available: true,
        allergens: ['gluten', 'milk'],
        image: '/images/classic-cheeseburger.jpg'
      },
      {
        id: 'spicy-chicken-burger',
        name: 'Spicy Chicken Burger',
        description: 'Crispy chicken fillet with hot sauce and pickles.',
        priceCents: 999,
        available: false,
        allergens: ['gluten', 'egg', 'mustard'],
        image: '/images/spicy-chicken-burger.jpg'
      }
    ]
  };

  it('renders the category name', () => {
    render(<Category {...category} />);

    expect(screen.getByTestId('category-burgers')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Burgers' })
    ).toBeInTheDocument();
  });

  it('renders each item in the category', () => {
    render(<Category {...category} />);

    expect(
      screen.getByTestId('mock-item-classic-cheeseburger')
    ).toBeInTheDocument();
    expect(screen.getByText('Classic Cheeseburger')).toBeInTheDocument();

    expect(
      screen.getByTestId('mock-item-spicy-chicken-burger')
    ).toBeInTheDocument();
    expect(screen.getByText('Spicy Chicken Burger')).toBeInTheDocument();
  });
});
