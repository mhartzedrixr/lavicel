
'use server';

import {initializeApp, getApps, cert, App} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {eTicketSchema, type ETicketData} from '@/lib/schemas';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

let adminApp: App;

if (getApps().length === 0) {
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
} else {
  adminApp = getApps()[0];
}


const db = getFirestore(adminApp);
const authAdmin = getAuth(adminApp);

async function getUserId(idToken: string) {
  if (!idToken) {
    throw new Error('User not authenticated');
  }
  try {
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error: any) {
     if (error.code === 'auth/id-token-expired') {
      throw new Error('Auth token expired. Please log in again.');
    }
     if (error.code === 'auth/argument-error') {
        throw new Error('Invalid auth token');
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

export async function saveTicket(ticketData: ETicketData, idToken: string) {
  const userId = await getUserId(idToken);
  const parsedData = eTicketSchema.parse({ ...ticketData, userId });
  
  if (parsedData.userId !== userId) {
      throw new Error("User ID mismatch");
  }

  await db.collection('tickets').add(parsedData);
}

export async function getTickets(idToken: string): Promise<(ETicketData & {id: string})[]> {
  const userId = await getUserId(idToken);
  const snapshot = await db.collection('tickets').where('userId', '==', userId).get();
  
  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as ETicketData & {id: string}));
}

export async function deleteTicket(ticketId: string, idToken: string) {
    const userId = await getUserId(idToken);
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
}
