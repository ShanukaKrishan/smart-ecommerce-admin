import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { getAdmin } from '../services/admin';

export default class Admin {
  id: string;
  superAdmin: boolean;
  email?: string;
  displayName?: string;

  constructor(
    id: string,
    superAdmin: boolean,
    email?: string,
    displayName?: string
  ) {
    this.id = id;
    this.superAdmin = superAdmin;
    this.email = email;
    this.displayName = displayName;
  }

  async initialize() {
    // get user
    await this.getFirebaseUser();
  }

  async getFirebaseUser() {
    const data = await getAdmin(this.id);
    // save data
    this.displayName = data.displayName;
    this.email = data.email;
  }
}

export const adminConverter = {
  toFirestore: (admin: Admin) => ({
    superAdmin: admin.superAdmin,
  }),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Admin => {
    const data = snapshot.data(options);
    return new Admin(snapshot.id, data.superAdmin);
  },
};
