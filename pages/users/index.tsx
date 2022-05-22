import { ActionIcon, Avatar, Center, Stack, Text } from '@mantine/core';
import { IconPencil } from '@tabler/icons';
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import HomeLayout from '../../components/HomeLayout';
import { showErrorNotification } from '../../helpers/notification';
import User, { userConverter } from '../../models/user';

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */

const Users: NextPage = () => {
  /* --------------------------------- hooks -------------------------------- */

  const [users, setUsers] = useState<User[]>([]);

  const [usersFetched, setUsersFetched] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = collection(firestore, 'users').withConverter(userConverter);
    // create query
    const queryRef = query(ref);
    // subscribe to data
    const unsubscribe = onSnapshot(
      queryRef,
      async (snapshot) => {
        // create array to store users
        const users: User[] = [];
        // iterate through snapshot data
        for (const doc of snapshot.docs) {
          // get user
          const user = doc.data();
          // initialize user
          await user.initialize();
          // add user to array
          users.push(user);
        }
        // save users
        setUsers(users);
        // set users fetched
        setUsersFetched(true);
      },
      (error) => {
        console.log(error);
        // show notification
        showErrorNotification('Error Occurred..');
        // set users fetched
        setUsersFetched(true);
      }
    );
    // unsubscribe on page detached
    return () => unsubscribe();
  }, []);

  /* ------------------------------- handlers ------------------------------- */

  const viewUser = (index: number) => {
    // get user
    const user = users[index];
    // go to view screen
    router.push(`/users/${user.id}`);
  };

  /* -------------------------------- helpers ------------------------------- */

  const rows = users.map((element, index) => (
    <tr key={index}>
      <td>
        <Avatar
          src={element.imageUrl}
          radius="xl"
          imageProps={{ style: { objectFit: 'cover' } }}
        />
      </td>
      <td style={{ whiteSpace: 'nowrap' }}>{element.userName}</td>
      <td style={{ whiteSpace: 'nowrap' }}>{element.name}</td>
      <td style={{ whiteSpace: 'nowrap' }}>{element.email}</td>
      <td style={{ whiteSpace: 'nowrap' }}>{element.phoneNumber}</td>
      <td>
        <Center>
          <ActionIcon
            variant="light"
            color="accent"
            radius="xl"
            size="lg"
            onClick={() => viewUser(index)}
          >
            <IconPencil />
          </ActionIcon>
        </Center>
      </td>
    </tr>
  ));

  /* -------------------------------- render -------------------------------- */

  return (
    <Center style={{ width: '100%', height: '100%' }}>
      {/* head */}
      <Head>
        <title>Smart Ecommerce Store Admin - Users</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* body */}
      <DataTable
        title="Users"
        loading={!usersFetched}
        itemCount={users.length}
        actions=""
        headers={
          <tr>
            <th style={{ width: 80 }}></th>
            <th>User Name</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th style={{ width: 50 }}></th>
          </tr>
        }
        rows={rows}
        emptyMessage={
          <Center style={{ width: '100%', height: '100%' }}>
            <Stack align="center" spacing={4}>
              <Text size="sm">No Users Exist..</Text>
              <Text size="xs">Wait for your customers to sign up</Text>
            </Stack>
          </Center>
        }
      ></DataTable>
    </Center>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

(Users as any).Layout = HomeLayout;

export default Users;
