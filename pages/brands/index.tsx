import {
  ActionIcon,
  Anchor,
  Avatar,
  Button,
  Center,
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
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import HomeLayout from '../../components/HomeLayout';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../helpers/notification';
import { useRouter } from 'next/router';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { async } from '@firebase/util';
import Brand, { brandConverter } from '../../models/brand';
import Head from 'next/head';

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */

const Brands = (): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const [brands, setBrands] = useState<Brand[]>([]);

  const [brandsFetched, setBrandsFetched] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState<Brand>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const router = useRouter();

  const { classes } = useStyles();

  useEffect(() => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = collection(firestore, 'brands').withConverter(brandConverter);
    // build query
    const queryRef = query(ref);
    // subscribe to data
    const unsubscribe = onSnapshot(
      queryRef,
      async (snapshot) => {
        // create array to store brands
        const brands: Brand[] = [];
        // iterate through snapshot data
        for (const doc of snapshot.docs) {
          // get brand
          const brand = doc.data();
          // add brand to array
          brands.push(brand);
        }
        // save brands
        setBrands(brands);
        // set brands fetched
        setBrandsFetched(true);
      },
      (error) => {
        console.log(error);
        // show notification
        showErrorNotification('Error Occurred..');
        // set brands fetched
        setBrandsFetched(true);
      }
    );
    // unsubscribe on page detached
    return () => unsubscribe();
  }, []);

  /* ------------------------------- handlers ------------------------------- */

  const openDeleteDialog = (index: number) => {
    // set selected brand
    setSelectedBrand(brands[index]);
    // open dialog
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const deleteBrand = async () => {
    // close dialog
    setDeleteDialogOpen(false);
    // check selected brands exist
    if (selectedBrand == null) return;
    // get brands
    const brands = selectedBrand;
    try {
      // get firestore
      const firestore = getFirestore();
      // create reference with converter
      const documentRef = doc(firestore, 'brands', brands.id);
      // delete brand
      await deleteDoc(documentRef);
      // show notification
      showSuccessNotification('Successfully deleted brand');
    } catch (error) {
      // show notification
      showErrorNotification('Error Occurred..');
    }
  };

  const editBrand = (index: number) => {
    // get brand
    const brand = brands[index];
    // set selected brand
    setSelectedBrand(brand);
    // go to edit screen
    router.push(`/brands/${brand.id}`);
  };

  /* ------------------------------ calculators ----------------------------- */

  const rows = brands.map((element, index) => (
    <tr key={index}>
      <td style={{ whiteSpace: 'nowrap' }}>{element.name}</td>
      <td style={{ whiteSpace: 'nowrap' }}>{element.description}</td>
      <td>
        <Center>
          <ActionIcon
            variant="light"
            color="blue"
            radius="xl"
            size="lg"
            onClick={() => editBrand(index)}
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
        <title>Smart Ecommerce Store Admin - Brands</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* body */}
      <DataTable
        title="Brands"
        loading={!brandsFetched}
        itemCount={brands.length}
        actions={
          <Link href="/brands/create" passHref>
            <Button leftIcon={<IconPlus />}>New Brand</Button>
          </Link>
        }
        headers={
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th style={{ width: 50 }}></th>
            <th style={{ width: 50 }}></th>
          </tr>
        }
        rows={rows}
        emptyMessage={
          <Center style={{ width: '100%', height: '100%' }}>
            <Stack align="center" spacing={4}>
              <Text size="sm">No Brands Exist..</Text>
              <Group spacing={4}>
                <Text size="xs">(Click here to</Text>
                <Link href="/brands/create" passHref>
                  <Anchor size="xs">Create</Anchor>
                </Link>
                <Text size="xs">a new brand)</Text>
              </Group>
            </Stack>
          </Center>
        }
      ></DataTable>
      <Dialog opened={deleteDialogOpen} style={{ width: 400 }}>
        <Group position="apart">
          <Stack spacing={0}>
            <Text size="sm">Confirm Delete Brand</Text>
            <Text size="xs">({selectedBrand?.name})</Text>
          </Stack>
          <Group>
            <Button variant="outline" color="red" onClick={closeDeleteDialog}>
              <IconX />
            </Button>
            <Button variant="outline" color="green" onClick={deleteBrand}>
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

(Brands as any).Layout = HomeLayout;

export default Brands;
