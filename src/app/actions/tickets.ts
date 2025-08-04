
'use server';

import {initializeApp, getApps, cert, App} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {eTicketSchema, type ETicketData} from '@/lib/schemas';
import { getAuth } from 'firebase-admin/auth';

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

let adminApp: App;

if (getApps().length === 0) {
  if (!serviceAccountString) {
    console.error('FIREBASE_SERVICE_ACCOUNT environment variable is not set. Service account initialization failed.');
  } else {
    try {
      const serviceAccount = JSON.parse(serviceAccountString);
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (e: any) {
       console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT or initialize app:', e.message);
    }
  }
} else {
  adminApp = getApps()[0];
}

const db = getFirestore(adminApp);
const authAdmin = getAuth(adminApp);

export async function getUserIdFromToken(idToken: string) {
  if (!idToken) {
    throw new Error('Auth token not provided');
  }
  try {
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error: any) {
     if (error.code === 'auth/id-token-expired') {
      throw new Error('Auth token expired. Please log in again.');
    }
    console.error("Error verifying token: ", error);
    throw new Error('Invalid auth token');
  }
}

export async function createUser(uid: string, email: string | null) {
  await db.collection('users').doc(uid).set({
    uid,
    email,
    createdAt: new Date(),
  });
}

export async function saveTicket(ticketData: ETicketData, userId: string) {
  // The userId from the token is the source of truth.
  const parsedData = eTicketSchema.parse({ ...ticketData, userId });
  
  await db.collection('tickets').add(parsedData);
  return { success: true };
}

export async function getTickets(userId: string): Promise<(ETicketData & {id: string})[]> {
  const snapshot = await db.collection('tickets').where('userId', '==', userId).get();
  
  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as ETicketData & {id: string}));
}

export async function deleteTicket(ticketId: string, userId: string) {
    const ticketRef = db.collection('tickets').doc(ticketId);
    const doc = await ticketRef.get();

    if (!doc.exists) {
        throw new Error("Ticket not found");
    }

    const ticketData = doc.data();
    if (ticketData?.userId !== userId) {
        throw new Error("Permission denied. You can only delete your own tickets.");
    }

    await ticketRef.delete();
    return { success: true };
}
