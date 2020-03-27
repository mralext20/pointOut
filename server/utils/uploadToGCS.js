import bucket from "./firebase";


/**
 * @param {string} Data
 */
export default async function uploadToGCSFrombase64(data) {


  let re = /data:(image\/.+?);(.+?),(.+)/
  let fixedData = re.exec(data) // data = ['original string', 'image/png', 'base64', 'base64 data']
  let image = Buffer.from(fixedData[3], fixedData[2])
  let path = `${Date.now()}`
  const file = bucket.file(path);

  const stream = file.createWriteStream({
    metadata: {
      contentType: fixedData[1]
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