import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import pool from "../../lib/pool";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const orderSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Invalid card number"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Invalid expiry date"),
  cvc: z.string().regex(/^\d{3}$/, "Invalid CVC"),
  saveCard: z.boolean(),
  orderId: z.string(),
  amount: z.any(),
  productName: z.string(),
  fileName: z.string(),
  email: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    orderSchema.parse(body);

    const { cardNumber, expiry, cvc, saveCard, orderId, email } = body;

    const [month, year] = expiry.split("/").map(Number);
    const formattedExpiry = new Date(`20${year}-${month}-01`)
      .toISOString()
      .split("T")[0]; // YYYY-MM-DD

    const [updateResult] = await pool.query<ResultSetHeader>(
      "UPDATE orders SET paid = TRUE WHERE guid = ?",
      [orderId],
    );

    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 406 });
    }

    if (saveCard) {
      console.log("We chose to save card: Heres card numer: ", cardNumber);
      console.log("Here expiry: ", formattedExpiry);
      console.log("Heres cvc: ", cvc);
      const [existingCard] = await pool.query<RowDataPacket[]>(
        "SELECT id FROM cards WHERE card_number = ? AND expiration_date = ? AND cvc = ?",
        [cardNumber, formattedExpiry, cvc],
      );

      let cardId: number;

      if (existingCard.length > 0) {
        cardId = existingCard[0].id;
        console.log("Card was found YES to exist");
      } else {
        console.log("Card was found NOT to exist");
        // Insert new card details into the `cards` table
        const [insertResult] = await pool.query<ResultSetHeader>(
          "INSERT INTO cards (card_number, expiration_date, cvc) VALUES (?, ?, ?)",
          [cardNumber, formattedExpiry, cvc],
        );
        cardId = insertResult.insertId;
      }

      console.log("Now mapping cardId: ", cardId);
      console.log("Now mapping email: ", email);
      const [mappingResult] = await pool.query<ResultSetHeader>(
        "INSERT INTO user_cards (email, card_id) VALUES (?, ?)",
        [email, cardId],
      );

      if (mappingResult.affectedRows > 0) {
        console.log(`Card mapped to email: ${email}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message).join(", ") },
        { status: 403 },
      );
    }

    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 503 },
    );
  }
}
