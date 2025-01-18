import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import pool from "../../lib/pool";
import { RowDataPacket } from "mysql2";

let client: jwksClient.JwksClient;

async function validateToken(token: string): Promise<string | null> {
  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === "string") {
      throw new Error("Invalid token format");
    }

    const payload = decoded.payload as JwtPayload & { email?: string };

    if (!payload.email) {
      throw new Error("Email field not found in token");
    }

    return payload.email; // Return the email field
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
    console.log("WE have auth header");

    const token = authHeader.split(" ")[1];
    const userId = await validateToken(token);

    console.log("USERID is: ", userId);

    console.log("TOKEN: ", token);
    console.log("USERID: ", userId);
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 403 },
      );
    }
    if (userId !== "admin@cyberprint.com") {
      return new Response(
        JSON.stringify({ error: "You are not authorized to access this" }),
        { status: 401 },
      );
    }

    // Query to get the card info associated with the user
    return new Response(JSON.stringify({ flag: process.env.SERVER_FLAG }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
