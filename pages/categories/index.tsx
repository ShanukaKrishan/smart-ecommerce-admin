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
import Category, { categoryConverter } from '../../models/category';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../helpers/notification';
import { useRouter } from 'next/router';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { async } from '@firebase/util';
import Head from 'next/head';

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */

const Catagories = (): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const [categories, setCategories] = useState<Category[]>([]);

  const [categoriesFetched, setCategoriesFetched] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const router = useRouter();

  const { classes } = useStyles();

  useEffect(() => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = collection(firestore, 'categories').withConverter(
      categoryConverter
    );
    // build query
    const queryRef = query(ref);
    // subscribe to data
    const unsubscribe = onSnapshot(
      queryRef,
      async (snapshot) => {
        // create array to store categories
        const categories: Category[] = [];
        // iterate through snapshot data
        for (const doc of snapshot.docs) {
          // get category
          const category = doc.data();
          // initialize category
          await category.initialize();
          // add category to array
          categories.push(category);
        }
        // save categories
        setCategories(categories);
        // set categories fetched
        setCategoriesFetched(true);
      },
      (error) => {
        console.log(error);
        // show notification
        showErrorNotification('Error Occurred..');
        // set categories fetched
        setCategoriesFetched(true);
      }
    );
    // unsubscribe on page detached
    return () => unsubscribe();
  }, []);

  /* ------------------------------- handlers ------------------------------- */

  const openDeleteDialog = (index: number) => {
    // set selected category
    setSelectedCategory(categories[index]);
    // open dialog
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const deleteCategory = async () => {
    // close dialog
    setDeleteDialogOpen(false);
    // check selected category exist
    if (selectedCategory == null) return;
    // get category
    const category = selectedCategory;
    try {
      // get firestore
      const firestore = getFirestore();
      // create reference with converter
      const documentRef = doc(firestore, 'categories', category.id);
      // delete category
      await deleteDoc(documentRef);
      // get storage
      const storage = getStorage();
      // create reference
      const imageRef = ref(storage, category.imagePath);
      // delete image
      await deleteObject(imageRef);
      // show notification
      showSuccessNotification('Successfully deleted category');
    } catch (error) {
      // show notification
      showErrorNotification('Error Occurred..');
    }
  };

  const editCategory = (index: number) => {
    // get category
    const category = categories[index];
    // set selected category
    setSelectedCategory(category);
    // go to edit screen
    router.push(`/categories/${category.id}`);
  };

  /* ------------------------------ calculators ----------------------------- */

  const rows = categories.map((element, index) => (
    <tr key={index}>
      <td>
        <Center>
          <Avatar
            src={element.imageUrl}
            radius="xl"
            imageProps={{ style: { objectFit: 'cover' } }}
          />
        </Center>
      </td>
      <td style={{ whiteSpace: 'nowrap' }}>{element.name}</td>
      <td style={{ whiteSpace: 'nowrap' }}>{element.description}</td>
      <td>
        <Center>
          <ActionIcon
            variant="light"
            color="blue"
            radius="xl"
            size="lg"
            onClick={() => editCategory(index)}
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
        <title>Smart Ecommerce Store Admin - Categories</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* body */}
      <DataTable
        title="Categories"
        loading={!categoriesFetched}
        itemCount={categories.length}
        actions={
          <Link href="/categories/create" passHref>
            <Button leftIcon={<IconPlus />}>New Category</Button>
          </Link>
        }
        headers={
          <tr>
            <th style={{ width: 80 }}></th>
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
              <Text size="sm">No Categories Exist..</Text>
              <Group spacing={4}>
                <Text size="xs">(Click here to</Text>
                <Link href="/categories/create" passHref>
                  <Anchor size="xs">Create</Anchor>
                </Link>
                <Text size="xs">a new category)</Text>
              </Group>
            </Stack>
          </Center>
        }
      ></DataTable>
      <Dialog opened={deleteDialogOpen} style={{ width: 400 }}>
        <Group position="apart">
          <Stack spacing={0}>
            <Text size="sm">Confirm Delete Category</Text>
            <Text size="xs">({selectedCategory?.name})</Text>
          </Stack>
          <Group>
            <Button variant="outline" color="red" onClick={closeDeleteDialog}>
              <IconX />
            </Button>
            <Button variant="outline" color="green" onClick={deleteCategory}>
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

(Catagories as any).Layout = HomeLayout;

export default Catagories;
