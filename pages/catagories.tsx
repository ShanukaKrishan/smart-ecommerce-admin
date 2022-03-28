import { Center, Text } from '@mantine/core';
import React from 'react';
import HomeLayout from '../components/HomeLayout';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {}

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */

const Catagories = (props: Props): JSX.Element => {
  return (
    <Center style={{ width: '100%', height: '100%' }}>
      <Text>Nothing here yet..</Text>
    </Center>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

(Catagories as any).Layout = HomeLayout;

export default Catagories;
