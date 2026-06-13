import { render, screen } from '@testing-library/react';
import MenuPage from './page';
import { getMenu } from '@/lib/menu-service';

vi.mock('@/lib/menu-service', () => ({
  getMenu: vi.fn()
}));

vi.mock('./Category', () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid={`category-${name}`}>{name}</div>
  )
}));

vi.mock('@/components/CartBar/CartBar', () => ({
  default: () => <div data-testid="cart-bar">CartBar</div>
}));

describe('MenuPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders restaurant name', async () => {
    vi.mocked(getMenu).mockResolvedValue({
      restaurantName: 'FoodHub Test Restaurant',
      categories: []
    } as never);

    const Page = await MenuPage();

    render(Page);

    expect(screen.getByTestId('restaurant-name')).toHaveTextContent(
      'FoodHub Test Restaurant'
    );
  });

  it('renders all categories', async () => {
    vi.mocked(getMenu).mockResolvedValue({
      restaurantName: 'FoodHub Test Restaurant',
      categories: [
        {
          id: 'starters',
          name: 'Starters',
          items: []
        },
        {
          id: 'mains',
          name: 'Mains',
          items: []
        }
      ]
    } as never);

    const Page = await MenuPage();

    render(Page);

    expect(screen.getByTestId('category-Starters')).toBeInTheDocument();

    expect(screen.getByTestId('category-Mains')).toBeInTheDocument();
  });

  it('renders the cart bar', async () => {
    vi.mocked(getMenu).mockResolvedValue({
      restaurantName: 'FoodHub Test Restaurant',
      categories: []
    } as never);

    const Page = await MenuPage();

    render(Page);

    expect(screen.getByTestId('cart-bar')).toBeInTheDocument();
  });

  it('calls getMenu', async () => {
    vi.mocked(getMenu).mockResolvedValue({
      restaurantName: 'FoodHub Test Restaurant',
      categories: []
    } as never);

    await MenuPage();

    expect(getMenu).toHaveBeenCalledTimes(1);
  });
});
