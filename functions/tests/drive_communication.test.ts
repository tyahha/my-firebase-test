import { google } from "googleapis"
import { v4 as uuid } from "uuid"

describe("drive communication", () => {
  test("test", async () => {
    const auth = new google.auth.GoogleAuth({
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.appdata",
      ],
      keyFile: "path/to/key.json",
    })
    const drive = google.drive({ version: "v3", auth })

    await drive.files.create({
      supportsAllDrives: true,
      requestBody: {
        name: uuid() + ".txt",
        parents: ["1eRnOpP12c0TvEpjF7Ur7vdGcObkulX54"],
        // parents: ["1mmdRGs9QvTzhs_GDutnyG1dlZeoLMRDH"],
      },
      media: {
        body: "test text ",
      },
    })
  })
})
