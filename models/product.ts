import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export default class Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  brand: string;

  constructor(
    id: string,
    name: string,
    description: string,
    categoryId: string,
    price: number,
    brand: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.categoryId = categoryId;
    this.price = price;
    this.brand = brand;
  }
}

export const productConverter = {
  toFirestore: (product: Product) => ({
    name: product.name,
    description: product.description,
    categoryId: product.categoryId,
    price: product.price,
    brand: product.brand,
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
      data.price,
      data.brand
    );
  },
};
