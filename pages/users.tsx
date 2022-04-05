import { Center, Text } from '@mantine/core';
import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import HomeLayout from '../components/HomeLayout';

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */

const Users: NextPage = () => {
  return (
    <Center style={{ width: '100%', height: '100%' }}>
      {/* head */}
      <Head>
        <title>Smart Ecommerce Store Admin - Users</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* body */}
      <Text>Nothing here yet..</Text>
    </Center>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

(Users as any).Layout = HomeLayout;

export default Users;
