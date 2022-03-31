import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export default class Category {
  id: string;
  name: string;
  description: string;

  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

export const categoryConverter = {
  toFirestore: (category: Category) => ({
    name: category.name,
    description: category.description,
  }),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Category => {
    const data = snapshot.data(options);
    return new Category(snapshot.id, data.name, data.description);
  },
};
