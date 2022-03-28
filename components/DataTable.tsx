import {
  Box,
  createStyles,
  Divider,
  Group,
  ScrollArea,
  Table,
  Text,
} from '@mantine/core';
import React, { ReactNode } from 'react';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {
  title: string;
  actions: ReactNode;
  headers: ReactNode;
  rows: ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const DataTable = ({ title, actions, headers, rows }: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const { classes } = useStyles();

  /* -------------------------------- render -------------------------------- */

  return (
    <Group
      className={classes.body}
      direction="column"
      align="stretch"
      spacing={0}
      noWrap
    >
      <Group px={40} className={classes.titleWrapper} position="apart">
        <Text size="lg" weight={600}>
          {title}
        </Text>
        {actions}
      </Group>
      <Divider mx={30} />
      <Box pt={12} px={20} className={classes.tableWrapper}>
        <ScrollArea px={20} className={classes.scrollArea}>
          <Table verticalSpacing="sm" highlightOnHover>
            <thead>{headers}</thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Box>
    </Group>
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
