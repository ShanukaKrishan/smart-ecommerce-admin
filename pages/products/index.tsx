import { ActionIcon, Avatar, Button, createStyles } from '@mantine/core';
import { IconPencil, IconPlus } from '@tabler/icons';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import DataTable from '../../components/DataTable';
import HomeLayout from '../../components/HomeLayout';

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const Products: NextPage = () => {
  /* --------------------------------- hooks -------------------------------- */

  const { classes } = useStyles();

  /* ------------------------------ calculators ----------------------------- */

  const product = {
    name: 'Product',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    price: 1500,
    brand: 'Brand',
    category: 'Category',
  };

  const elements: typeof product[] = [];

  for (let i = 0; i < 100; i++) {
    elements.push(product);
  }

  const rows = elements.map((element, index) => (
    <tr key={index}>
      <td>
        <Avatar src="/bag.webp" radius="xl" />
      </td>
      <td>{element.name}</td>
      <td>{element.description}</td>
      <td>{element.price}</td>
      <td>{element.brand}</td>
      <td>{element.category}</td>
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
        title="Products"
        loading={false}
        itemCount={elements.length}
        actions={
          <Link href="/products/create" passHref>
            <Button leftIcon={<IconPlus />}>New Product</Button>
          </Link>
        }
        headers={
          <tr>
            <th></th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Brand</th>
            <th>Category</th>
            <th></th>
          </tr>
        }
        rows={rows}
        emptyMessage=""
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

(Products as any).Layout = HomeLayout;

export default Products;
