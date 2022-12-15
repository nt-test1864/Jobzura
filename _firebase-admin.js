
import * as admin from "firebase-admin"
require("dotenv").config();


const serviceAccount = {
  "projectId": process.env.FIREBASE_ADMIN_PROJECT_ID,
  "privateKey": process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  "clientEmail": process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
}


if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://jobzura-v2-37ad4.firebaseio.com"
  });
}

export default admin