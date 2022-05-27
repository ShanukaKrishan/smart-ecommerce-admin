import { AppShell } from '@mantine/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { AuthAction, useAuthUser, withAuthUser } from 'next-firebase-auth';
import React, { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { adminConverter } from '../models/admin';
import { setUrlPath } from '../redux/reducers/homeReducer';
import { setSuperAdmin, setToken } from '../redux/reducers/identityReducer';
import LoadingOverlay from './LoadingOverlay';
import TheSideBar from './sidebar/TheSideBar';
import TheTopBar from './TheTopBar';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {
  children: ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */

const HomeLayout = ({ children }: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const dispatch = useDispatch();

  const { id, getIdToken } = useAuthUser();

  const firebaseAuth = getAuth();

  useEffect(() => {
    (async () => {
      // get id token
      const idToken = await getIdToken();
      if (idToken != null) dispatch(setToken(idToken));
    })();
    // start refreshing
    const refresher = setInterval(async () => {
      // get id token
      const idToken = await getIdToken(true);
      if (idToken != null) dispatch(setToken(idToken));
    }, 30 * 60 * 1000);
    // remove refresher
    return () => clearInterval(refresher);
  }, [dispatch, getIdToken]);

  useEffect(() => {
    dispatch(setUrlPath(window.location.pathname.replace('/', '')));
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      // check user
      if (user) {
        // get token
        const idToken = await user.getIdToken();
        // update token
        if (idToken != null) dispatch(setToken(idToken));
      }
    });
    return () => unsubscribe();
  }, [firebaseAuth, dispatch]);

  useEffect(() => {
    const syncAdmin = async () => {
      // check id exist
      if (id == null) return;
      // get firestore
      const firestore = getFirestore();
      // create reference with converter
      const ref = doc(firestore, 'admins', id).withConverter(adminConverter);
      // get snapshot
      const snapshot = await getDoc(ref);
      // check snapshot contains data
      if (!snapshot.exists()) {
        return;
      }
      // get admin
      const admin = snapshot.data();
      // save super admin
      dispatch(setSuperAdmin(admin.superAdmin));
    };
    syncAdmin();
  }, [dispatch, id]);

  /* -------------------------------- render -------------------------------- */

  return (
    <AppShell
      padding={0}
      navbar={<TheSideBar />}
      header={<TheTopBar />}
      navbarOffsetBreakpoint="md"
      fixed
    >
      {children}
    </AppShell>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   styles                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingOverlay,
})(HomeLayout as any);
