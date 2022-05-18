import {
  ActionIcon,
  Button,
  Center,
  Collapse,
  ColorSwatch,
  createStyles,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconPencil, IconSearch } from '@tabler/icons';
import {
  collection,
  getFirestore,
  onSnapshot,
  Query,
  query,
  where,
} from 'firebase/firestore';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import HomeLayout from '../../components/HomeLayout';
import { showErrorNotification } from '../../helpers/notification';
import Order, { DeliveryStatus, orderConverter } from '../../models/order';

interface Props {}

const Orders: NextPage = (props: Props) => {
  /* --------------------------------- hooks -------------------------------- */

  const [orders, setOrders] = useState<Order[]>([]);

  const [searchedOrders, setSearchedOrders] = useState<Order[]>([]);

  const [ordersFetched, setOrdersFetched] = useState(false);

  const [searchedOrdersFetched, setSearchedOrdersFetched] = useState(true);

  const [deliveryStatus, setDeliveryStatus] = useState<string | null>('');

  const [searchVisible, setSearchVisible] = useState(false);

  const [searchBoxVisible, setSearchBoxVisible] = useState(false);

  const [searchText, setSearchText] = useState('');

  const [debouncedSearchText] = useDebouncedValue(searchText, 500);

  const { classes } = useStyles();

  const router = useRouter();

  useEffect(() => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = collection(firestore, 'orders').withConverter(orderConverter);
    // build query
    let queryRef: Query<Order>;
    // create query based on filter
    if (deliveryStatus === '' || deliveryStatus == null) {
      queryRef = query(ref);
    } else {
      queryRef = query(ref, where('orderStatus', '==', deliveryStatus));
    }
    // subscribe to data
    const unsubscribe = onSnapshot(
      queryRef,
      async (snapshot) => {
        // create array to store orders
        const orders: Order[] = [];
        // iterate through snapshot data
        for (const doc of snapshot.docs) {
          // get order
          const order = doc.data();
          // initialize order
          await order.initialize();
          // add order to array
          orders.push(order);
        }
        // save orders
        setOrders(orders);
        // set orders fetched
        setOrdersFetched(true);
      },
      (error) => {
        console.log(error);
        // show notification
        showErrorNotification('Error Occurred..');
        // set orders fetched
        setOrdersFetched(true);
      }
    );
    // unsubscribe on page detached
    return () => unsubscribe();
  }, [deliveryStatus]);

  useEffect(() => {
    // check search text available
    if (debouncedSearchText === '' || debouncedSearchText.length < 3) return;
    // start loading
    setSearchedOrdersFetched(false);
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = collection(firestore, 'orders').withConverter(orderConverter);
    // build query
    const queryRef = query(ref, where('orderId', '==', debouncedSearchText));
    // subscribe to data
    const unsubscribe = onSnapshot(
      queryRef,
      async (snapshot) => {
        // create array to store orders
        const orders: Order[] = [];
        // iterate through snapshot data
        for (const doc of snapshot.docs) {
          // get order
          const order = doc.data();
          // initialize order
          await order.initialize();
          // add order to array
          orders.push(order);
        }
        // save orders
        setSearchedOrders(orders);
        // stop loading
        setSearchedOrdersFetched(true);
      },
      (error) => {
        console.log(error);
        // show notification
        showErrorNotification('Error occurred while searching..');
        // stop loading
        setSearchedOrdersFetched(true);
      }
    );
    // unsubscribe on page detached
    return () => unsubscribe();
  }, [debouncedSearchText]);

  /* ------------------------------ calculators ----------------------------- */

  const searched = debouncedSearchText.length > 2 && searchVisible;

  const visibleOrders = searched ? searchedOrders : orders;

  const rows = visibleOrders.map((element, index) => (
    <tr key={index}>
      <td style={{ whiteSpace: 'nowrap' }}>{element.orderId}</td>
      <td style={{ whiteSpace: 'nowrap' }}>
        Total {element.products.length} Items
      </td>
      <td style={{ whiteSpace: 'nowrap' }}>LKR {element.total}</td>
      <td style={{ whiteSpace: 'nowrap' }}>
        <Group align="center" spacing={12}>
          <ColorSwatch
            mb={2}
            size={10}
            color={deliveryStepColor(element.status)}
          />
          <Text size="sm">{element.status}</Text>
        </Group>
      </td>
      <td style={{ whiteSpace: 'nowrap' }}>{element.user?.name}</td>
      <td style={{ whiteSpace: 'nowrap' }}>{element.date}</td>
      <td>
        <Center>
          <ActionIcon
            variant="light"
            color="accent"
            radius="xl"
            size="lg"
            onClick={() => editOrder(index)}
          >
            <IconPencil />
          </ActionIcon>
        </Center>
      </td>
    </tr>
  ));

  /* ------------------------------- handlers ------------------------------- */

  const editOrder = (index: number) => {
    // get order
    const order = visibleOrders[index];
    // go to edit screen
    router.push(`/orders/${order.id}`);
  };

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
        itemCount={visibleOrders.length}
        actions={
          <Group spacing={12}>
            {!searchVisible && !searchBoxVisible && (
              <Select
                placeholder="Filter by delivery status"
                value={deliveryStatus}
                onChange={setDeliveryStatus}
                data={[
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Processing', label: 'Processing' },
                  { value: 'Shipped', label: 'Shipped' },
                  { value: 'Delivered', label: 'Delivered' },
                  { value: 'Canceled', label: 'Canceled' },
                ]}
                clearable
              />
            )}
            <Collapse
              in={searchVisible}
              onTransitionEnd={() => setSearchBoxVisible((visible) => !visible)}
            >
              <TextInput
                placeholder="Order ID"
                value={searchText}
                onChange={(event) => setSearchText(event.currentTarget.value)}
              />
            </Collapse>
            <Button
              p={0}
              px={8}
              variant="subtle"
              loading={!searchedOrdersFetched}
              onClick={() => {
                setSearchVisible((visible) => !visible);
              }}
              // styles={{root:pad}}
            >
              <IconSearch />
            </Button>
          </Group>
        }
        headers={
          <tr>
            <th>ID</th>
            <th>Products</th>
            <th>Total Charges</th>
            <th>Status</th>
            <th>Ordered By</th>
            <th>Ordered On</th>
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
});

/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */

const deliveryStepColor = (status: DeliveryStatus): string => {
  switch (status) {
    case DeliveryStatus.Pending:
      return 'gray';
    case DeliveryStatus.Processing:
      return 'yellow';
    case DeliveryStatus.Shipped:
      return 'blue';
    case DeliveryStatus.Delivered:
      return 'green';
    case DeliveryStatus.Canceled:
      return 'red';
    default:
      return 'gray';
  }
};

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

(Orders as any).Layout = HomeLayout;

export default Orders;
