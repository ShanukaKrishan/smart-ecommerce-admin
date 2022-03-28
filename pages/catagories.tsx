import { ActionIcon, Button, Center, createStyles, Text } from '@mantine/core';
import { IconPencil, IconPlus } from '@tabler/icons';
import React from 'react';
import DataTable from '../components/DataTable';
import HomeLayout from '../components/HomeLayout';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {}

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */

const Catagories = (props: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const { classes } = useStyles();

  /* ------------------------------ calculators ----------------------------- */

  const category = {
    name: 'Category',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  };

  const elements: typeof category[] = [];

  for (let i = 0; i < 100; i++) {
    elements.push(category);
  }

  const rows = elements.map((element, index) => (
    <tr key={index}>
      <td>{element.name}</td>
      <td>{element.description}</td>
      <td>
        <ActionIcon variant="light" color="blue" radius="xl" size="lg">
          <IconPencil />
        </ActionIcon>
      </td>
    </tr>
  ));

  /* -------------------------------- render -------------------------------- */

  return (
    <div className={classes.body}>
      <DataTable
        title="Catagories"
        actions={<Button leftIcon={<IconPlus />}>New Category</Button>}
        headers={
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th></th>
          </tr>
        }
        rows={rows}
      ></DataTable>
    </div>
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
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

(Catagories as any).Layout = HomeLayout;

export default Catagories;
