import {
  Anchor,
  Box,
  Button,
  Center,
  Checkbox,
  createStyles,
  Divider,
  Group,
  MediaQuery,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconCheck, IconX } from '@tabler/icons';
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
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import Category, { categoryConverter } from '../../models/category';
import Link from 'next/link';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getExtension } from '../../helpers/string';
import ImageDropzone from '../../components/ImageDropzone';
import ImagePreview from '../../components/ImagePreview';
import FormCategory from '../../components/form/FormCategory';
import FormCategoryLabel from '../../components/form/FormCategoryLabel';
import Brand, { brandConverter } from '../../models/brand';
import Head from 'next/head';
import { v4 as uuid } from 'uuid';
import LottieLoader from '../../components/LottieLoader';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface FormValues {
  images: File[];
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  price: number;
  featured: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const CreateProduct = (): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const [loading, setLoading] = useState(false);

  const [createLoading, setCreateLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  const [brands, setBrands] = useState<Brand[]>([]);

  const router = useRouter();

  const { classes } = useStyles();

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      description: '',
      categoryId: '',
      brandId: '',
      price: 0,
      images: [],
      featured: false,
    },
    validate: {
      name: (value) => null,
      description: (value) => null,
      categoryId: (value) =>
        value == null || value == '' ? 'Please select an item' : null,
      brandId: (value) =>
        value == null || value == '' ? 'Please select an item' : null,
      price: (value) =>
        value <= 0 ? 'Price should be a positive number' : null,
      images: (value) =>
        value.length === 0 ? 'Please select at least one image' : null,
    },
  });

  useEffect(() => {
    (async function () {
      try {
        // start loading
        setLoading(true);
        // get categories
        await getCategories();
        // get brands
        await getBrands();
      } catch (error) {
        // show notification
        showErrorNotification('Error Occurred');
      } finally {
        // stop loading
        setLoading(false);
      }
    })();
  }, []);

  const getCategories = async () => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = collection(firestore, 'categories').withConverter(
      categoryConverter
    );
    // build query
    const queryRef = query(ref);
    // get snapshot
    const snapshots = await getDocs(queryRef);
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
  };

  const getBrands = async () => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = collection(firestore, 'brands').withConverter(brandConverter);
    // build query
    const queryRef = query(ref);
    // get snapshot
    const snapshots = await getDocs(queryRef);
    // create brand array
    const brands: Brand[] = [];
    // iterate through snap shots
    snapshots.forEach((snapshot) => {
      // get brand
      const brand = snapshot.data();
      // add brand to array
      brands.push(brand);
    });
    // save brands
    setBrands(brands);
  };

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
      `products/${productId}-${uuid()}.${getExtension(imageFile.name)}}`
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
    brandId: string,
    featured: boolean
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
      new Product(
        '',
        name,
        description,
        categoryId,
        '',
        price,
        brandId,
        '',
        featured,
        [],
        []
      )
    );
    // return product id
    return resultRef.id;
  };

  const updateProductImagePaths = async (id: string, paths: string[]) => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = doc(firestore, 'products', id).withConverter(productConverter);
    // add document to the database
    await updateDoc(ref, { imagePaths: paths });
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
        values.brandId,
        values.featured
      );
      // create image path array
      const imagePaths: string[] = [];
      // save images
      for (const image of values.images) {
        const imagePath = await uploadImage(image, productId);
        // add image path to array
        imagePaths.push(imagePath);
      }
      // update image path in product
      await updateProductImagePaths(productId, imagePaths);
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

  const removeImage = (index: number) => {
    // get current images array
    const images = form.values.images;
    // remove image using index
    images.splice(index, 1);
    // set images
    form.setFieldValue('images', images);
  };

  /* -------------------------------- helpers ------------------------------- */

  const images = form.values.images.map((image, index) => (
    <ImagePreview
      key={index}
      src={URL.createObjectURL(image)}
      onRemoveImage={() => removeImage(index)}
    />
  ));

  /* -------------------------------- render -------------------------------- */

  return (
    <Stack className={classes.body} align="stretch">
      {/* head */}
      <Head>
        <title>Smart Ecommerce Store Admin - Create Product</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* body */}
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
            <Button variant="outline" color="gray" onClick={handleDiscard}>
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
        {loading && <LottieLoader />}
        {!loading && (
          <form
            id="create-product-form"
            className={classes.form}
            onSubmit={form.onSubmit(handleSubmit)}
          >
            <Stack pb={28} align="stretch" spacing={0}>
              <FormCategory
                label={
                  <FormCategoryLabel
                    title="Images"
                    description="Product image use to show products in products page"
                  />
                }
              >
                {images}
                <Dropzone
                  onDrop={(files) => {
                    form.setFieldValue('images', [
                      ...form.values.images,
                      ...files,
                    ]);
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
              </FormCategory>
              <Divider my={16} mt={24} />
              <FormCategory
                label={
                  <FormCategoryLabel
                    title="Basic"
                    description="Product basic details"
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
                  <NumberInput
                    required
                    label="Price (LKR)"
                    {...form.getInputProps('price')}
                  />
                </Stack>
              </FormCategory>
              <Divider my={16} mt={24} />
              <FormCategory
                label={
                  <FormCategoryLabel
                    title="References"
                    description="Pick product category and brand"
                  />
                }
              >
                <Stack>
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
                          It seems there are no categories available yet. Click
                          here to
                        </Text>
                        <Link href="/categories/create" passHref>
                          <Anchor size="xs">Create a category</Anchor>
                        </Link>
                      </Group>
                    </Group>
                  )}
                  <Select
                    label="Brand"
                    required
                    // error="Pick at least one item"
                    data={brands.map((brand) => ({
                      value: brand.id,
                      label: brand.name,
                    }))}
                    {...form.getInputProps('brandId')}
                  />
                  {brands.length === 0 && (
                    <Group px={8} py={6} className={classes.alert} spacing={8}>
                      <IconAlertCircle color="red" />
                      <Group spacing={4}>
                        <Text size="xs">
                          It seems there are no brands available yet. Click here
                          to
                        </Text>
                        <Link href="/brands/create" passHref>
                          <Anchor size="xs">Create a brand</Anchor>
                        </Link>
                      </Group>
                    </Group>
                  )}
                </Stack>
              </FormCategory>
              <Divider my={16} mt={24} />
              <FormCategory
                label={
                  <FormCategoryLabel
                    title="Additional"
                    description="Set product additional details"
                  />
                }
              >
                <Checkbox
                  mt={12}
                  label="Set as a featured product"
                  {...form.getInputProps('featured', { type: 'checkbox' })}
                />
              </FormCategory>
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Group mt={28} grow>
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
      width: '60%',
      height: '100%',
      marginBottom: 40,
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        width: '100%',
      },
    },
    alert: {
      backgroundColor: theme.colors.red[1],
      borderRadius: theme.radius.md,
    },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

(CreateProduct as any).Layout = HomeLayout;

export default CreateProduct;
