import {
  Anchor,
  Box,
  Button,
  Center,
  Checkbox,
  createStyles,
  Divider,
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
  getDoc,
} from 'firebase/firestore';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../helpers/notification';
import Product, { productConverter } from '../../models/product';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import Category, { categoryConverter } from '../../models/category';
import Link from 'next/link';
import { deleteObject, getStorage, ref, uploadBytes } from 'firebase/storage';
import { getExtension } from '../../helpers/string';
import ImageDropzone from '../../components/ImageDropzone';
import ImagePreview from '../../components/ImagePreview';
import FormCategory from '../../components/form/FormCategory';
import FormCategoryLabel from '../../components/form/FormCategoryLabel';
import Brand, { brandConverter } from '../../models/brand';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface FormValues {
  image: File | null;
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

  const [saveLoading, setSaveLoading] = useState(false);

  const [product, setProduct] = useState<Product>();

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
      image: null,
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
    },
  });

  useEffect(() => {
    const getProduct = async () => {
      // get firestore
      const firestore = getFirestore();
      // create reference with converter
      const ref = doc(
        firestore,
        'products',
        router.query.id as string
      ).withConverter(productConverter);
      // get snapshot
      const snapshot = await getDoc(ref);
      // check snapshot contains data
      if (!snapshot.exists()) {
        // show notification
        showErrorNotification('Product not found');
        return;
      }
      // get product
      const product = snapshot.data();
      // save product
      setProduct(product);
      // update form
      form.setValues({
        name: product.name,
        description: product.description,
        brandId: product.brandId,
        categoryId: product.categoryId,
        featured: product.featured,
        price: product.price,
        image: null,
      });
    };

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

    (async function () {
      try {
        // start loading
        setLoading(true);
        // get product
        await getProduct();
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
    const imageRef = ref(storage, product!.imagePath);
    // delete image
    await deleteObject(imageRef);
  };

  const uploadImage = async (imageFile: File): Promise<string> => {
    // get storage
    const storage = getStorage();
    // create reference
    const imageRef = ref(
      storage,
      `products/${product!.id}.${getExtension(imageFile.name)}`
    );
    // upload image
    await uploadBytes(imageRef, imageFile);
    // return full path
    return imageRef.fullPath;
  };

  const updateProduct = async (
    name: string,
    description: string,
    price: number,
    categoryId: string,
    brandId: string,
    featured: boolean
  ) => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = doc(firestore, 'products', product!.id);
    // add document to the database
    await updateDoc(ref, {
      name: name,
      description: description,
      price: price,
      categoryId: categoryId,
      brandId: brandId,
      featured: featured,
    });
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // start loading
      setSaveLoading(true);
      // update product
      await updateProduct(
        values.name,
        values.description,
        values.price,
        values.categoryId,
        values.brandId,
        values.featured
      );
      // update image
      await updateImage(values.image);
      // show success notification
      showSuccessNotification('Successfully updated product');
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
      <Group px={40} className={classes.titleWrapper} position="apart">
        <Stack spacing={0}>
          <Text size="lg" weight={600}>
            Update Product
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
              loading={saveLoading}
            >
              Save
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
            <Stack align="stretch" spacing={0}>
              <FormCategory
                label={
                  <FormCategoryLabel
                    title="Image"
                    description="Product image use to show products in products page"
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
                <Group my={28} grow>
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
                    Save
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
