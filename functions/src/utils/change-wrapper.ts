import { Change } from 'firebase-functions/v2';
import { firestore } from 'firebase-admin';
import { ModelBase } from './model-base';
import { objectChangedKeys } from './object-diff';
import DocumentSnapshot = firestore.DocumentSnapshot;

export class ChangeWrapper<T extends ModelBase> {

  document: T;
  oldDocument: T;

  private constructor(change: Change<DocumentSnapshot<T>>) {
    this.document = change.after.exists ? {
      ...change.after.data(),
      id: change.after.id,
    } as T : null;
    this.oldDocument = change.before.exists ? {
      ...change.before.data(),
      id: change.before.id,
    } as T : null;
  }

  public get documentId() {
    return this.isDelete() ? this.oldDocument.id : this.document.id;
  }

  public static from<T>(change: Change<DocumentSnapshot<T>>): ChangeWrapper<T> {
    return new ChangeWrapper<T>(change);
  }

  public getChangedKeys(): (keyof T)[] {
    return objectChangedKeys(this.oldDocument || {}, this.document || {});
  }

  public isCreate(): boolean {
    return !this.oldDocument;
  }

  public isDelete(): boolean {
    return !this.document;
  }

  public isUpdate(): boolean {
    return !this.isCreate() && !this.isDelete();
  }

}
