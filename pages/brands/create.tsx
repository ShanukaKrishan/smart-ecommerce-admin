import {
  Button,
  Center,
  createStyles,
  Group,
  MediaQuery,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconX } from '@tabler/icons';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import HomeLayout from '../../components/HomeLayout';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../helpers/notification';
import FormCategoryLabel from '../../components/form/FormCategoryLabel';
import FormCategory from '../../components/form/FormCategory';
import Brand, { brandConverter } from '../../models/brand';
import Head from 'next/head';

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const CreateBrand = (): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { classes } = useStyles();

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: (value) => null,
      description: (value) => null,
    },
  });

  /* ------------------------------- handlers ------------------------------- */

  const handleDiscard = () => {
    router.back();
  };

  const createBrand = async (
    name: string,
    description: string
  ): Promise<string> => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = collection(firestore, 'brands').withConverter(brandConverter);
    // add document to the database
    const resultRef = await addDoc(ref, new Brand('', name, description));
    // return product id
    return resultRef.id;
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // start loading
      setLoading(true);
      // create brand
      await createBrand(values.name, values.description);
      // show success notification
      showSuccessNotification('Successfully created brand');
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
        <title>Smart Ecommerce Store Admin - Create Brand</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* body */}
      <Group px={40} className={classes.titleWrapper} position="apart">
        <Stack spacing={0}>
          <Text size="lg" weight={600}>
            Create Brand
          </Text>
          <Text size="xs" color="gray">
            Brands will be used by products for grouping
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
              form="create-brand-form"
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
          id="create-brand-form"
          className={classes.form}
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <Stack spacing={0}>
            <FormCategory
              label={
                <FormCategoryLabel
                  title="Basic"
                  description="Brand basic details"
                />
              }
            >
              <Stack>
                <TextInput
                  required
                  label="Name"
                  {...form.getInputProps('name')}
                />
                <TextInput
                  required
                  label="Description"
                  {...form.getInputProps('description')}
                />
              </Stack>
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

(CreateBrand as any).Layout = HomeLayout;

export default CreateBrand;
