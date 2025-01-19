import { NextResponse } from "next/server";
import ftp from "basic-ftp";
import pool from "../../lib/pool";
import { FieldPacket, RowDataPacket } from "mysql2";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileName, orderId } = body;

    if (!fileName || !orderId) {
      return NextResponse.json(
        { message: "fileName and orderId is required in the request body" },
        { status: 400 },
      );
    }

    const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT * FROM orders WHERE guid = ?",
      [orderId],
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!rows[0].paid) {
      return NextResponse.json(
        {
          message: "Order has not been paid for",
          error: "Order has not been paid for",
        },
        { status: 402 },
      );
    }

    console.log("filename to upload: ", fileName);
    console.log("GUID IS: ", orderId);
    const localFilePath = `/path/to/local/directory/${fileName}`; // Replace with your local directory
    const remoteFilePath = `/remote/directory/${fileName}`; // Replace with your desired remote path

    const client = new ftp.Client();

    try {
      // Connect to the FTP server
      await client.access({
        host: "ftp.example.com", // Replace with your FTP server's host
        user: "anonymous", // Replace with your FTP server's user
        password: "", // Replace with your FTP server's password (empty for none)
        secure: false, // Set to true if using FTPS
      });

      // Upload the file
      await client.uploadFrom(localFilePath, remoteFilePath);

      return NextResponse.json({ message: "File uploaded successfully" });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { message: "Failed to upload file.", error: error.message },
          { status: 500 },
        );
      } else {
        return NextResponse.json(
          {
            message: "Failed to upload file.",
            error: "Unknown error occurred.",
          },
          { status: 500 },
        );
      }
    } finally {
      client.close();
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Invalid request body", error: error.message },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        { message: "Invalid request body", error: "Unknown error occurred." },
        { status: 400 },
      );
    }
  }
}
