import bucket from "./firebase";
import fs from "fs";

/**
 * @param {string} data
 * @param {string} originalName
 * @param {string} mimeType
 */
export default async function uploadToGCSFrombase64(data, originalName, mimeType) {
  let image = Buffer.from(data, 'base64')
  let path = `${Date.now()}-${originalName}`
  const file = bucket.file(path);

  const stream = file.createWriteStream({
    metadata: {
      contentType: mimeType
    }
  });

  let promise = new Promise((resolve, reject) => {
    stream.on('error', err => { reject(err) })
    stream.on('finish', () => {
      file.makePublic().then(() => {
        resolve(`https://storage.googleapis.com/${bucket.name}/${file.name}`)
      });
    })
  })
  stream.end(image)
  return promise
}