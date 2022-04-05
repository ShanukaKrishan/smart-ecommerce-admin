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
import ImagePreview from '../../components/ImagePreview';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import ImageDropzone from '../../components/ImageDropzone';
import { deleteObject, getStorage, ref, uploadBytes } from 'firebase/storage';
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

const EditCategory = (): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const [loading, setLoading] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);

  const [category, setCategory] = useState<Category>();

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
          'categories',
          router.query.id as string
        ).withConverter(categoryConverter);
        // get snapshot
        const snapshot = await getDoc(ref);
        // check snapshot contains data
        if (!snapshot.exists()) {
          // show notification
          showErrorNotification('Category not found');
          return;
        }
        // get category
        const category = snapshot.data();
        // save category
        setCategory(category);
        // update form
        form.setValues({
          name: category.name,
          description: category.description,
          image: null,
        });
      } catch (error) {
        console.log(error);
        // show notification
        showErrorNotification('Fetching category failed');
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

  const updateImage = async (image: File | null) => {
    // check image set
    if (image == null) return;
    // delete current image
    await deleteCurrentImage();
    // upload new image
    await uploadImage(image);
  };

  const deleteCurrentImage = async () => {
    // get storage
    const storage = getStorage();
    // create reference
    const imageRef = ref(storage, category!.imagePath);
    // delete image
    await deleteObject(imageRef);
  };

  const uploadImage = async (imageFile: File): Promise<string> => {
    // get storage
    const storage = getStorage();
    // create reference
    const imageRef = ref(
      storage,
      `categories/${category!.id}.${getExtension(imageFile.name)}`
    );
    // upload image
    await uploadBytes(imageRef, imageFile);
    // return full path
    return imageRef.fullPath;
  };

  const updateCategory = async (name: string, description: string) => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = doc(firestore, 'categories', category!.id);
    // add document to the database
    await updateDoc(ref, {
      name: name,
      description: description,
    });
  };

  const handleSubmit = async (values: typeof form.values) => {
    // check category exist
    if (category == null) return;
    try {
      // start loading
      setSaveLoading(true);
      // update category
      await updateCategory(values.name, values.description);
      // update image
      await updateImage(values.image);
      // show success notification
      showSuccessNotification('Successfully updated category');
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

  const removeImage = () => {
    form.setFieldValue('image', null);
  };

  /* -------------------------------- render -------------------------------- */

  return (
    <Stack className={classes.body} align="stretch">
      {/* head */}
      <Head>
        <title>Smart Ecommerce Store Admin - Edit Category</title>
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
        {loading && <Loader />}
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
                      borderColor:
                        form.errors.image != null ? 'red' : undefined,
                    }}
                  >
                    {(status) => (
                      <ImageDropzone
                        status={status}
                        error={form.errors.image}
                      />
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

(EditCategory as any).Layout = HomeLayout;

export default EditCategory;
