import {
  createStyles,
  Divider,
  Group,
  MediaQuery,
  Navbar,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconBrandAsana,
  IconBrandBootstrap,
  IconDashboard,
  IconMessages,
  IconShoppingCart,
  IconUser,
} from '@tabler/icons';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
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

  const drawerOpened = useSelector(
    (state: RootState) => state.home.drawerOpened
  );

  const { classes } = useStyles();

  /* -------------------------------- render -------------------------------- */

  return (
    <Navbar
      width={{ base: 350 }}
      hiddenBreakpoint="md"
      hidden={!drawerOpened}
      fixed
    >
      <Navbar.Section>
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Group px={20} className={classes.headerWrapper} noWrap>
            <ThemeIcon radius="xl" size="lg">
              <IconShoppingCart size={20} />
            </ThemeIcon>
            <Text size="lg" weight={600}>
              Smart Ecommerce Shop
            </Text>
          </Group>
        </MediaQuery>
      </Navbar.Section>
      <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
        <Divider />
      </MediaQuery>
      <Navbar.Section component={ScrollArea} grow>
        <Stack
          px={12}
          py={20}
          spacing={0}
          className={classes.navigationWrapper}
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
            subPaths={['products/create']}
          />
          <SideBarItem
            title="Categories"
            icon={<IconBrandAsana size={20} />}
            path="categories"
            subPaths={['categories/create']}
          />
          <SideBarItem
            title="Brands"
            icon={<IconBrandBootstrap size={20} />}
            path="brands"
            subPaths={['brands/create']}
          />
          <SideBarItem
            title="Users"
            icon={<IconUser size={20} />}
            path="users"
          />
          <SideBarItem
            title="Chat"
            icon={<IconMessages size={20} />}
            path="chat"
          />
        </Stack>
      </Navbar.Section>
      <Divider />
      <Navbar.Section>
        <UserButton />
      </Navbar.Section>
    </Navbar>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   styles                                   */
/* -------------------------------------------------------------------------- */

const useStyles = createStyles((theme) => {
  return {
    headerWrapper: {
      width: '100%',
      height: 70,
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
