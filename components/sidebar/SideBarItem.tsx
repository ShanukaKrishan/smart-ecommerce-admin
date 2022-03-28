import { createStyles, Group, Text, ThemeIcon } from '@mantine/core';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeDrawer } from '../../redux/reducers/homeReducer';
import { RootState } from '../../redux/store';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {
  title: string;
  icon: ReactNode;
  path: string;
  subPaths?: string[];
  children?: ReactNode;
}

interface StyleProps {
  selected: boolean;
  parentItem: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */

const SideBarItem = ({
  title,
  icon,
  path,
  subPaths,
  children,
}: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const urlPath = useSelector((state: RootState) => state.home.urlPath);

  const dispatch = useDispatch();

  const parentItem = children != null;

  const selected = path === urlPath || (subPaths?.includes(urlPath) ?? false);

  const { classes } = useStyles({ selected, parentItem });

  /* ------------------------------- handlers ------------------------------- */

  const handleClick = (): void => {
    dispatch(closeDrawer());
  };

  /* -------------------------------- helpers ------------------------------- */

  const content = (
    <Group px={20} py={8} my={4} className={classes.body} onClick={handleClick}>
      <ThemeIcon radius="xl" size="lg" variant="light">
        {icon}
      </ThemeIcon>
      <Text>{title}</Text>
    </Group>
  );

  /* -------------------------------- render -------------------------------- */

  return !parentItem ? (
    <Link href={`/${path}`} passHref>
      {content}
    </Link>
  ) : (
    content
  );
};

/* -------------------------------------------------------------------------- */
/*                                   styles                                   */
/* -------------------------------------------------------------------------- */

const useStyles = createStyles((theme, { selected }: StyleProps) => {
  return {
    body: {
      width: '100%',
      transition: 'all 0.2s',
      userSelect: 'none',
      borderRadius: theme.radius.sm,
      backgroundColor: selected ? theme.colors.blue[0] : 'transparent',
      '&:hover': {
        backgroundColor: selected ? theme.colors.blue[0] : theme.colors.gray[0],
      },
    },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

export default SideBarItem;
