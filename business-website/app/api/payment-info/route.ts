import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import pool from "../../lib/pool";

let client: jwksClient.JwksClient;

// Function to get the signing key from JWKS
async function getSigningKey(kid: string): Promise<string> {
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) {
        return reject(err);
      }
      const signingKey = key.getPublicKey();
      resolve(signingKey);
    });
  });
}

async function validateToken(token: string): Promise<number | null> {
  try {
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader || typeof decodedHeader === "string") {
      throw new Error("Invalid token format");
    }

    const { kid } = decodedHeader.header;
    const { iss } = decodedHeader.payload as JwtPayload;
    client = jwksClient({ jwksUri: `${iss}/protocol/openid-connect/certs` });
    const publicKey = await getSigningKey(kid!);

    const decoded = jwt.verify(token, publicKey);

    return decoded.email; // Return the user ID from the token
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization header missing or invalid" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];
    const userId = await validateToken(token);

    console.log("TOKEN: ", token);
    console.log("USERID ", userId);
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 403 },
      );
    }

    const [rows] = await pool.query(
      "SELECT * FROM payment_details WHERE email = ?",
      [userId],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Payment info not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ paymentInfo: rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching payment info:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching payment info" },
      { status: 500 },
    );
  }
}
