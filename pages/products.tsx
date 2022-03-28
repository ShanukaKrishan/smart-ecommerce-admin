import { Center, Text } from '@mantine/core';
import { NextPage } from 'next';
import React from 'react';
import HomeLayout from '../components/HomeLayout';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const Products: NextPage = (props: Props) => {
  return (
    <Center style={{ width: '100%', height: '100%' }}>
      <Text>Nothing here yet..</Text>
    </Center>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

(Products as any).Layout = HomeLayout;

export default Products;
