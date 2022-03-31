import {
  Burger,
  createStyles,
  Group,
  Header,
  Text,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconShoppingCart } from '@tabler/icons';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDrawer } from '../redux/reducers/homeReducer';
import { RootState } from '../redux/store';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {}

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */

const TheTopBar = (props: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const dispatch = useDispatch();

  const drawerOpened = useSelector(
    (state: RootState) => state.home.drawerOpened
  );

  const theme = useMantineTheme();

  const largeScreen = useMediaQuery(`(min-width: ${theme.breakpoints.md}px)`);

  const { classes } = useStyles();

  /* ------------------------------- handlers ------------------------------- */

  const handleDrawerToggle = () => {
    dispatch(toggleDrawer());
  };

  /* -------------------------------- render -------------------------------- */

  return (
    <Header height={largeScreen ? 0 : 50} fixed>
      <Group px={20} className={classes.body}>
        <Burger opened={drawerOpened} onClick={handleDrawerToggle} />
        <Text size="md" weight={600}>
          Smart Ecommerce Shop
        </Text>
      </Group>
    </Header>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   styles                                   */
/* -------------------------------------------------------------------------- */

const useStyles = createStyles((theme) => {
  return {
    body: { height: '100%' },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

export default TheTopBar;
