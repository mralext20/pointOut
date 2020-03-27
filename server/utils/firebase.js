import admin from 'firebase-admin';

var serviceAccount = {
  "type": "service_account",
  "project_id": process.env.FIREBASE_PROJECTID,
  "private_key_id": process.env.FIREBASE_PRIVATEKEYID,
  "private_key": Buffer.from(process.env.FIREBASE_PRIVATEKEY, 'base64').toString(),
  "client_email": process.env.FIREBASE_CLIENTEMAIL,
  "client_id": process.env.FIREBASE_CLIENTID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASEURL,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET
});



let bucket = admin.storage().bucket()
export default bucket;