import * as functions from "firebase-functions"
//import { google } from "googleapis"
import * as Busboy from "busboy"

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const uploadVideo = functions.https.onRequest((request, response) => {
  //const drive = google.drive({ version: "v3" })

  // CORS
  if (request.method === "OPTION") {
    response.header("Access-Control-Allow-Origin", "*")
    response.header("Access-Control-Allow-Headers", "Content-Type")
    response.header("Access-Control-Allow-Methods", "POST")
    response.status(200).end()
    return
  }

  if (request.method !== "POST") {
    response.status(405).send("Method Not Allowed")
    return
  }

  const busboy = new Busboy({ headers: request.headers })
  busboy.on("file", (fieldName, file, filename, encoding, mimetype) => {
    functions.logger.info("----- upload file ------")
    functions.logger.info("field name", fieldName)
    functions.logger.info("filename", filename)
    functions.logger.info("encoding", encoding)
    functions.logger.info("mimetype", mimetype)
  })

  functions.logger.info("Hello logs!", { structuredData: true })
  response.send("Hello from Firebase!")

  // This callback will be invoked after all uploaded files are saved.
  busboy.on("finish", () => {
    // if (Object.keys(uploads).length === 0) {
    //   response.status(200).send('success: 0 file upload');
    //   return;
    // }
    // console.log('finish : ' + JSON.stringify(uploads));
    // response.status(200).send(JSON.stringify(uploads));
    response.status(200).send("finish uploading")
  })

  busboy.end(request.rawBody)
})
