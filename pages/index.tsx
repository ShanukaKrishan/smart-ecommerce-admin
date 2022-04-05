import { Center, Text } from '@mantine/core';
import type { NextPage } from 'next';
import Head from 'next/head';
import HomeLayout from '../components/HomeLayout';

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const Home: NextPage = () => {
  return (
    <Center style={{ width: '100%', height: '100%' }}>
      {/* head */}
      <Head>
        <title>Smart Ecommerce Store Admin - Dashboard</title>
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

(Home as any).Layout = HomeLayout;

export default Home;
