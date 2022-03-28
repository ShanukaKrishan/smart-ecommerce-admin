import { createStyles, Group, Text, ThemeIcon } from '@mantine/core';
import {
  IconBrandAsana,
  IconDashboard,
  IconShoppingCart,
  IconUser,
} from '@tabler/icons';
import React from 'react';
import SideBarItem from './SideBarItem';
import UserButton from './UserButton';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const TheSideBar = (props: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const { classes } = useStyles();

  /* -------------------------------- render -------------------------------- */

  return (
    <Group className={classes.body} direction="column" align="stretch">
      <Group px={20} py={20} className={classes.headerWrapper}>
        <ThemeIcon radius="xl" size="lg">
          <IconShoppingCart size={20} />
        </ThemeIcon>
        <Text size="lg" weight={600}>
          Smart Ecommerce Shop
        </Text>
      </Group>
      <Group
        px={12}
        spacing={0}
        className={classes.navigationWrapper}
        direction="column"
        align="stretch"
      >
        <SideBarItem
          title="Dashboard"
          icon={<IconDashboard size={20} />}
          path=""
        />
        <SideBarItem
          title="Products"
          icon={<IconShoppingCart size={20} />}
          path="products"
        />
        <SideBarItem
          title="Catagories"
          icon={<IconBrandAsana size={20} />}
          path="catagories"
        />
        <SideBarItem title="Users" icon={<IconUser size={20} />} path="users" />
      </Group>
      <UserButton />
    </Group>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   styles                                   */
/* -------------------------------------------------------------------------- */

const useStyles = createStyles((theme) => {
  const border = `1px solid ${theme.colors.gray[4]}`;
  return {
    body: {
      width: '100%',
      height: '100%',
      borderRight: border,
    },
    headerWrapper: {
      width: '100%',
      borderBottom: border,
      userSelect: 'none',
    },
    navigationWrapper: {
      flexGrow: 1,
    },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

export default TheSideBar;
