import { Button, Group, PasswordInput, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconX } from '@tabler/icons';
import React from 'react';
import { useMutation } from 'react-query';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../helpers/notification';
import { updateAdminPassword } from '../../services/admin';

interface Props {
  id: string;
  onClose: () => void;
}

const PasswordChangeModal = ({ id, onClose }: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const form = useForm({
    initialValues: {
      password: '',
    },
    validate: {
      password: (value) =>
        value.length >= 6
          ? null
          : 'Password length should be more than 6 characters',
    },
  });

  const { mutate: update, isLoading } = useMutation(updateAdminPassword, {
    onSuccess: () => {
      // show success toast
      showSuccessNotification('Successfully Updated Password');
    },
    onError: () => {
      // show error toast
      showErrorNotification('Error Occurred..');
    },
    onSettled: () => {
      // close dialog
      onClose();
    },
  });

  /* ------------------------------- handlers ------------------------------- */

  const handleSubmit = async (values: typeof form.values) => {
    // check loading
    if (isLoading) return;
    // get values
    const password = values.password;
    // create specialty
    update({ id, password });
  };

  const handleClose = (): void => {
    if (!isLoading) onClose();
  };

  /* -------------------------------- render -------------------------------- */

  return (
    <Stack>
      <Text weight={500} color="gray">
        Change Admin Password
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <PasswordInput
            required
            {...form.getInputProps('password')}
            label="Password"
          />
          <Group>
            <Button loading={isLoading} type="submit" leftIcon={<IconCheck />}>
              Update
            </Button>
            <Button variant="outline" leftIcon={<IconX />} onClick={onClose}>
              Close
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};

export default PasswordChangeModal;
