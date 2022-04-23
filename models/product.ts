import {
  doc,
  getDoc,
  getFirestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { brandConverter } from './brand';
import { categoryConverter } from './category';

interface ProductImage {
  path: string;
  url: string;
}

export default class Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  category: string;
  price: number;
  brandId: string;
  brand: string;
  featured: boolean;
  imagePaths: string[];
  images: ProductImage[];

  constructor(
    id: string,
    name: string,
    description: string,
    categoryId: string,
    category: string,
    price: number,
    brandId: string,
    brand: string,
    featured: boolean,
    imagePaths: string[],
    images: ProductImage[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.categoryId = categoryId;
    this.category = category;
    this.price = price;
    this.brandId = brandId;
    this.brand = brand;
    this.featured = featured;
    this.imagePaths = imagePaths;
    this.images = images;
  }

  async initialize() {
    // get category name
    await this.getCategoryName();
    // get brand name
    await this.getBrandName();
    // get image url from path
    await this.getImageUrls();
  }

  async getCategoryName() {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = doc(firestore, 'categories', this.categoryId).withConverter(
      categoryConverter
    );
    // get snapshot
    const snapshot = await getDoc(ref);
    // check snapshot contains data
    if (snapshot.exists()) {
      // save category name
      this.category = snapshot.data().name;
    }
  }

  async getBrandName() {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = doc(firestore, 'brands', this.brandId).withConverter(
      brandConverter
    );
    // get snapshot
    const snapshot = await getDoc(ref);
    // check snapshot contains data
    if (snapshot.exists()) {
      // save category name
      this.brand = snapshot.data().name;
    }
  }

  async getImageUrls() {
    // create images array
    const images: ProductImage[] = [];
    // get storage
    const storage = getStorage();
    // iterate through image paths
    for (const imagePath of this.imagePaths) {
      // create reference
      const imageRef = ref(storage, imagePath);
      // get image url
      const imageUrl = await getDownloadURL(imageRef);
      // create product image
      const productImage: ProductImage = {
        path: imagePath,
        url: imageUrl,
      };
      // add image to array
      images.push(productImage);
    }
    // save image
    this.images = images;
  }
}

export const productConverter = {
  toFirestore: (product: Product) => ({
    name: product.name,
    description: product.description,
    categoryId: product.categoryId,
    price: product.price,
    brandId: product.brandId,
    featured: product.featured,
    imagePaths: product.imagePaths,
  }),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Product => {
    const data = snapshot.data(options);
    return new Product(
      snapshot.id,
      data.name,
      data.description,
      data.categoryId,
      '',
      data.price,
      data.brandId,
      '',
      data.featured,
      data.imagePaths,
      []
    );
  },
};
