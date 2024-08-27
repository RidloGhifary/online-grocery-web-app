import React from 'react';

interface TransactionItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface TransactionItemsTableProps {
  items: TransactionItem[];
}

const TransactionItemsTable: React.FC<TransactionItemsTableProps> = ({ items }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-md mb-8">
      <div className="flex justify-around bg-gray-200 p-2 font-bold">
        <span className="hidden lg:inline">Images</span>
        <span>Items</span>
        <span>Quantity</span>
        <span>Total Price</span>
      </div>
      {items.map(item => (
        <div key={item.id} className="flex justify-around items-center py-2 border-b">
          <div className="hidden lg:flex items-center">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
          </div>
          <h3 className="text-lg font-semibold lg:ml-[-4rem] ml-[-1rem]">{item.name}</h3>
          <span className='lg:ml-[-2rem] ml-[-1rem]'>{item.quantity}</span>
          <span>Rp {(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
};

export default TransactionItemsTable;
