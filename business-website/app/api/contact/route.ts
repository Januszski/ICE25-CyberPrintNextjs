import { NextRequest, NextResponse } from "next/server";
import pool from "../../lib/pool";
import { RowDataPacket, OkPacket } from "mysql2";

interface Contact {
  id: number;
  email: string;
  inquiry_type: string;
  message: string;
  created_at: string;
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { email, inquiryType, message } = body;

    // Validate the input
    if (!email || !inquiryType || !message) {
      return NextResponse.json(
        { error: "email, inquiryType, and message are required" },
        { status: 400 },
      );
    }

    // Insert the new contact entry into the database
    const [result] = await pool.query<OkPacket>(
      "INSERT INTO contact (email, inquiry_type, message, created_at) VALUES (?, ?, ?, NOW())",
      [email, inquiryType, message],
    );

    // Fetch the newly created contact entry
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM contact WHERE id = ?",
      [
        result.insertId, // `insertId` is available in `OkPacket`, not `RowDataPacket`
      ],
    );

    // Return the newly created contact information
    return NextResponse.json(
      {
        message: "Contact entry created successfully",
        contact: rows[0] as Contact, // Cast rows[0] to the Contact type
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating contact entry:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the contact entry" },
      { status: 500 },
    );
  }
}
