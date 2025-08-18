import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const videosDir = "C:/Users/HOME/Documents/evision-app/public/videos/";

export async function POST(req: Request) {

  const apiKey = req.headers.get("SAKUMPOA");
  if (apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!fs.existsSync(videosDir)) {
      return NextResponse.json(
        { error: "Videos directory not found." },
        { status: 400 }
      );
    }

    const files = fs.readdirSync(videosDir).filter((f) => f.endsWith(".mkv"));
    if (files.length === 0) {
      return NextResponse.json({ message: "No MKV files found." });
    }

    const converted: string[] = [];

    await Promise.all(
      files.map(
        (file) =>
          new Promise<void>((resolve, reject) => {
            const input = path.join(videosDir, file);
            const output = input.replace(/\.mkv$/, ".mp4");
            const cmd = `ffmpeg -i "${input}" -c:v libx264 -c:a aac "${output}"`;

            exec(cmd, (err, stdout, stderr) => {
              if (!err) {
                fs.unlinkSync(input); 
                converted.push(file);
                resolve();
              } else {
                console.error(`❌ Error converting ${file}:`, err.message);
                console.error(stderr);
                reject(err);
              }
            });
          })
      )
    );

    return NextResponse.json({ message: "Conversion finished", converted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
