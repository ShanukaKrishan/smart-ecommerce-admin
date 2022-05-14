import { init, InitConfig } from 'next-firebase-auth';

const initAuth = (): void => {
  // create init object
  const initObject: InitConfig = {
    authPageURL: '/login',
    appPageURL: '/',
    loginAPIEndpoint: '/api/login',
    logoutAPIEndpoint: '/api/logout',
    firebaseAdminInitConfig: {
      credential: {
        projectId: 'ar-watch-store-e169b',
        clientEmail:
          'firebase-adminsdk-6vnhn@ar-watch-store-e169b.iam.gserviceaccount.com',
        privateKey:
          process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/gm, '\n') ?? '',
      },
      databaseURL: 'https://my-example-app.firebaseio.com',
    },
    firebaseClientInitConfig: {
      apiKey: 'AIzaSyB5vmWHbV9eYkhi_2pmfvb6gR0hdMxIWN4',
      authDomain: 'ar-watch-store-e169b.firebaseapp.com',
      projectId: 'ar-watch-store-e169b',
      storageBucket: 'ar-watch-store-e169b.appspot.com',
      messagingSenderId: '676758483408',
      appId: '1:676758483408:web:2c79076faa6dee624189d5',
      measurementId: 'G-22C16XYBJX',
    },
    cookies: {
      name: 'Smart Ecommerce',
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      signed: true,
    },
  };
  // check mode
  // if (process.env.NODE_ENV == 'development') {
  //   initObject.firebaseAuthEmulatorHost = 'localhost:9099';
  // }
  // init firebase
  init(initObject);
};

export default initAuth;
