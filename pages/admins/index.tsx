import {
  ActionIcon,
  Anchor,
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
import Head from 'next/head';
import Admin, { adminConverter } from '../../models/admin';
import { deleteAdmin as deleteAdminSdk } from '../../services/admin';

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */

const Admins = (): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const [admins, setAdmins] = useState<Admin[]>([]);

  const [adminsFetched, setAdminsFetched] = useState(false);

  const [selectedAdmin, setSelectedAdmin] = useState<Admin>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const router = useRouter();

  const { classes } = useStyles();

  useEffect(() => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = collection(firestore, 'admins').withConverter(adminConverter);
    // build query
    const queryRef = query(ref);
    // subscribe to data
    const unsubscribe = onSnapshot(
      queryRef,
      async (snapshot) => {
        // create array to store admins
        const admins: Admin[] = [];
        // iterate through snapshot data
        for (const doc of snapshot.docs) {
          // get admin
          const admin = doc.data();
          // initialize
          await admin.initialize();
          // add admin to array
          admins.push(admin);
        }
        // save admins
        setAdmins(admins);
        // set admins fetched
        setAdminsFetched(true);
      },
      (error) => {
        console.log(error);
        // show notification
        showErrorNotification('Error Occurred..');
        // set admins fetched
        setAdminsFetched(true);
      }
    );
    // unsubscribe on page detached
    return () => unsubscribe();
  }, []);

  /* ------------------------------- handlers ------------------------------- */

  const openDeleteDialog = (index: number) => {
    // set selected admin
    setSelectedAdmin(admins[index]);
    // open dialog
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const deleteAdmin = async () => {
    // close dialog
    setDeleteDialogOpen(false);
    // check selected admin exist
    if (selectedAdmin == null) return;
    // get admin
    const admin = selectedAdmin;
    try {
      // delete admin using admin sdk
      await deleteAdminSdk(admin.id);
      // get firestore
      const firestore = getFirestore();
      // create reference with converter
      const documentRef = doc(firestore, 'admins', admin.id);
      // delete admin
      await deleteDoc(documentRef);
      // show notification
      showSuccessNotification('Successfully deleted admin');
    } catch (error) {
      // show notification
      showErrorNotification('Error Occurred..');
    }
  };

  const editAdmin = (index: number) => {
    // get admin
    const admin = admins[index];
    // set selected admin
    setSelectedAdmin(admin);
    // go to edit screen
    router.push(`/admins/${admin.id}`);
  };

  /* ------------------------------ calculators ----------------------------- */

  const rows = admins.map((element, index) => (
    <tr key={index}>
      <td style={{ whiteSpace: 'nowrap' }}>{element.displayName}</td>
      <td style={{ whiteSpace: 'nowrap' }}>{element.email}</td>
      <td style={{ whiteSpace: 'nowrap' }}>
        <Checkbox ml={20} checked={element.superAdmin} onChange={() => {}} />
      </td>
      <td>
        <Center>
          <ActionIcon
            variant="light"
            color="blue"
            radius="xl"
            size="lg"
            onClick={() => editAdmin(index)}
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
        <title>Smart Ecommerce Store Admin - Admins</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* body */}
      <DataTable
        title="Admins"
        loading={!adminsFetched}
        itemCount={admins.length}
        actions={
          <Link href="/admins/create" passHref>
            <Button leftIcon={<IconPlus />}>New Admin</Button>
          </Link>
        }
        headers={
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th style={{ width: 150 }}>Super Admin</th>
            <th style={{ width: 50 }}></th>
            <th style={{ width: 50 }}></th>
          </tr>
        }
        rows={rows}
        emptyMessage={
          <Center style={{ width: '100%', height: '100%' }}>
            <Stack align="center" spacing={4}>
              <Text size="sm">No Admins Exist..</Text>
              <Group spacing={4}>
                <Text size="xs">(Click here to</Text>
                <Link href="/admins/create" passHref>
                  <Anchor size="xs">Create</Anchor>
                </Link>
                <Text size="xs">a new admin)</Text>
              </Group>
            </Stack>
          </Center>
        }
      ></DataTable>
      <Dialog opened={deleteDialogOpen} style={{ width: 400 }}>
        <Group position="apart">
          <Stack spacing={0}>
            <Text size="sm">Confirm Delete Admin</Text>
            <Text size="xs">({selectedAdmin?.displayName})</Text>
          </Stack>
          <Group>
            <Button variant="outline" color="red" onClick={closeDeleteDialog}>
              <IconX />
            </Button>
            <Button variant="outline" color="green" onClick={deleteAdmin}>
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

(Admins as any).Layout = HomeLayout;

export default Admins;
