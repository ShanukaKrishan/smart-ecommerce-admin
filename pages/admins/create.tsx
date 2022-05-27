import {
  Button,
  Center,
  Checkbox,
  createStyles,
  Divider,
  Group,
  MediaQuery,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconX } from '@tabler/icons';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import HomeLayout from '../../components/HomeLayout';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../helpers/notification';
import FormCategoryLabel from '../../components/form/FormCategoryLabel';
import FormCategory from '../../components/form/FormCategory';
import Head from 'next/head';
import Admin, { adminConverter } from '../../models/admin';
import { createAdmin } from '../../services/admin';

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const CreateAdmin = (): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { classes } = useStyles();

  const form = useForm({
    initialValues: {
      displayName: '',
      email: '',
      password: '',
      superAdmin: false,
    },
    validate: {
      displayName: (value) => null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length >= 6
          ? null
          : 'Password length should be more than 6 characters',
      superAdmin: (value) => null,
    },
  });

  /* ------------------------------- handlers ------------------------------- */

  const handleDiscard = () => {
    router.back();
  };

  const create = async (
    displayName: string,
    email: string,
    password: string,
    superAdmin: boolean
  ): Promise<void> => {
    const id = await createAdmin(email, password, displayName);
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = doc(firestore, 'admins', id).withConverter(adminConverter);
    // add document to the database
    await setDoc(ref, new Admin('', superAdmin, email, displayName));
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // start loading
      setLoading(true);
      // create brand
      await create(
        values.displayName,
        values.email,
        values.password,
        values.superAdmin
      );
      // show success notification
      showSuccessNotification('Successfully created admin');
      // close page
      router.back();
    } catch (error) {
      console.log(error);
      // show error notification
      showErrorNotification('Error Occurred..');
    } finally {
      // stop loading
      setLoading(false);
    }
  };

  /* -------------------------------- render -------------------------------- */

  return (
    <Stack className={classes.body} align="stretch">
      {/* head */}
      <Head>
        <title>Smart Ecommerce Store Admin - Create Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* body */}
      <Group px={40} className={classes.titleWrapper} position="apart">
        <Stack spacing={0}>
          <Text size="lg" weight={600}>
            Create Admin
          </Text>
          <Text size="xs" color="gray">
            Admins are the users who can access this admin panel
          </Text>
        </Stack>
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Group>
            <Button variant="outline" color="gray" onClick={handleDiscard}>
              <IconX />
            </Button>
            <Button
              className={classes.titleButton}
              leftIcon={<IconCheck />}
              form="create-admin-form"
              type="submit"
              loading={loading}
            >
              Create
            </Button>
          </Group>
        </MediaQuery>
      </Group>
      <Center className={classes.formWrapper}>
        <form
          id="create-admin-form"
          className={classes.form}
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <Stack spacing={0}>
            <FormCategory
              label={
                <FormCategoryLabel
                  title="Basic"
                  description="Admin basic details"
                />
              }
            >
              <Stack>
                <TextInput
                  required
                  label="Display Name"
                  {...form.getInputProps('displayName')}
                />
                <TextInput
                  required
                  label="Email"
                  {...form.getInputProps('email')}
                />
              </Stack>
            </FormCategory>
            <Divider my={16} mt={24} />
            <FormCategory
              label={
                <FormCategoryLabel
                  title="Authentication"
                  description="Details used to authenticate the user"
                />
              }
            >
              <Stack>
                <PasswordInput
                  required
                  label="Password"
                  {...form.getInputProps('password')}
                />
              </Stack>
            </FormCategory>
            <Divider my={16} mt={24} />
            <FormCategory
              label={
                <FormCategoryLabel
                  title="Special"
                  description="Special admin details"
                />
              }
            >
              <Checkbox
                mt={12}
                label="Mark as a super admin"
                {...form.getInputProps('superAdmin', { type: 'checkbox' })}
              />
            </FormCategory>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Group mt={20} grow>
                <Button
                  variant="outline"
                  leftIcon={<IconX />}
                  onClick={handleDiscard}
                >
                  Discard
                </Button>
                <Button
                  leftIcon={<IconCheck />}
                  type="submit"
                  loading={loading}
                >
                  Create
                </Button>
              </Group>
            </MediaQuery>
          </Stack>
        </form>
      </Center>
    </Stack>
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
    },
    titleWrapper: {
      height: 100,
      flex: 'none',
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        // height: 80,
      },
    },
    titleButton: {
      width: 130,
    },
    formWrapper: {
      width: '100%',
      height: '100%',
      padding: 0,
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        padding: '0 40px',
      },
    },
    form: {
      width: '60%',
      height: '100%',
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        width: '100%',
      },
    },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

(CreateAdmin as any).Layout = HomeLayout;

export default CreateAdmin;
