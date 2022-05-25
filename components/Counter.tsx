import { Text } from '@mantine/core';
import { animate } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface Props {
  count: number;
}

const Counter = ({ count }: Props): JSX.Element => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const controls = animate(current, count, {
      duration: 1,
      onUpdate(value) {
        setCurrent(value);
      },
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return <Text weight={500}>{current.toFixed(0)}</Text>;
};

export default Counter;
