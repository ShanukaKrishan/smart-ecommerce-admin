import {
  doc,
  getDoc,
  getFirestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import User, { userConverter } from './user';

interface OrderProduct {
  id: string;
  quantity: number;
}

export enum DeliveryStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Canceled = 'Canceled',
}

export type DeliveryStatusKey = keyof typeof DeliveryStatus;

export default class Order {
  id: string;
  orderId: string;
  status: DeliveryStatus;
  date: string;
  total: number;
  userId: string;
  userEmail: string;
  primaryAddress: string;
  secondaryAddress: string;
  country: string;
  phoneNumber: string;
  zipCode: string;
  products: OrderProduct[];
  user?: User;

  constructor(
    id: string,
    orderId: string,
    status: DeliveryStatus,
    date: string,
    total: number,
    userId: string,
    userEmail: string,
    primaryAddress: string,
    secondaryAddress: string,
    country: string,
    phoneNumber: string,
    zipCode: string,
    products: OrderProduct[]
  ) {
    this.id = id;
    this.orderId = orderId;
    this.status = status;
    this.date = date;
    this.total = total;
    this.userId = userId;
    this.userEmail = userEmail;
    this.primaryAddress = primaryAddress;
    this.secondaryAddress = secondaryAddress;
    this.country = country;
    this.phoneNumber = phoneNumber;
    this.zipCode = zipCode;
    this.products = products;
    this.products = products;
  }

  async initialize() {
    // get user
    await this.getUser();
  }

  async getUser() {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = doc(firestore, 'users', this.userId).withConverter(
      userConverter
    );
    // get snapshot
    const snapshot = await getDoc(ref);
    // check snapshot contains data
    if (snapshot.exists()) {
      // save category name
      this.user = snapshot.data();
    }
  }
}

export const orderConverter = {
  toFirestore: (order: Order) => ({
    orderId: order.orderId,
    orderStatus: order.status,
    orderDate: order.date,
    totalPaid: order.total,
    userId: order.userId,
    customerEmail: order.userEmail,
    addressOne: order.primaryAddress,
    addressTwo: order.secondaryAddress,
    country: order.country,
    phone: order.phoneNumber,
    zipCode: order.zipCode,
  }),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Order => {
    const data = snapshot.data(options);
    // create products
    const products: OrderProduct[] = [];
    // iterate through products
    for (const product of data.products) {
      // create order product
      const orderProduct: OrderProduct = {
        id: product.productId,
        quantity: product.quantity,
      };
      // add to array
      products.push(orderProduct);
    }
    return new Order(
      snapshot.id,
      data.orderId,
      DeliveryStatus[data.orderStatus as DeliveryStatusKey],
      data.orderDate,
      data.totalPaid,
      data.userId,
      data.customerEmail,
      data.addressOne,
      data.addressTwo,
      data.country,
      data.phone,
      data.zipCode,
      products
    );
  },
};
