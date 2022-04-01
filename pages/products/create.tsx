import {
  Anchor,
  Box,
  Button,
  Center,
  createStyles,
  Group,
  Loader,
  MediaQuery,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconAlertCircle,
  IconCheck,
  IconCircleMinus,
  IconPhoto,
  IconX,
} from '@tabler/icons';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import HomeLayout from '../../components/HomeLayout';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../helpers/notification';
import Product, { productConverter } from '../../models/product';
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import Category, { categoryConverter } from '../../models/category';
import Link from 'next/link';
import Image from 'next/image';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getExtension } from '../../helpers/string';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface FormValues {
  image: File | null;
  name: string;
  description: string;
  categoryId: string;
  brand: string;
  price: number;
}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const CreateProduct = (): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const [loading, setLoading] = useState(false);

  const [createLoading, setCreateLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  const router = useRouter();

  const { classes } = useStyles();

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      description: '',
      categoryId: '',
      brand: '',
      price: 0,
      image: null,
    },
    validate: {
      name: (value) => null,
      description: (value) => null,
      categoryId: (value) =>
        value == null || value == '' ? 'Please select an item' : null,
      brand: (value) => null,
      price: (value) =>
        value <= 0 ? 'Price should be a positive number' : null,
      image: (value) => (value == null ? 'Please select an image' : null),
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
        const ref = collection(firestore, 'categories').withConverter(
          categoryConverter
        );
        // build query
        const queryRef = query(ref);
        // get snapshot
        const snapshots = await getDocs(ref);
        // create category array
        const categories: Category[] = [];
        // iterate through snap shots
        snapshots.forEach((snapshot) => {
          // get category
          const category = snapshot.data();
          // add category to array
          categories.push(category);
        });
        // save categories
        setCategories(categories);
      } catch (error) {
        // show notification
        showErrorNotification('Error Occurred');
      } finally {
        // stop loading
        setLoading(false);
      }
    })();
  }, []);

  /* ------------------------------- handlers ------------------------------- */

  const handleDiscard = () => {
    router.back();
  };

  const uploadImage = async (
    imageFile: File,
    productId: string
  ): Promise<string> => {
    // get storage
    const storage = getStorage();
    // create reference
    const imageRef = ref(
      storage,
      `products/${productId}.${getExtension(imageFile.name)}`
    );
    // upload image
    await uploadBytes(imageRef, imageFile);
    // return full path
    return imageRef.fullPath;
  };

  const createProduct = async (
    name: string,
    description: string,
    categoryId: string,
    price: number,
    brand: string
  ): Promise<string> => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = collection(firestore, 'products').withConverter(
      productConverter
    );
    // add document to the database
    const resultRef = await addDoc(
      ref,
      new Product('', name, description, categoryId, '', price, brand, '', '')
    );
    // return product id
    return resultRef.id;
  };

  const updateProductImagePath = async (id: string, path: string) => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = doc(firestore, 'products', id).withConverter(productConverter);
    // add document to the database
    const resultRef = await updateDoc(ref, { imagePath: path });
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // start loading
      setCreateLoading(true);
      // create product
      const productId = await createProduct(
        values.name,
        values.description,
        values.categoryId,
        values.price,
        values.brand
      );
      // save image
      const imagePath = await uploadImage(values.image!, productId);
      // update image path in product
      await updateProductImagePath(productId, imagePath);
      // show success notification
      showSuccessNotification('Successfully created product');
      // close page
      router.back();
    } catch (error) {
      console.log(error);
      // show error notification
      showErrorNotification('Error Occurred..');
    } finally {
      // stop loading
      setCreateLoading(false);
    }
  };

  const removeImage = () => {
    form.setFieldValue('image', null);
  };

  /* -------------------------------- helpers ------------------------------- */

  const dropZoneChildren = (status: DropzoneStatus) => (
    <Group position="center" style={{ height: '100%' }}>
      <IconPhoto size={40} color={form.errors.image != null ? 'red' : 'gray'} />
      <Stack spacing={4}>
        {!form.errors.image && (
          <Text size="sm">Drag image here or click to select image</Text>
        )}
        {form.errors.image && (
          <Text size="sm" color="red">
            {form.errors.image}
          </Text>
        )}
        <Text size="xs" color={form.errors.image != null ? 'red' : 'dimmed'}>
          Maximum file size 5mb
        </Text>
      </Stack>
    </Group>
  );

  /* -------------------------------- render -------------------------------- */

  return (
    <Stack className={classes.body} align="stretch">
      <Group px={40} className={classes.titleWrapper} position="apart">
        <Stack spacing={0}>
          <Text size="lg" weight={600}>
            Create Product
          </Text>
          <Text size="xs" color="gray">
            Products will be listed in the main store
          </Text>
        </Stack>
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Group>
            <Button variant="outline" color="dark" onClick={handleDiscard}>
              <IconX />
            </Button>
            <Button
              className={classes.titleButton}
              leftIcon={<IconCheck />}
              form="create-product-form"
              type="submit"
              loading={createLoading}
            >
              Create
            </Button>
          </Group>
        </MediaQuery>
      </Group>
      <Center className={classes.formWrapper}>
        {loading && <Loader />}
        {!loading && (
          <form
            id="create-product-form"
            className={classes.form}
            onSubmit={form.onSubmit(handleSubmit)}
          >
            <Stack align="stretch">
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
                  {dropZoneChildren}
                </Dropzone>
              )}
              {form.values.image != null && (
                <Box className={classes.imageWrapper}>
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={URL.createObjectURL(form.values.image)}
                    alt="Product Image"
                  />
                  <div className={classes.imageOverlay}></div>
                  <Center
                    className={classes.imageOverlayContent}
                    onClick={removeImage}
                  >
                    <Group>
                      <IconCircleMinus color="white" />
                      <Text color="white">Click here to remove the image</Text>
                    </Group>
                  </Center>
                </Box>
              )}
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
              <Select
                label="Category"
                required
                // error="Pick at least one item"
                data={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
                {...form.getInputProps('categoryId')}
              />
              {categories.length === 0 && (
                <Group px={8} py={6} className={classes.alert} spacing={8}>
                  <IconAlertCircle color="red" />
                  <Group spacing={4}>
                    <Text size="xs">
                      It seems there are no categories available yet. Click here
                      to
                    </Text>
                    <Link href="/categories/create" passHref>
                      <Anchor size="xs">Create a category</Anchor>
                    </Link>
                  </Group>
                </Group>
              )}
              <TextInput
                required
                label="Brand"
                {...form.getInputProps('brand')}
              />
              <NumberInput
                required
                label="Price (LKR)"
                {...form.getInputProps('price')}
              />
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Group my={20} grow>
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
                    loading={createLoading}
                  >
                    Create
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

const useStyles = createStyles((theme, _, getRef) => {
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
    alert: {
      backgroundColor: theme.colors.red[1],
      borderRadius: theme.radius.md,
    },
    imageWrapper: {
      position: 'relative',
      width: '100%',
      height: 200,
      border: `1px solid ${theme.colors.gray[4]}`,
      borderRadius: theme.radius.md,
      overflow: 'hidden',
      userSelect: 'none',
      [`&:hover .${getRef('imageOverlay')}`]: {
        opacity: 0.4,
      },
      [`&:hover .${getRef('imageOverlayContent')}`]: {
        opacity: 1,
      },
    },
    imageOverlay: {
      ref: getRef('imageOverlay'),
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: '#000000',
      opacity: 0,
      transition: 'all 0.2s',
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        opacity: 0.4,
      },
    },
    imageOverlayContent: {
      ref: getRef('imageOverlayContent'),
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0,
      transition: 'all 0.2s',
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        opacity: 1,
      },
    },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

(CreateProduct as any).Layout = HomeLayout;

export default CreateProduct;
