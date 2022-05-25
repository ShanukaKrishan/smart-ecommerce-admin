import { Center, Loader } from '@mantine/core';
import React from 'react';
import LottieLoader from './LottieLoader';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const LoadingOverlay = (props: Props): JSX.Element => {
  return (
    <Center style={{ width: '100%', height: '100%' }}>
      <LottieLoader />
    </Center>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

export default LoadingOverlay;
