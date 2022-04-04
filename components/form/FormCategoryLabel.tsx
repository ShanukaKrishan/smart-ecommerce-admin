import { Stack, Text } from '@mantine/core';
import React from 'react';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {
  title: string;
  description: string;
}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const FormCategoryLabel = ({ title, description }: Props): JSX.Element => {
  return (
    <Stack spacing={0}>
      <Text weight={500} color="gray">
        {title}
      </Text>
      <Text size="xs" color="dimmed">
        {description}
      </Text>
    </Stack>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

export default FormCategoryLabel;
