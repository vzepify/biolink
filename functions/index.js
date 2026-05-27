const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Log analytics event
exports.logEvent = functions.https.onCall(async (data, context) => {
  const { profileId, eventType, linkIndex } = data;
  if (!profileId || !eventType) throw new functions.https.HttpsError('invalid-argument', 'Missing fields');

  const ip = context.rawRequest.ip;
  const userAgent = context.rawRequest.headers['user-agent'];

  await db.collection('analytics').add({
    profileId,
    eventType,
    linkIndex: linkIndex || null,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    ip,
    userAgent
  });

  // Increment counters
  const profileRef = db.collection('profiles').doc(profileId);
  if (eventType === 'view') {
    await profileRef.update({ viewCount: admin.firestore.FieldValue.increment(1) });
  } else if (eventType === 'click') {
    await profileRef.update({ clickCount: admin.firestore.FieldValue.increment(1) });
  }
  return { success: true };
});

// Get analytics for own profile
exports.getAnalytics = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');
  const { profileId } = data;
  if (profileId !== context.auth.uid) throw new functions.https.HttpsError('permission-denied', 'Not your profile');

  const profileDoc = await db.collection('profiles').doc(profileId).get();
  if (!profileDoc.exists) return { views: 0, clicks: 0 };
  const doc = profileDoc.data();
  return {
    views: doc.viewCount || 0,
    clicks: doc.clickCount || 0
  };
});

// Admin: list all users (callable, checks admin claim)
exports.adminListUsers = functions.https.onCall(async (data, context) => {
  if (!context.auth.token.admin) throw new functions.https.HttpsError('permission-denied', 'Admins only');
  const snapshot = await db.collection('profiles').get();
  return snapshot.docs.map(doc => ({
    uid: doc.id,
    email: doc.data().email,
    username: doc.data().username,
    verified: doc.data().verified || false
  }));
});

// Admin: verify a user
exports.adminVerifyUser = functions.https.onCall(async (data, context) => {
  if (!context.auth.token.admin) throw new functions.https.HttpsError('permission-denied', 'Admins only');
  const { userId } = data;
  await db.collection('profiles').doc(userId).update({
    verified: true,
    verificationRequested: false
  });
  return { success: true };
});

// Admin: unverify a user
exports.adminUnverifyUser = functions.https.onCall(async (data, context) => {
  if (!context.auth.token.admin) throw new functions.https.HttpsError('permission-denied', 'Admins only');
  const { userId } = data;
  await db.collection('profiles').doc(userId).update({ verified: false });
  return { success: true };
});
