import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

export default class Brand {
  id: string;
  name: string;
  description: string;

  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

export const brandConverter = {
  toFirestore: (brand: Brand) => ({
    name: brand.name,
    description: brand.description,
  }),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Brand => {
    const data = snapshot.data(options);
    return new Brand(snapshot.id, data.name, data.description);
  },
};
