import { NextRequest, NextResponse } from "next/server";
import pool from "../../lib/pool";

export async function GET(req: NextRequest) {
  try {
    // Get the order ID from the query parameters
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    // Fetch the order information from the database
    console.log("POOL ", pool);
    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [
      orderId,
    ]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Return the order information
    return NextResponse.json(rows[0], { status: 200 });
  } catch (err) {
    console.error("Error fetching order info:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
