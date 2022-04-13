import {
  ActionIcon,
  Anchor,
  Avatar,
  Button,
  Center,
  Checkbox,
  createStyles,
  Dialog,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconCheck,
  IconPencil,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons';
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import HomeLayout from '../../components/HomeLayout';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../helpers/notification';
import Product, { productConverter } from '../../models/product';

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const Products: NextPage = () => {
  /* --------------------------------- hooks -------------------------------- */

  const [products, setProducts] = useState<Product[]>([]);

  const [productsFetched, setProductsFetched] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const router = useRouter();

  const { classes } = useStyles();

  useEffect(() => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = collection(firestore, 'products').withConverter(
      productConverter
    );
    // build query
    const queryRef = query(ref);
    // subscribe to data
    const unsubscribe = onSnapshot(
      queryRef,
      async (snapshot) => {
        // create array to store products
        const products: Product[] = [];
        // iterate through snapshot data
        for (const doc of snapshot.docs) {
          // get product
          const product = doc.data();
          // initialize product
          await product.initialize();
          // add product to array
          products.push(product);
        }
        // save products
        setProducts(products);
        // set products fetched
        setProductsFetched(true);
      },
      (error) => {
        console.log(error);
        // show notification
        showErrorNotification('Error Occurred..');
        // set products fetched
        setProductsFetched(true);
      }
    );
    // unsubscribe on page detached
    return () => unsubscribe();
  }, []);

  /* ------------------------------- handlers ------------------------------- */

  const openDeleteDialog = (index: number) => {
    // set selected product
    setSelectedProduct(products[index]);
    // open dialog
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const deleteProduct = async () => {
    // close dialog
    setDeleteDialogOpen(false);
    // check selected product exist
    if (selectedProduct == null) return;
    // get product
    const product = selectedProduct;
    try {
      // get firestore
      const firestore = getFirestore();
      // create reference with converter
      const documentRef = doc(firestore, 'products', product.id);
      // delete product
      await deleteDoc(documentRef);
      // get storage
      const storage = getStorage();
      // create reference
      const imageRef = ref(storage, product.imagePath);
      // delete image
      await deleteObject(imageRef);
      // show notification
      showSuccessNotification('Successfully deleted product');
    } catch (error) {
      // show notification
      showErrorNotification('Error Occurred..');
    }
  };

  const editProduct = (index: number) => {
    // get product
    const product = products[index];
    // set selected product
    setSelectedProduct(product);
    // go to edit screen
    router.push(`/products/${product.id}`);
  };

  /* ------------------------------ calculators ----------------------------- */

  const rows = products.map((element, index) => (
    <tr key={index}>
      <td>
        <Avatar
          src={element.imageUrl}
          radius="xl"
          imageProps={{ style: { objectFit: 'cover' } }}
        />
      </td>
      <td style={{ whiteSpace: 'nowrap' }}>{element.name}</td>
      <td style={{ minWidth: '250px' }}>{element.description}</td>
      <td style={{ whiteSpace: 'nowrap' }}>LKR {element.price}</td>
      <td style={{ whiteSpace: 'nowrap' }}>{element.brand}</td>
      <td style={{ whiteSpace: 'nowrap' }}>{element.category}</td>
      <td style={{ whiteSpace: 'nowrap' }}>
        <Checkbox ml={20} checked={element.featured} />
      </td>
      <td>
        <Center>
          <ActionIcon
            variant="light"
            color="accent"
            radius="xl"
            size="lg"
            onClick={() => editProduct(index)}
          >
            <IconPencil />
          </ActionIcon>
        </Center>
      </td>
      <td>
        <Center>
          <ActionIcon
            variant="light"
            color="red"
            radius="xl"
            size="lg"
            onClick={() => openDeleteDialog(index)}
          >
            <IconTrash />
          </ActionIcon>
        </Center>
      </td>
    </tr>
  ));

  /* -------------------------------- render -------------------------------- */

  return (
    <div className={classes.body}>
      {/* head */}
      <Head>
        <title>Smart Ecommerce Store Admin - Products</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* body */}
      <DataTable
        title="Products"
        loading={!productsFetched}
        itemCount={products.length}
        actions={
          <Link href="/products/create" passHref>
            <Button leftIcon={<IconPlus />}>New Product</Button>
          </Link>
        }
        headers={
          <tr>
            <th style={{ width: 80 }}></th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Brand</th>
            <th>Category</th>
            <th style={{ width: 120 }}>Featured</th>
            <th style={{ width: 50 }}></th>
            <th style={{ width: 50 }}></th>
          </tr>
        }
        rows={rows}
        emptyMessage={
          <Center style={{ width: '100%', height: '100%' }}>
            <Stack align="center" spacing={4}>
              <Text size="sm">No Products Exist..</Text>
              <Group spacing={4}>
                <Text size="xs">(Click here to</Text>
                <Link href="/products/create" passHref>
                  <Anchor size="xs">Create</Anchor>
                </Link>
                <Text size="xs">a new product)</Text>
              </Group>
            </Stack>
          </Center>
        }
      ></DataTable>
      <Dialog opened={deleteDialogOpen} style={{ width: 400 }}>
        <Group position="apart">
          <Stack spacing={0}>
            <Text size="sm">Confirm Delete Product</Text>
            <Text size="xs">({selectedProduct?.name})</Text>
          </Stack>
          <Group>
            <Button variant="outline" color="red" onClick={closeDeleteDialog}>
              <IconX />
            </Button>
            <Button variant="outline" color="green" onClick={deleteProduct}>
              <IconCheck />
            </Button>
          </Group>
        </Group>
      </Dialog>
    </div>
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
      overflow: 'hidden',
    },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

(Products as any).Layout = HomeLayout;

export default Products;
