import {
  Box,
  Center,
  createStyles,
  Divider,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import React, { ReactNode } from 'react';
import LottieLoader from './LottieLoader';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {
  title: string;
  actions: ReactNode;
  headers: ReactNode;
  rows: ReactNode;
  emptyMessage: ReactNode;
  loading: boolean;
  itemCount: number;
}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const DataTable = ({
  title,
  actions,
  headers,
  rows,
  emptyMessage,
  loading,
  itemCount,
}: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const { classes } = useStyles();

  /* -------------------------------- render -------------------------------- */

  return (
    <Stack className={classes.body} align="stretch" spacing={0}>
      <Group px={40} className={classes.titleWrapper} position="apart">
        <Text size="lg" weight={600}>
          {title}
        </Text>
        {actions}
      </Group>
      <Divider mx={30} />
      {loading && (
        <Center className={classes.tableWrapper}>
          {/* <Loader /> */}
          <LottieLoader />
        </Center>
      )}
      {!loading && itemCount === 0 && emptyMessage}
      {!loading && itemCount > 0 && (
        <Box pt={12} px={20} className={classes.tableWrapper}>
          <ScrollArea px={20} className={classes.scrollArea}>
            <Table width="100%" verticalSpacing="sm" highlightOnHover>
              <thead>{headers}</thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
        </Box>
      )}
    </Stack>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   styles                                   */
/* -------------------------------------------------------------------------- */

const useStyles = createStyles((theme) => {
  return {
    body: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    },
    titleWrapper: {
      height: 70,
      flex: 'none',
    },
    content: {
      width: '100%',
      height: '100%',
      flexGrow: 1,
    },
    tableWrapper: {
      width: '100%',
      height: '100%',
      flexGrow: 1,
      overflow: 'hidden',
    },
    scrollArea: {
      width: '100%',
      height: '100%',
    },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

export default DataTable;
