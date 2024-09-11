"use client";

interface Props {
  deliveryNotes: string;
  onNotesChange: (notes: string) => void;
}

export default function DeliveryNotes({ deliveryNotes, onNotesChange }: Props) {
  return (
    <div>
      <label htmlFor="deliveryNotes" className="mt-4 block font-semibold">
        Delivery Notes
      </label>
      <textarea
        id="deliveryNotes"
        value={deliveryNotes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="textarea textarea-bordered w-full"
        placeholder="Any special instructions?"
      ></textarea>
    </div>
  );
}
