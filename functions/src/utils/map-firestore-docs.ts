import { firestore } from 'firebase-admin';
import QuerySnapshot = firestore.QuerySnapshot;
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
import DocumentSnapshot = firestore.DocumentSnapshot;

export async function mapFirestoreDocs<T>(snapshotPromise: Promise<QuerySnapshot<T>>, setId = true): Promise<T[]> {
  return (await snapshotPromise).docs.map((doc) => {
    return mapFirestoreDoc<T>(doc, setId);
  });
}

export function mapFirestoreDoc<T>(doc: QueryDocumentSnapshot<T> | DocumentSnapshot<T>, setId = true): T {
  if (!doc?.exists) {
    return null;
  }

  return setId ? {
    ...doc.data(),
    id: doc.id,
  } : doc.data();
}
