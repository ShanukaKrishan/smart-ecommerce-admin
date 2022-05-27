import {
  Anchor,
  Button,
  Center,
  createStyles,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconBrandFacebook, IconBrandGoogle, IconMail } from '@tabler/icons';
import { NextPage } from 'next';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { FirebaseError } from '@firebase/util';
import { useRouter } from 'next/router';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../helpers/notification';
import Head from 'next/head';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { adminConverter } from '../models/admin';
import { setSuperAdmin } from '../redux/reducers/identityReducer';
import { useDispatch } from 'react-redux';

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const Login: NextPage = () => {
  /* --------------------------------- hooks -------------------------------- */

  const [emailLoginLoading, setEmailLoginLoading] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();

  const theme = useMantineTheme();

  const { classes } = useStyles();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) =>
        val.length >= 6
          ? null
          : 'Password length should be more than 6 characters',
    },
  });

  /* -------------------------------- helpers ------------------------------- */

  const checkAdmin = async (id: string) => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = doc(firestore, 'admins', id).withConverter(adminConverter);
    // get snapshot
    const snapshot = await getDoc(ref);
    // check snapshot contains data
    if (!snapshot.exists()) {
      throw 'unregistered admin';
    }
    // get admin
    const admin = snapshot.data();
    // save super admin
    dispatch(setSuperAdmin(admin.superAdmin));
  };

  /* -------------------------------- handler ------------------------------- */

  const handleGoogleLoginClick = async (): Promise<void> => {
    // create google provider
    const auth = getAuth();
    try {
      const provider = new GoogleAuthProvider();
      // login dialog
      const result = await signInWithPopup(auth, provider);
      // check user
      if (result.user == null) return;
      // check user is an admin
      await checkAdmin(result.user.uid);
      // show success toast
      showSuccessNotification('Successfully Logged In');
      // navigate to home
      await router.replace('/');
    } catch (error) {
      if ((error as FirebaseError).code == 'auth/popup-closed-by-user') {
        return;
      } else if (error === 'unregistered admin') {
        // logout user
        await signOut(auth);
        // show error toast
        return showErrorNotification('Access Denied');
      }
      // show error toast
      showErrorNotification('Logged In Failed');
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    // start loading
    setEmailLoginLoading(true);
    // create authentication provider
    const auth = getAuth();
    try {
      // login with email and password
      const credentials = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      // check user
      if (credentials.user == null) return;
      // check user is an admin
      await checkAdmin(credentials.user.uid);
      // show success toast
      showSuccessNotification('Successfully Logged In');
      // navigate to home
      await router.replace('/');
    } catch (error) {
      if ((error as FirebaseError).code == 'auth/wrong-password') {
        return showErrorNotification('Invalid email or password');
      } else if (error === 'unregistered admin') {
        // logout user
        await signOut(auth);
        // show error toast
        return showErrorNotification('Access Denied');
      }
      // show error toast
      showErrorNotification('Logged In Failed');
    } finally {
      // stop loading
      setEmailLoginLoading(false);
    }
  };

  /* -------------------------------- render -------------------------------- */

  return (
    <Center className={classes.body}>
      {/* head */}
      <Head>
        <title>Smart Ecommerce Store Admin - Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* body */}
      <Stack spacing={24} align="stretch" className={classes.content}>
        <Stack spacing={4} align="center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Text className={classes.welcomeText} weight={900}>
              Welcome Back!
            </Text>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Group spacing={8}>
              <Text size="sm" color={theme.colors.gray[6]}>
                Do not have an account yet?
              </Text>
              <Anchor size="sm">Create account</Anchor>
            </Group>
          </motion.div>
        </Stack>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Paper p="xl">
            <Stack align="stretch">
              <Stack align="stretch" spacing={8}>
                <Text size="sm">Sign in with</Text>
                <Group grow>
                  <Button
                    variant="outline"
                    leftIcon={<IconBrandGoogle />}
                    onClick={handleGoogleLoginClick}
                  >
                    Google
                  </Button>
                  <Button variant="outline" leftIcon={<IconBrandFacebook />}>
                    Facebook
                  </Button>
                </Group>
              </Stack>
              <Divider label="or continue with email" labelPosition="center" />
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack spacing={8} align="stretch">
                  <TextInput
                    required
                    label="Email"
                    {...form.getInputProps('email')}
                  />
                  <PasswordInput
                    required
                    label="Password"
                    {...form.getInputProps('password')}
                  />
                  <Button
                    mt={12}
                    loading={emailLoginLoading}
                    type="submit"
                    leftIcon={<IconMail />}
                  >
                    Login With Email
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Paper>
        </motion.div>
      </Stack>
    </Center>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   styles                                   */
/* -------------------------------------------------------------------------- */

const useStyles = createStyles((theme) => {
  return {
    body: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.gray[2],
    },
    content: {
      width: 400,
    },
    welcomeText: {
      fontSize: 28,
    },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

export default Login;
