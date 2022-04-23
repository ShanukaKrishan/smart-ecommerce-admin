import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export default class Order {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  async initialize() {}
}

export const productConverter = {
  toFirestore: (product: Order) => ({}),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Order => {
    const data = snapshot.data(options);
    return new Order(snapshot.id);
  },
};
