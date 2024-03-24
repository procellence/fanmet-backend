import { firestore } from 'firebase-admin';
import { logger } from 'firebase-functions/v2';
import Firestore = firestore.Firestore;
import WriteBatch = firestore.WriteBatch;

export class BulkWriter {
  private MAX_FIRESTORE_BATCH_SIZE = 500;

  private operations: ((batch: WriteBatch) => void)[] = [];

  constructor(private firestore: Firestore) {}

  public operation(op: (batch: WriteBatch) => void): this {
    this.operations.push(op);
    return this;
  }

  public async commit(): Promise<void> {
    let i = 1;
    const chunks = makeChunks(this.operations, this.MAX_FIRESTORE_BATCH_SIZE);
    for (const chunk of chunks) {
      logger.debug(`BulkWriter: Start Chunk ${i} from ${chunks.length}, chunk length ${chunk.length}`);
      const batch = this.firestore.batch();
      chunk.forEach((operation) => operation(batch));

      await batch.commit();

      logger.debug(`BulkWriter: Finish Chunk ${i} from ${chunks.length}`);
      i++;
    }
  }
}

function makeChunks<T>(array: T[], size: number): T[][] {
  const out: T[][] = [];
  let index = 0;
  while (index < array.length) {
    out.push(array.slice(index, size + index));
    index += size;
  }
  return out;
}
