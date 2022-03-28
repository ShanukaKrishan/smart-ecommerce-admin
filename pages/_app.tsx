import '../styles/globals.css';
import type { AppProps } from 'next/app';
import initAuth from '../lib/firebase_auth';
import { NextComponentType, NextPageContext } from 'next';
import { Provider } from 'react-redux';
import MantineTheme from '../components/MantineTheme';
import store from '../redux/store';

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
  /* ------------------------------ calculators ----------------------------- */

  const Layout = Component.Layout ?? Noop;

  /* -------------------------------- render -------------------------------- */

  return (
    <Provider store={store}>
      <MantineTheme>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineTheme>
    </Provider>
  );
}

export default MyApp;
