import { NextRequest, NextResponse } from "next/server";
import pool from "../../lib/pool";
import { v4 as uuidv4 } from "uuid";
interface Order {
  guid: string;
  price: number; // Ensure this is a number, not a string
  product_name: string;
  created_at: string;
  filesize: number;
  filename: string;
  paid: boolean;
}
export async function GET(req: NextRequest) {
  try {
    // Get the order GUID from the query parameters
    const { searchParams } = new URL(req.url);
    const orderGuid = searchParams.get("orderId");
    if (!orderGuid) {
      return NextResponse.json(
        { error: "Order GUID is required" },
        { status: 400 },
      );
    }

    // Fetch the order information from the database
    const [rows]: [Order[], any] = await pool.query(
      "SELECT * FROM orders WHERE guid = ?",
      [orderGuid],
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Return the order information

    return NextResponse.json(
      {
        message: "Order created successfully",
        order: {
          ...rows[0],
          price: parseFloat(rows[0].price).toFixed(2), // Ensure the price is a number with 2 decimal places
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error fetching order info:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

const calculatePrice = (fileSize: number): number => {
  // Scale factor to adjust price for large or small files
  const minPrice = 0.1; // Minimum price for very small files
  const maxPrice = 1000; // Maximum price for very large files
  const basePricePerMB = 0.05; // Base price per MB

  // Convert file size from bytes to MB
  const fileSizeInMB = fileSize / (1024 * 1024);

  // Calculate price based on file size
  let price = fileSizeInMB * basePricePerMB;

  // Apply scaling to avoid too low or too high prices
  if (price < minPrice) {
    price = minPrice;
  } else if (price > maxPrice) {
    price = maxPrice;
  }

  return price;
};

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { creationName, fileSize, fileName } = body;

    // Validate the input
    if (!creationName || !fileSize || !fileName) {
      return NextResponse.json(
        { error: "creationName, fileSize, and fileName are required" },
        { status: 400 },
      );
    }

    // Calculate the price based on file size
    const price = calculatePrice(fileSize);
    console.log("PRICE HERE ", price);

    // Generate a new GUID using the uuid library
    const guid = uuidv4();
    console.log("Generated GUID: ", guid);

    // Insert the new order with the generated GUID
    const [result] = await pool.query(
      "INSERT INTO orders (guid, price, product_name, created_at, filesize, filename, paid) VALUES (?, ?, ?, NOW(), ?, ?, FALSE)",
      [guid, price, creationName, fileSize, fileName],
    );

    // Fetch the newly created order's GUID and other details
    const [rows]: [Order[]] = await pool.query(
      "SELECT * FROM orders WHERE guid = ?",
      [guid],
    );
    console.log("WHAT WE JUST POST ", rows[0]);

    // Return the newly created order information
    return NextResponse.json(
      {
        message: "Order created successfully",
        order: {
          ...rows[0],
          price: parseFloat(rows[0].price).toFixed(2), // Ensure the price is a number with 2 decimal places
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error creating order:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
