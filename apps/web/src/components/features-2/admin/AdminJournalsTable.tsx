import { StockAdjustment } from "@/interfaces/StockInterface";
import { currentStoreInStockAtom } from "@/stores/stockStores";
import { useAtom } from "jotai";
import React from "react";

interface StockAdjustmentTableProps {
  stockAdjustments?: StockAdjustment[]; // Made stockAdjustments optional
}

export default function AdminJournalsTable({
  stockAdjustments = [],
}: StockAdjustmentTableProps) {
  const formatDate = (dateString?: string) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";
  };

  const [selectedStoreStock, setSelectedStoreStock] = useAtom(currentStoreInStockAtom);

  const handleAllow = (id: number) => {
    console.log(`Allow clicked for stock adjustment ID: ${id}`);
    // Logic to approve the adjustment
  };

  const handleReject = (id: number) => {
    console.log(`Reject clicked for stock adjustment ID: ${id}`);
    // Logic to reject the adjustment
  };

  // Helper function to check if action buttons should be shown
  const shouldShowActions = (adjustment: StockAdjustment) => {
    const { from_store_id, mutation_type, adjustment_related_end } = adjustment;
  
    // Ensure the store matches the selected store
    const isStoreMatching = from_store_id === selectedStoreStock?.id;
    const isPending = mutation_type === "pending";
    const hasNoEndRecordAfterPending = !adjustment_related_end || adjustment_related_end.length === 0;
  
    // Check if adjustment_related_end has "purchase" or "abort" type
    const hasPurchaseOrAbort = adjustment_related_end?.some(
      (end) => end.type === "purchase" || end.type === "abort"
    );
  
    // Ensure that actions are not shown if "purchase" or "abort" type exists
    const shouldShow = isStoreMatching && isPending && hasNoEndRecordAfterPending && !hasPurchaseOrAbort;
  
    // console.log("from_store_id:", from_store_id);
    // console.log("selectedStoreStock id:", selectedStoreStock?.id);
    // console.log("shouldShowActions:", shouldShow);
  
    return shouldShow;
  };
  

  return (
    <div className="overflow-x-auto">
      <table className="table w-full text-base">
        <thead>
          <tr>
            <th className="text-lg font-extrabold">Actions</th>
            <th className="text-lg font-extrabold">Stock Adjustment ID</th>
            <th className="text-lg font-extrabold">From Store</th>
            <th className="text-lg font-extrabold">To Store</th>
            <th className="text-lg font-extrabold">Type</th>
            <th className="text-lg font-extrabold">Mutation Type</th>
            <th className="text-lg font-extrabold">Qty Change</th>
            <th className="text-lg font-extrabold">Created At</th>
            <th className="text-lg font-extrabold">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {stockAdjustments.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center">
                No stock adjustments available
              </td>
            </tr>
          ) : (
            stockAdjustments.map((adjustment) => (
              <tr key={adjustment.id}>
                <td>
                  {shouldShowActions(adjustment) ? (
                    <div className="flex space-x-2">
                      <button
                        className="btn btn-success"
                        onClick={() => handleAllow(adjustment.id)}
                      >
                        Allow
                      </button>
                      <button
                        className="btn btn-error"
                        onClick={() => handleReject(adjustment.id)}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500">No Actions</span>
                  )}
                </td>
                <td>{adjustment.id || "N/A"}</td>
                <td>{adjustment.from_store?.name || "N/A"}</td>
                <td>{adjustment.destinied_store?.name || "N/A"}</td>
                <td>{adjustment.type || "N/A"}</td>
                <td>{adjustment.mutation_type || "N/A"}</td>
                <td>{adjustment.qty_change || 0}</td>
                <td>{formatDate(adjustment.createdAt)}</td>
                <td>{formatDate(adjustment.updatedAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
