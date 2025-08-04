'use server';

import {initializeApp, getApps, cert} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {eTicketSchema, type ETicketData} from '@/lib/schemas';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

if (getApps().length === 0) {
  initializeApp({
    credential: serviceAccount && cert(serviceAccount),
  });
}

const db = getFirestore();

async function getUserId(idToken: string) {
  if (!idToken) {
    throw new Error('User not authenticated');
  }
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    throw new Error('Invalid auth token');
  }
}

export async function saveTicket(ticketData: ETicketData, idToken: string) {
  const parsedData = eTicketSchema.parse(ticketData);
  const userId = await getUserId(idToken);
  
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
