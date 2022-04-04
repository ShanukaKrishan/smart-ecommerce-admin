import { Group, Stack, Text } from '@mantine/core';
import { DropzoneStatus } from '@mantine/dropzone';
import { IconPhoto } from '@tabler/icons';
import React, { ReactNode } from 'react';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {
  status: DropzoneStatus;
  error?: ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */

const ImageDropzone = ({ status, error }: Props): JSX.Element => {
  return (
    <Group position="center" style={{ height: '100%' }}>
      <IconPhoto size={40} color={error != null ? 'red' : 'gray'} />
      <Stack spacing={4}>
        {!error && (
          <Text size="sm">Drag image here or click to select image</Text>
        )}
        {error && (
          <Text size="sm" color="red">
            {error}
          </Text>
        )}
        <Text size="xs" color={error != null ? 'red' : 'dimmed'}>
          Maximum file size 5mb
        </Text>
      </Stack>
    </Group>
  );
};

export default ImageDropzone;
