import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export default class User {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  online: boolean;
  imageUrl: string;

  constructor(
    id: string,
    userName: string,
    email: string,
    phoneNumber: string,
    online: boolean,
    imageUrl: string
  ) {
    this.id = id;
    this.userName = userName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.online = online;
    this.imageUrl = imageUrl;
  }

  async initialize() {}
}

export const userConverter = {
  toFirestore: (user: User) => ({
    username: user.userName,
    email: user.email,
    phone: user.phoneNumber,
    userStatus: user.online,
    userImageUrl: user.imageUrl,
  }),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User => {
    const data = snapshot.data(options);
    return new User(
      snapshot.id,
      data.username,
      data.email,
      data.phone,
      data.userStatus,
      data.userImageUrl
    );
  },
};
