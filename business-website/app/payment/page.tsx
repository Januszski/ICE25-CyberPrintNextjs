"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get("item-id");

  return (
    <div>
      <h1>Payment Page</h1>
      {itemId ? (
        <p>Processing payment for item ID: {itemId}</p>
      ) : (
        <p>No item selected for payment.</p>
      )}
    </div>
  );
}
