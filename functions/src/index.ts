import * as functions from "firebase-functions"
import { google } from "googleapis"
import * as Busboy from "busboy"

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const logger = functions.logger

export const uploadVideo = functions
  .region("asia-northeast1")
  .https.onRequest(async (request, response) => {
    logger.info("test log", 1)

    // CORS
    if (request.method === "OPTIONS" || request.method === "POST") {
      response.header("Access-Control-Allow-Origin", "*")
      response.header("Access-Control-Allow-Headers", "Content-Type")
      response.header("Access-Control-Allow-Methods", "POST")

      if (request.method === "OPTIONS") {
        response.status(200).end()
        return
      }
    }

    if (request.method !== "POST") {
      response.status(405).send("Method Not Allowed")
      return
    }

    logger.info("test log", 2)

    try {
      const auth = new google.auth.GoogleAuth({
        scopes: [
          "https://www.googleapis.com/auth/drive",
          "https://www.googleapis.com/auth/drive.file",
          "https://www.googleapis.com/auth/drive.appdata",
        ],
      })
      const drive = google.drive({ version: "v3", auth })
      const busboy = new Busboy({ headers: request.headers })

      logger.info("test log", 3)

      const fileUploads: Promise<unknown>[] = []

      busboy.on("file", async (fieldName, file, filename, encoding, mimeType) => {
        logger.info("----- upload file ------")
        logger.info("field name", fieldName)
        logger.info("filename", filename)
        logger.info("encoding", encoding)
        logger.info("mimetype", mimeType)

        try {
          const promise = drive.files.create({
            supportsAllDrives: true,
            requestBody: {
              mimeType,
              name: filename,
              parents: ["1eRnOpP12c0TvEpjF7Ur7vdGcObkulX54"],
              // parents: ["1mmdRGs9QvTzhs_GDutnyG1dlZeoLMRDH"],
            },
            media: {
              mimeType,
              body: file,
            },
          })

          fileUploads.push(promise)
        } catch (e) {
          logger.error(`error while uploding file [${filename}]`, e)
        }
      })

      logger.info("Hello logs!", { structuredData: true })

      // This callback will be invoked after all uploaded files are saved.
      busboy.on("finish", () => {
        logger.info("finish busboy")
        // if (Object.keys(uploads).length === 0) {
        //   response.status(200).send('success: 0 file upload');
        //   return;
        // }
        // console.log('finish : ' + JSON.stringify(uploads));
        // response.status(200).send(JSON.stringify(uploads));

        Promise.all(fileUploads)
          .then(() => {
            response.status(200).send("success to upload")
          })
          .catch((e) => {
            logger.error("error while uploading", e)
            response.status(500).send("error while uploading")
          })
      })
      busboy.end(request.rawBody)
    } catch (e) {
      logger.error("error occur", e)
      response.status(200).send("error occur")
    }
  })
