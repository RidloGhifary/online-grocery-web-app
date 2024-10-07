//QuantityBox
import { ChangeEvent, MouseEvent, useState } from "react";
import './css/quantityBox.css'

export default function QuantityBoxV2({
  qty = 0,
  minimumQty = 0,
  maximumQty,
  fieldName
}: {
  qty?: number;
  maximumQty?: number;
  minimumQty?: number;
  fieldName?:string
}) {
  const [quantity, setQuantity] = useState<number>(qty);

  function handleIncrement(e:MouseEvent) {
    e.preventDefault()
    if (!maximumQty) {
      setQuantity((prev) => (prev += 1));
    } else {
      if (quantity < maximumQty) {
        
        setQuantity((prev) => (prev += 1));
        // console.log(quantity);
      }
    }
  }
  function handleDecrement(e:MouseEvent)  {
    e.preventDefault()
    setQuantity((prev) => (prev > minimumQty ? (prev -= 1) : prev));
  }
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.value) {
      setQuantity(Number(e.currentTarget?.value) || quantity)
    }
  }
  
  return (
    <div className="flex">
      <button
        onClick={handleDecrement}
        className="inline-flex items-center rounded-l border border-r border-gray-200 bg-white px-2 py-1 text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20 12H4"
          />
        </svg>
      </button>
      <input
      type="number"
        // defaultValue={qty}
        value={quantity??''}
        name={`${fieldName?fieldName:"qty"}`}
        className="inline-flex max-w-14 select-none items-center border-b border-t border-gray-100 bg-gray-100 text-center text-gray-600 hover:bg-gray-100"
        onChange={handleChange}
      />
      {/* <div className="inline-flex select-none items-center border-b border-t border-gray-100 bg-gray-100 px-4 py-1 text-gray-600 hover:bg-gray-100">
        {quantity}
      </div> */}
      {/* <input type="hidden" name="qty" value={quantity} /> */}
      <button
        onClick={handleIncrement}
        className="inline-flex items-center rounded-r border border-r border-gray-200 bg-white px-2 py-1 text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}
