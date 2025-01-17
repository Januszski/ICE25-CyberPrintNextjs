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

async function validateToken(token: string): Promise<string | null> {
  try {
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader || typeof decodedHeader === "string") {
      throw new Error("Invalid token format");
    }

    const { kid } = decodedHeader.header;
    const { iss } = decodedHeader.payload as JwtPayload;
    client = jwksClient({ jwksUri: `${iss}/protocol/openid-connect/certs` });
    const publicKey = await getSigningKey(kid!);

    const decoded = jwt.verify(token, publicKey) as JwtPayload;

    return decoded.email as string; // Return the user email from the token
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authorization header missing or invalid" }),
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];
    const userId = await validateToken(token);

    console.log("TOKEN: ", token);
    console.log("USERID: ", userId);
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 403 },
      );
    }

    // Query to get the card info associated with the user
    const [rows] = await pool.query(
      `
      SELECT 
        cards.card_number,
        cards.expiration_date,
        cards.cvc
      FROM 
        cards
      JOIN 
        user_cards ON cards.id = user_cards.card_id
      WHERE 
        user_cards.user_id = ?
      `,
      [userId],
    );

    // Return an empty array if no cards are found
    return new Response(
      JSON.stringify({ cards: rows.length > 0 ? rows : [] }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
