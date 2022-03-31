import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';

export const showSuccessNotification = (message: string) => {
  showNotification({ message, icon: <IconCheck />, color: 'teal' });
};

export const showErrorNotification = (message: string) => {
  showNotification({ message, icon: <IconX />, color: 'red' });
};
