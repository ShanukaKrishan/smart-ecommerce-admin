import '../styles/globals.css';
import type { AppProps } from 'next/app';
import initAuth from '../lib/firebase_auth';
import { NextComponentType, NextPageContext } from 'next';
import { Provider } from 'react-redux';
import MantineTheme from '../components/MantineTheme';
import store from '../redux/store';
import { useEffect, useState } from 'react';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { QueryClient, QueryClientProvider } from 'react-query';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

type AppPropsExtended = AppProps & {
  Component: NextComponentType<NextPageContext, any, unknown> & {
    Layout: any;
  };
};

const Noop = ({ children }: any): any => children;

/* -------------------------------------------------------------------------- */
/*                                initializers                                */
/* -------------------------------------------------------------------------- */

initAuth();

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */

function MyApp({ Component, pageProps }: AppPropsExtended) {
  /* --------------------------------- hooks -------------------------------- */

  // useEffect(() => {
  //   // check stage
  //   if (process.env.NODE_ENV != 'development') return;
  //   // initialize firestore emulator
  //   const db = getFirestore();
  //   connectFirestoreEmulator(db, 'localhost', 8081);
  //   // initialize storage emulator
  //   const storage = getStorage();
  //   connectStorageEmulator(storage, 'localhost', 9199);
  // }, []);

  /* ------------------------------ calculators ----------------------------- */

  // react query client
  const [queryClient] = useState(() => new QueryClient());

  const Layout = Component.Layout ?? Noop;

  /* -------------------------------- render -------------------------------- */

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <MantineTheme>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MantineTheme>
      </Provider>
    </QueryClientProvider>
  );
}

export default MyApp;
