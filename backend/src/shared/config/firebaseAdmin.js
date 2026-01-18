const admin = require('firebase-admin');

try {
    // Attempt to initialize with service account if available via env or default path
    // If GOOGLE_APPLICATION_CREDENTIALS is set, applicationDefault() picks it up.
    // Otherwise, we can look for a specific file.

    // Check if we have a service account file in a standard location
    // const serviceAccount = require('../../../serviceAccountKey.json'); 

    if (!admin.apps.length) {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
            const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('[Firebase Admin] Initialized with service account from env path');
        } else {
            // Fallback to application default (Good for Cloud Run / GCE)
            // Or if no creds, this might throw or warn.
            admin.initializeApp({
                credential: admin.credential.applicationDefault()
            });
            console.log('[Firebase Admin] Initialized with Application Default Credentials');
        }
    }
} catch (error) {
    console.error('[Firebase Admin] Initialization Failed:', error.message);
    console.error('[Firebase Admin] WEAK SECURITY MODE: Falling back to unverified decoding not recommended.');
    // In production this should crash, but not crashing here to keep server up during setup
}

module.exports = admin;
