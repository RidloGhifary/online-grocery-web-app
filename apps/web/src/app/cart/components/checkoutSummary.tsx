import { mockCartItem } from "@/constants/mockCartItems";

interface CheckoutSummaryProps {
    items: mockCartItem[];
  }
  
  const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ items }) => {
    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  
    return (
      <div className="bg-white rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <div className="flex justify-between">
          <span>Total Price:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <button className="btn btn-primary w-full mt-4">Proceed to Checkout</button>
      </div>
    );
  };
  
  export default CheckoutSummary;