import {
  Avatar,
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
} from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import HomeLayout from '../../components/HomeLayout';
import { showErrorNotification } from '../../helpers/notification';
import Order, { orderConverter } from '../../models/order';
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

  const router = useRouter();

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

  /* ------------------------------- handlers ------------------------------- */

  const editOrder = (index: number) => {
    // get order
    const order = orders[index];
    // go to edit screen
    router.push(`/orders/${order.id}`);
  };

  /* -------------------------------- render -------------------------------- */

  return loading ? (
    <Center style={{ height: '100%', width: '100%' }}>
      <Loader />
    </Center>
  ) : (
    <Stack spacing={0} style={{ height: '100%', width: '100%' }}>
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
        <Button
          variant="outline"
          leftIcon={<IconChevronLeft />}
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </Group>
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
      ></DataTable>
    </Stack>
  );
};

(UserDetails as any).Layout = HomeLayout;

export default UserDetails;
