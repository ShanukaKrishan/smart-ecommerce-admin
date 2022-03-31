import { Avatar, createStyles, Group, Menu, Stack, Text } from '@mantine/core';
import { IconChevronRight, IconLogout, IconPencil } from '@tabler/icons';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../helpers/notification';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const UserButton: ForwardRefRenderFunction<HTMLDivElement, Props> = (
  { ...other },
  ref
) => {
  /* --------------------------------- hooks -------------------------------- */

  const { classes } = useStyles();

  const firebaseAuth = getAuth();

  const router = useRouter();

  /* ------------------------------- handlers ------------------------------- */

  const logout = async () => {
    try {
      // close drawer
      // onDrawerClose()
      // sign out from firebase
      await signOut(firebaseAuth);
      // redirect to login scree
      await router.replace('/login');
      // show success toast
      showSuccessNotification('Successfully Logged Out');
    } catch (error) {
      // show error toast
      showErrorNotification('Error Occurred..');
    }
  };

  /* -------------------------------- helpers ------------------------------- */

  // eslint-disable-next-line react/display-name
  const UserButton = forwardRef<HTMLDivElement>(({ ...other }, ref) => (
    <Group ref={ref} py={20} px={20} className={classes.body} noWrap {...other}>
      <Avatar
        radius={9999}
        src={firebaseAuth.currentUser?.photoURL ?? '/avatar.png'}
        style={{ flex: 'none' }}
      />
      <Stack spacing={0} className={classes.detailsWrapper}>
        <Text size="sm" weight={500}>
          {firebaseAuth.currentUser?.displayName}
        </Text>
        <Text className={classes.ellipsisText} size="xs">
          {firebaseAuth.currentUser?.email}
        </Text>
      </Stack>
      <IconChevronRight color="gray" size={16} style={{ flex: 'none' }} />
    </Group>
  ));

  /* -------------------------------- render -------------------------------- */
  return (
    <Menu
      withArrow
      position="right"
      // placement="center"
      control={<UserButton />}
      style={{ width: '100%' }}
    >
      <Menu.Label>Profile</Menu.Label>
      <Menu.Item icon={<IconPencil />}>Edit</Menu.Item>
      <Menu.Item icon={<IconLogout />} onClick={logout}>
        Sign Out
      </Menu.Item>
    </Menu>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   styles                                   */
/* -------------------------------------------------------------------------- */

const useStyles = createStyles((theme) => {
  return {
    body: {
      width: '100%',
      overflow: 'hidden',
      userSelect: 'none',
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: theme.colors.gray[2],
      },
    },
    detailsWrapper: {
      flexGrow: 1,
      overflow: 'hidden',
    },
    ellipsisText: {
      width: '100%',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

export default UserButton;
