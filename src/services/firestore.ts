
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';

export interface HistoryItem {
  id: string;
  fileName: string;
  summary: string;
  createdAt: Date;
  documentText: string;
}

export async function addHistory(fileName: string, summary: string, documentText: string): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'history'), {
      fileName,
      summary,
      documentText,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document to Firestore: ", error);
    throw new Error("Could not save history to database.");
  }
}

export async function getHistory(): Promise<HistoryItem[]> {
    try {
        const q = query(collection(db, 'history'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const history: HistoryItem[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            history.push({
                id: doc.id,
                fileName: data.fileName,
                summary: data.summary,
                documentText: data.documentText,
                createdAt: data.createdAt.toDate(),
            });
        });
        return history;
    } catch (error) {
        console.error("Error fetching history from Firestore: ", error);
        throw new Error("Could not fetch history from the database.");
    }
}
