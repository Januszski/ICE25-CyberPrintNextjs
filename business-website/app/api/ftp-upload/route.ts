import { NextResponse } from "next/server";
import ftp from "basic-ftp";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileName } = body;

    if (!fileName) {
      return NextResponse.json(
        { message: "fileName is required in the request body" },
        { status: 400 },
      );
    }

    console.log("filename to upload: ", fileName);
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
