export interface mockCartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    weight: number; 
  }
  
  export const mockCartItems: mockCartItem[] = [
    {
      id: 1,
      name: 'Apple',
      price: 2.99,
      quantity: 2,
      image: '/images/apple.jpg',
      weight: 0.3, 
    },
    {
      id: 2,
      name: 'Banana',
      price: 1.5,
      quantity: 3,
      image: '/images/banana.jpg',
      weight: 0.2, 
    },
    {
      id: 3,
      name: 'Orange',
      price: 3.99,
      quantity: 1,
      image: '/images/orange.jpg',
      weight: 0.4, 
    },
  ];

  export const mockAddress = {
    id: 1,
    name: 'John Doe',
    addressLine1: '123 Main Street',
    addressLine2: 'Apartment 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
  };