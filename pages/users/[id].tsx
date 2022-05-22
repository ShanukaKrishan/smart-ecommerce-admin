import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Checkbox,
  createStyles,
  Divider,
  Group,
  Loader,
  MediaQuery,
  Stack,
  Text,
} from '@mantine/core';
import { IconChevronLeft, IconPencil } from '@tabler/icons';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import HomeLayout from '../../components/HomeLayout';
import { showErrorNotification } from '../../helpers/notification';
import Order, { orderConverter } from '../../models/order';
import Product, { productConverter } from '../../models/product';
import User, { userConverter } from '../../models/user';
import { generateOrderRows } from '../orders/index';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const UserDetails = (props: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const [loading, setLoading] = useState(false);

  const [ordersLoading, setOrdersLoading] = useState(false);

  const [user, setUser] = useState<User>();

  const [orders, setOrders] = useState<Order[]>([]);

  const [favorites, setFavorites] = useState<Product[]>([]);

  const [favoritesLoading, setFavoritesLoading] = useState(false);

  const router = useRouter();

  const { classes } = useStyles();

  useEffect(() => {
    const getUser = async () => {
      // get firestore
      const firestore = getFirestore();
      // create reference with converter
      const ref = doc(
        firestore,
        'users',
        router.query.id as string
      ).withConverter(userConverter);
      // get snapshot
      const snapshot = await getDoc(ref);
      // check snapshot contains data
      if (!snapshot.exists()) {
        // show notification
        showErrorNotification('User not found');
        return;
      }
      // get user
      const user = snapshot.data();
      // initialize user
      await user.initialize();
      // save user
      setUser(user);
    };

    (async function () {
      try {
        // start loading
        setLoading(true);
        // get user
        await getUser();
      } catch (error) {
        console.log(error);
        // show notification
        showErrorNotification('Error Occurred');
      } finally {
        // stop loading
        setLoading(false);
      }
    })();
  }, [router.query.id]);

  useEffect(() => {
    const getOrders = async () => {
      // get firestore
      const firestore = getFirestore();
      // create reference with converter
      const ref = collection(firestore, 'orders').withConverter(orderConverter);
      // create query
      const queryRef = query(ref, where('userId', '==', user?.id));
      // get snapshot
      const snapshot = await getDocs(queryRef);
      // create array to hold orders
      const orders: Order[] = [];
      // iterate through orders
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
    };

    (async function () {
      // check user fetched
      if (user == null) return;
      try {
        // start loading
        setOrdersLoading(true);
        // get user
        await getOrders();
      } catch (error) {
        console.log(error);
        // show notification
        showErrorNotification('Error Occurred');
      } finally {
        // stop loading
        setOrdersLoading(false);
      }
    })();
  }, [user]);

  useEffect(() => {
    const getFavorites = async () => {
      // get firestore
      const firestore = getFirestore();
      // create reference with converter
      const ref = collection(firestore, 'users', user!.id, 'favorites');
      // create query
      const queryRef = query(ref);
      // get snapshot
      const snapshot = await getDocs(queryRef);
      // create array to hold products
      const products: Product[] = [];
      // iterate through favorites
      for (const favoriteDoc of snapshot.docs) {
        // get id
        const productId = favoriteDoc.id;
        // create ref
        const ref = doc(firestore, 'products', productId).withConverter(
          productConverter
        );
        // get snapshot
        const snapshot = await getDoc(ref);
        // get product
        const product = snapshot.data();
        // check exist
        if (product == null) continue;
        // add product to array
        products.push(product);
      }
      // save products
      setFavorites(products);
    };

    (async function () {
      // check user fetched
      if (user == null) return;
      try {
        // start loading
        setFavoritesLoading(true);
        // get user
        await getFavorites();
      } catch (error) {
        console.log(error);
        // show notification
        showErrorNotification('Error Occurred');
      } finally {
        // stop loading
        setFavoritesLoading(false);
      }
    })();
  }, [user]);

  /* ------------------------------- handlers ------------------------------- */

  const editOrder = (index: number) => {
    // get order
    const order = orders[index];
    // go to edit screen
    router.push(`/orders/${order.id}`);
  };

  const editProduct = (index: number) => {
    // get product
    const product = favorites[index];
    // go to edit screen
    router.push(`/products/${product.id}`);
  };

  /* -------------------------------- helpers ------------------------------- */

  const rows = favorites.map((element, index) => (
    <tr key={index}>
      <td style={{ whiteSpace: 'nowrap' }}>{element.name}</td>
      <td style={{ whiteSpace: 'nowrap' }}>LKR {element.price}</td>
      <td style={{ whiteSpace: 'nowrap' }}>
        <Checkbox ml={20} checked={element.featured} onChange={() => {}} />
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
    </tr>
  ));

  const header = (
    <Group py={32} px={44} position="apart">
      <Group spacing={24}>
        <Avatar
          size="xl"
          src={user?.imageUrl}
          radius={99999}
          imageProps={{ style: { objectFit: 'cover' } }}
        />
        <Stack spacing={0}>
          <Text size="lg" weight={500}>
            {user?.name}
          </Text>
          <Stack spacing={0}>
            <Text size="xs" color="gray">
              {user?.userName}
            </Text>
            <Text size="xs" color="gray">
              {user?.email}
            </Text>
            <Text size="xs" color="gray">
              {user?.phoneNumber}
            </Text>
          </Stack>
        </Stack>
      </Group>
      <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
        <Button
          variant="outline"
          leftIcon={<IconChevronLeft />}
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </MediaQuery>
    </Group>
  );

  const ordersTable = (
    <DataTable
      title="Orders"
      loading={ordersLoading}
      itemCount={orders.length}
      actions=""
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
      rows={generateOrderRows(orders, editOrder)}
      emptyMessage={
        <Center style={{ width: '100%', height: '100%' }}>
          <Stack align="center" spacing={4}>
            <Text size="sm">No Orders Exist For the User..</Text>
            <Text size="xs">Wait for the customer to make orders</Text>
          </Stack>
        </Center>
      }
    />
  );

  const favoriteTable = (
    <DataTable
      title="Favorites"
      loading={favoritesLoading}
      itemCount={favorites.length}
      actions=""
      headers={
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th style={{ width: 120 }}>Featured</th>
          <th style={{ width: 50 }}></th>
        </tr>
      }
      rows={rows}
      emptyMessage={
        <Center style={{ width: '100%', height: '100%' }}>
          <Stack align="center" spacing={4}>
            <Text size="sm">No Favorites Exist For the User..</Text>
            <Text size="xs">Wait for the customer to make favorites</Text>
          </Stack>
        </Center>
      }
    />
  );

  /* -------------------------------- render -------------------------------- */

  return (
    <Stack className={classes.body} spacing={0}>
      {/* head */}
      <Head>
        <title>Smart Ecommerce Store Admin - User ({user?.name})</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* body */}
      {loading && (
        <Center style={{ height: '100%', width: '100%' }}>
          <Loader />
        </Center>
      )}
      {!loading && (
        <>
          {header}
          <Group className={classes.dataTablesWrapper} spacing={0}>
            <Box className={classes.orderTableWrapper}>{ordersTable}</Box>
            <Divider className={classes.tableDivider} orientation="vertical" />
            <Box className={classes.favoriteTableWrapper}>{favoriteTable}</Box>
          </Group>
        </>
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
    dataTablesWrapper: {
      width: '100%',
      height: '100%',
      [`@media (max-width: ${theme.breakpoints.xl}px)`]: {
        flexDirection: 'column',
      },
    },
    orderTableWrapper: {
      width: '70%',
      height: '100%',
      [`@media (max-width: ${theme.breakpoints.xl}px)`]: {
        width: '100%',
        height: 'auto',
        minHeight: '20vh',
        maxHeight: '70vh',
      },
    },
    favoriteTableWrapper: {
      width: '30%',
      height: '100%',
      [`@media (max-width: ${theme.breakpoints.xl}px)`]: {
        width: '100%',
        height: 'auto',
        minHeight: '20vh',
        maxHeight: '70vh',
      },
    },
    tableDivider: {
      [`@media (max-width: ${theme.breakpoints.xl}px)`]: {
        display: 'none',
      },
    },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

(UserDetails as any).Layout = HomeLayout;

export default UserDetails;
