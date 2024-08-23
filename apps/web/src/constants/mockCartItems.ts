export interface mockCartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }
  
  export const mockCartItems: mockCartItem[] = [
    {
      id: 1,
      name: 'Apple',
      price: 2.99,
      quantity: 2,
      image: '/images/apple.jpg',
    },
    {
      id: 2,
      name: 'Banana',
      price: 1.5,
      quantity: 3,
      image: '/images/banana.jpg',
    },
    {
      id: 3,
      name: 'Orange',
      price: 3.99,
      quantity: 1,
      image: '/images/orange.jpg',
    },
  ];