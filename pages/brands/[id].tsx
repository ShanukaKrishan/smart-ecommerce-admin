import {
  Button,
  Center,
  createStyles,
  Divider,
  Group,
  Loader,
  MediaQuery,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconX } from '@tabler/icons';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import HomeLayout from '../../components/HomeLayout';
import { getFirestore, getDoc, doc, updateDoc } from 'firebase/firestore';
import Category, { categoryConverter } from '../../models/category';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../helpers/notification';
import FormCategory from '../../components/form/FormCategory';
import FormCategoryLabel from '../../components/form/FormCategoryLabel';
import Head from 'next/head';
import LottieLoader from '../../components/LottieLoader';

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const EditBrand = (): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const [loading, setLoading] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);

  const [brand, setBrand] = useState<Category>();

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

  useEffect(() => {
    (async function () {
      try {
        // start loading
        setLoading(true);
        // get firestore
        const firestore = getFirestore();
        // create reference with converter
        const ref = doc(
          firestore,
          'brands',
          router.query.id as string
        ).withConverter(categoryConverter);
        // get snapshot
        const snapshot = await getDoc(ref);
        // check snapshot contains data
        if (!snapshot.exists()) {
          // show notification
          showErrorNotification('Brand not found');
          return;
        }
        // get brand
        const brand = snapshot.data();
        // save category
        setBrand(brand);
        // update form
        form.setValues({
          name: brand.name,
          description: brand.description,
        });
      } catch (error) {
        console.log(error);
        // show notification
        showErrorNotification('Fetching brand failed');
      } finally {
        // stop loading
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id]);

  /* ------------------------------- handlers ------------------------------- */

  const handleDiscard = () => {
    router.back();
  };

  const updateBrand = async (name: string, description: string) => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = doc(firestore, 'brands', brand!.id);
    // add document to the database
    await updateDoc(ref, {
      name: name,
      description: description,
    });
  };

  const handleSubmit = async (values: typeof form.values) => {
    // check brand exist
    if (brand == null) return;
    try {
      // start loading
      setSaveLoading(true);
      // update brand
      await updateBrand(values.name, values.description);
      // show success notification
      showSuccessNotification('Successfully updated brand');
      // close page
      router.back();
    } catch (error) {
      console.log(error);
      // show error notification
      showErrorNotification('Error Occurred..');
    } finally {
      // stop loading
      setSaveLoading(false);
    }
  };

  /* -------------------------------- render -------------------------------- */

  return (
    <Stack className={classes.body} align="stretch">
      {/* head */}
      <Head>
        <title>Smart Ecommerce Store Admin - Edit Brand</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* body */}
      <Group px={40} className={classes.titleWrapper} position="apart">
        <Stack spacing={0}>
          <Text size="lg" weight={600}>
            Update Category
          </Text>
          <Text size="xs" color="gray">
            Categories will be used by products for grouping
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
              form="update-category-form"
              type="submit"
              loading={saveLoading}
            >
              Update
            </Button>
          </Group>
        </MediaQuery>
      </Group>
      <Center className={classes.formWrapper}>
        {loading && <LottieLoader />}
        {!loading && (
          <form
            id="update-category-form"
            className={classes.form}
            onSubmit={form.onSubmit(handleSubmit)}
          >
            <Stack spacing={0}>
              <FormCategory
                label={
                  <FormCategoryLabel
                    title="Basic"
                    description="Category basic details "
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
                    loading={saveLoading}
                  >
                    Update
                  </Button>
                </Group>
              </MediaQuery>
            </Stack>
          </form>
        )}
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
      width: '50%',
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

(EditBrand as any).Layout = HomeLayout;

export default EditBrand;
