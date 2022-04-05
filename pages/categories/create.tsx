import {
  Box,
  Button,
  Center,
  createStyles,
  Divider,
  Grid,
  Group,
  Loader,
  MediaQuery,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconCircleMinus, IconX } from '@tabler/icons';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import HomeLayout from '../../components/HomeLayout';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import Category, { categoryConverter } from '../../models/category';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../helpers/notification';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import Image from 'next/image';
import ImageDropzone from '../../components/ImageDropzone';
import ImagePreview from '../../components/ImagePreview';
import FormCategoryLabel from '../../components/form/FormCategoryLabel';
import FormCategory from '../../components/form/FormCategory';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getExtension } from '../../helpers/string';
import Head from 'next/head';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface FormValues {
  name: string;
  description: string;
  image: File | null;
}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const CreateCategory = (): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { classes } = useStyles();

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      description: '',
      image: null,
    },
    validate: {
      name: (value) => null,
      description: (value) => null,
      image: (value) => (value == null ? 'Please select an image' : null),
    },
  });

  /* ------------------------------- handlers ------------------------------- */

  const handleDiscard = () => {
    router.back();
  };

  const uploadImage = async (
    imageFile: File,
    categoryId: string
  ): Promise<string> => {
    // get storage
    const storage = getStorage();
    // create reference
    const imageRef = ref(
      storage,
      `categories/${categoryId}.${getExtension(imageFile.name)}`
    );
    // upload image
    await uploadBytes(imageRef, imageFile);
    // return full path
    return imageRef.fullPath;
  };

  const createCategory = async (
    name: string,
    description: string
  ): Promise<string> => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = collection(firestore, 'categories').withConverter(
      categoryConverter
    );
    // add document to the database
    const resultRef = await addDoc(
      ref,
      new Category('', name, description, '', '')
    );
    // return product id
    return resultRef.id;
  };

  const updateCategoryImagePath = async (id: string, path: string) => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = doc(firestore, 'categories', id).withConverter(
      categoryConverter
    );
    // add document to the database
    await updateDoc(ref, { imagePath: path });
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // start loading
      setLoading(true);
      // create category
      const categoryId = await createCategory(values.name, values.description);
      // save image
      const imagePath = await uploadImage(values.image!, categoryId);
      // update image path in product
      await updateCategoryImagePath(categoryId, imagePath);
      // show success notification
      showSuccessNotification('Successfully created category');
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

  const removeImage = () => {
    form.setFieldValue('image', null);
  };

  /* -------------------------------- render -------------------------------- */

  return (
    <Stack className={classes.body} align="stretch">
      {/* head */}
      <Head>
        <title>Smart Ecommerce Store Admin - Create Category</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* body */}
      <Group px={40} className={classes.titleWrapper} position="apart">
        <Stack spacing={0}>
          <Text size="lg" weight={600}>
            Create Category
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
              form="create-category-form"
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
          id="create-category-form"
          className={classes.form}
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <Stack spacing={0}>
            <FormCategory
              label={
                <FormCategoryLabel
                  title="Image"
                  description="Category image use to show categories in home page"
                />
              }
            >
              {form.values.image == null && (
                <Dropzone
                  multiple={false}
                  onDrop={(files) => {
                    form.setFieldValue('image', files[0]);
                  }}
                  onReject={(rejections) => {
                    console.log(rejections);
                  }}
                  maxSize={5 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                  style={{
                    height: 200,
                    borderColor: form.errors.image != null ? 'red' : undefined,
                  }}
                >
                  {(status) => (
                    <ImageDropzone status={status} error={form.errors.image} />
                  )}
                </Dropzone>
              )}
              {form.values.image != null && (
                <ImagePreview
                  src={URL.createObjectURL(form.values.image)}
                  onRemoveImage={removeImage}
                />
              )}
            </FormCategory>
            <Divider my={12} mt={20} />
            <FormCategory
              label={
                <FormCategoryLabel
                  title="Basic"
                  description="Category basic details"
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

(CreateCategory as any).Layout = HomeLayout;

export default CreateCategory;
