export default function QuantityBox({
  qty = 1,
  setQty,
  maxQty,
}: {
  qty?: number;
  setQty: React.Dispatch<React.SetStateAction<number>>;
  maxQty: number;
}) {
  const handleDecrement = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handleIncrement = () => {
    if (qty < maxQty) setQty(qty + 1);
  };

  return (
    <div className="inline-flex items-center rounded border border-gray-200">
      <button
        onClick={handleDecrement}
        disabled={qty <= 1}
        className="flex h-8 w-8 items-center justify-center bg-gray-100 disabled:bg-gray-200 disabled:opacity-50"
      >
        -
      </button>
      <input
        type="text"
        value={qty}
        readOnly
        className="h-8 w-10 border-l border-r border-gray-200 bg-white text-center"
      />
      <button
        onClick={handleIncrement}
        disabled={qty >= maxQty || maxQty === 0}
        className="flex h-8 w-8 items-center justify-center bg-gray-100 disabled:bg-gray-200 disabled:opacity-50"
      >
        +
      </button>
    </div>
  );
}
