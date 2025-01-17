import { NextResponse } from "next/server";

export async function GET() {
  // Simulating a delay to mimic a real API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const serverFlag = "FLAG{S3RV3R_S1D3_S3CR3T_R3V34L3D}";

  return NextResponse.json({ flag: serverFlag });
}
