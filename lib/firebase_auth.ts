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
        projectId: 'ar-watch-store-app',
        clientEmail:
          'firebase-adminsdk-672ha@ar-watch-store-app.iam.gserviceaccount.com',
        privateKey:
          process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/gm, '\n') ?? '',
      },
      databaseURL: 'https://my-example-app.firebaseio.com',
    },
    firebaseClientInitConfig: {
      apiKey: 'AIzaSyAApD3e7P9-MyXRhM37Yp8O7JR7F9yh2mM',
      authDomain: 'ar-watch-store-app.firebaseapp.com',
      projectId: 'ar-watch-store-app',
      storageBucket: 'ar-watch-store-app.appspot.com',
      messagingSenderId: '1092598350127',
      appId: '1:1092598350127:web:47e308d65834f77c5661da',
      measurementId: 'G-R3K4TS90SE',
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
  if (process.env.NODE_ENV == 'development') {
    initObject.firebaseAuthEmulatorHost = 'localhost:9099';
  }
  // init firebase
  init(initObject);
};

export default initAuth;
