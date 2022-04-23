import { Center, createStyles, Stack, Text } from '@mantine/core';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import HomeLayout from '../components/HomeLayout';
import Order from '../models/order';

interface Props {}

const Orders: NextPage = (props: Props) => {
  /* --------------------------------- hooks -------------------------------- */

  const [orders, setORders] = useState<Order[]>([]);

  const [ordersFetched, setOrdersFetched] = useState(true);

  const { classes } = useStyles();

  /* ------------------------------ calculators ----------------------------- */

  const rows = orders.map((element, index) => (
    <tr key={index}>
      {/* <td>
        <Avatar
          src={element.imageUrl}
          radius="xl"
          imageProps={{ style: { objectFit: 'cover' } }}
        />
      </td>
      <td style={{ whiteSpace: 'nowrap' }}>{element.name}</td>
      <td style={{ minWidth: '250px' }}>{element.description}</td>
      <td style={{ whiteSpace: 'nowrap' }}>LKR {element.price}</td>
      <td style={{ whiteSpace: 'nowrap' }}>{element.brand}</td>
      <td style={{ whiteSpace: 'nowrap' }}>{element.category}</td>
      <td style={{ whiteSpace: 'nowrap' }}>
        <Checkbox ml={20} checked={element.featured} />
      </td>
      <td>
        <Center>
          <ActionIcon
            variant="light"
            color="accent"
            radius="xl"
            size="lg"
            onClick={() => editProduct(index)}
          >
            <IconPencil />
          </ActionIcon>
        </Center>
      </td>
      <td>
        <Center>
          <ActionIcon
            variant="light"
            color="red"
            radius="xl"
            size="lg"
            onClick={() => openDeleteDialog(index)}
          >
            <IconTrash />
          </ActionIcon>
        </Center>
      </td> */}
    </tr>
  ));

  /* -------------------------------- render -------------------------------- */

  return (
    <div className={classes.body}>
      {/* head */}
      <Head>
        <title>Smart Ecommerce Store Admin - Orders</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* body */}
      <DataTable
        title="Orders"
        loading={!ordersFetched}
        itemCount={orders.length}
        actions={<div></div>}
        headers={
          <tr>
            <th style={{ width: 80 }}></th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Brand</th>
            <th>Category</th>
            <th style={{ width: 120 }}>Featured</th>
            <th style={{ width: 50 }}></th>
            <th style={{ width: 50 }}></th>
          </tr>
        }
        rows={rows}
        emptyMessage={
          <Center style={{ width: '100%', height: '100%' }}>
            <Stack align="center" spacing={4}>
              <Text size="sm">No Orders Exist..</Text>
              <Text size="xs">Wait for your customers to make orders</Text>
            </Stack>
          </Center>
        }
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
}); /* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

(Orders as any).Layout = HomeLayout;

export default Orders;
