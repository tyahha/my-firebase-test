import React, { useEffect, useState } from "react"

import firebase from "firebase/app"
import VideoPlayer from "./components/VideoJsPlayer"
import axios from "axios"

const getVideoList = async (): Promise<string[]> => {
  const list = await firebase.storage().ref("videos").list()
  const ret = list.items.map((i) => i.name)
  console.log("list ret ", ret)
  return ret
}

function App() {
  const [uploadTo, setUploadTo] = useState<"firebase" | "drive">("drive")

  return (
    <div>
      <ul>
        <li>
          <label>
            <input
              type={"radio"}
              value={"drive"}
              name={"upload_to"}
              checked={uploadTo === "drive"}
              onChange={() => setUploadTo("drive")}
            />
            Google Driveにアップロードする
          </label>
        </li>
        <li>
          <label>
            <input
              type={"radio"}
              value={"firebase"}
              name={"upload_to"}
              checked={uploadTo === "firebase"}
              onChange={() => setUploadTo("firebase")}
            />
            Firebaseにアップロードする
          </label>
        </li>
      </ul>
      {uploadTo === "drive" && <GoogleDriveContent />}
      {uploadTo === "firebase" && <FirebaseContent />}
    </div>
  )
}

export default App

export const GoogleDriveContent = () => {
  const [progress, setProgress] = useState<number | null>(null)

  return (
    <>
      <p>
        動画をアップロードする
        <input
          disabled={progress != null}
          type={"file"}
          onChange={(e) => {
            const file = e.target.files && e.target.files[0]
            if (!file) {
              return
            }

            setProgress(0)

            try {
              const data = new FormData()
              data.append(file.name, file)

              const url = "https://asia-northeast1-fs31-test.cloudfunctions.net/uploadVideo"
              // const url = "http://localhost:5001/fs31-test/asia-northeast1/uploadVideo"

              axios
                .post(url, data, {
                  headers: {
                    "content-type": "multipart/form-data",
                  },
                })
                .then(() => alert("success"))
                .catch((e) => {
                  alert("error")
                  console.error(e)
                })
            } finally {
              e.target.value = ""
              setProgress(null)
            }
          }}
        />
      </p>
      <p>{progress != null && `アップロード進捗：${progress.toFixed(1)}％`}</p>
    </>
  )
}

export const FirebaseContent = () => {
  const [progress, setProgress] = useState<number | null>(null)
  const [videos, setVideos] = useState<string[]>([])

  useEffect(() => {
    getVideoList().then((ret) => setVideos(ret))
  }, [])

  return (
    <>
      <p>
        動画をアップロードする
        <input
          disabled={progress != null}
          type={"file"}
          onChange={(e) => {
            const file = e.target.files && e.target.files[0]
            if (file) {
              setProgress(0)
              const storageRef = firebase.storage().ref()
              const ref = storageRef.child(`videos/${file.name}`)
              const uploadTask = ref.put(file)

              uploadTask.on("running", (e) => {
                setProgress((e.bytesTransferred / file.size) * 100)
              })

              uploadTask
                .then((snapshot) => {
                  alert("アップロードが完了しました")
                  console.log("snapshot.metadata", snapshot.metadata)
                  setVideos(videos.concat(snapshot.metadata.name))
                })
                .catch((e) => {
                  console.error(e)
                  alert("アップロードに失敗しました")
                })
                .finally(() => {
                  e.target.value = ""
                  setProgress(null)
                })
            }
          }}
        />
      </p>
      <p>{progress && `アップロード進捗：${progress.toFixed(1)}％`}</p>
      <p>
        動画一覧
        <ul>
          {videos.map((v, i) => {
            return (
              <li key={i}>
                {v}
                <VideoPlayer
                  width={200}
                  autoplay={false}
                  controls={true}
                  sources={[
                    {
                      src: `https://firebasestorage.googleapis.com/v0/b/my-test-58887.appspot.com/o/videos%2F${v}?alt=media`,
                    },
                  ]}
                />
              </li>
            )
          })}
        </ul>
      </p>
    </>
  )
}
