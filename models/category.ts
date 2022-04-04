import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

export default class Category {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  imageUrl: string;

  constructor(
    id: string,
    name: string,
    description: string,
    imagePath: string,
    imageUrl: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.imageUrl = imageUrl;
  }

  async initialize() {
    // get image url from path
    await this.getImageUrl();
  }

  async getImageUrl() {
    // get storage
    const storage = getStorage();
    // create reference
    const imageRef = ref(storage, this.imagePath);
    // get image url
    const imageUrl = await getDownloadURL(imageRef);
    // save url
    this.imageUrl = imageUrl;
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
    return new Category(
      snapshot.id,
      data.name,
      data.description,
      data.imagePath,
      ''
    );
  },
};
