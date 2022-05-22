import {
  ActionIcon,
  Box,
  Center,
  ColorSwatch,
  createStyles,
  Divider,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import {
  IconBrandAndroid,
  IconPencil,
  IconReportMoney,
  IconShoppingCart,
  IconSortAscending,
  IconTruckDelivery,
} from '@tabler/icons';
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
} from 'firebase/firestore';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AreaChartView from '../components/dashboard/AreaChart';
import LineBarChart from '../components/dashboard/LineBarChart';
import MixedBarChartView from '../components/dashboard/MixedBarChartView';
import OverviewItem from '../components/dashboard/OverviewItem';
import PieChartOne from '../components/dashboard/PieChartOne';
import PieChartTwo from '../components/dashboard/PieChartTwo';
import HomeLayout from '../components/HomeLayout';
import { showErrorNotification } from '../helpers/notification';
import Order, { orderConverter } from '../models/order';
import { deliveryStepColor } from './orders/index';

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const Home: NextPage = () => {
  /* --------------------------------- hooks -------------------------------- */

  const [orders, setOrders] = useState<Order[]>([]);

  const [ordersLoading, setOrdersLoading] = useState(false);

  const router = useRouter();

  const { classes } = useStyles();

  useEffect(() => {
    const getOrders = async () => {
      // get firestore
      const firestore = getFirestore();
      // create reference with converter
      const ref = collection(firestore, 'orders').withConverter(orderConverter);
      // create query
      const queryRef = query(ref, limit(10));
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
  }, []);

  /* ------------------------------- handlers ------------------------------- */

  const editOrder = (index: number) => {
    // get order
    const order = orders[index];
    // go to edit screen
    router.push(`/orders/${order.id}`);
  };

  /* -------------------------------- helpers ------------------------------- */

  const orderItems = orders.map((element, index) => (
    <tr key={index}>
      <td style={{ whiteSpace: 'nowrap' }}>{element.orderId}</td>
      {/* <td style={{ whiteSpace: 'nowrap' }}>{element.products.length}</td> */}
      {/* <td style={{ whiteSpace: 'nowrap' }}>LKR {element.total}</td> */}
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

  const orderTable = (
    <Stack py={12} px={8} className={classes.ordersCard}>
      <Text align="center" color="gray" weight={500}>
        Latest Orders
      </Text>
      {ordersLoading && (
        <Center style={{ width: '100%', height: '100%' }}>
          <Loader />
        </Center>
      )}
      {!ordersLoading && orders.length > 0 && (
        <ScrollArea style={{ width: '100%', flexGrow: 1 }}>
          <Table
            verticalSpacing="sm"
            style={{ width: '100%' }}
            highlightOnHover
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>{orderItems}</tbody>
          </Table>
        </ScrollArea>
      )}
    </Stack>
  );

  const androidApkUploader = (
    <Stack align="center" p={20} className={classes.apkCard}>
      <Text weight={500}>Android APK</Text>
      <Dropzone
        onDrop={(files) => {
          // form.setFieldValue('images', [...form.values.images, ...files]);
        }}
        onReject={(rejections) => {
          console.log(rejections);
        }}
        maxSize={5 * 1024 ** 2}
      >
        {(status) => (
          <Stack align="center" spacing={8}>
            <IconBrandAndroid size={60} color="gray" />
            <Text size="xs" color="gray">
              Drop apk here or click to upload
            </Text>
          </Stack>
        )}
      </Dropzone>
    </Stack>
  );

  /* -------------------------------- render -------------------------------- */

  return (
    <Center style={{ width: '100%', height: '100%' }}>
      {/* head */}
      <Head>
        <title>Smart Ecommerce Store Admin - Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* body */}
      <Stack py={30} className={classes.body} spacing={32}>
        <Group px={44} spacing={40} style={{ flex: 'none' }}>
          <OverviewItem
            icon={<IconTruckDelivery />}
            title="Total Orders"
            value="50"
          />
          <OverviewItem
            icon={<IconReportMoney />}
            title="Total Revenue"
            value="LKR 24000"
          />
          <OverviewItem
            icon={<IconShoppingCart />}
            title="Total Products"
            value="70"
          />
          <OverviewItem
            icon={<IconSortAscending />}
            title="New Orders"
            value="4"
          />
        </Group>
        <Group
          px={44}
          spacing={20}
          align="stretch"
          style={{
            width: '100%',
            height: '100%',
            flexGrow: 1,
            overflow: 'hidden',
          }}
        >
          <ScrollArea style={{ width: '70%', flex: 'none' }}>
            <Stack>
              <Group grow>
                <Box style={{ height: 250 }}>
                  <PieChartOne />
                </Box>
                <Box style={{ height: 250 }}>
                  <PieChartTwo />
                </Box>
              </Group>
              <AreaChartView />
              <MixedBarChartView />
              <LineBarChart />
            </Stack>
          </ScrollArea>
          <Stack style={{ width: '30%' }} spacing={20}>
            {orderTable}
            {androidApkUploader}
          </Stack>
        </Group>
      </Stack>
    </Center>
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
    overviewCard: {
      width: 200,
      border: `2px solid ${theme.colors.gray[4]}`,
      borderRadius: 8,
      flex: 'none',
    },
    ordersCard: {
      width: '100%',
      border: `2px solid ${theme.colors.gray[4]}`,
      borderRadius: 8,
      flexGrow: 1,
      overflow: 'hidden',
    },
    apkCard: {
      width: '100%',
      border: `2px solid ${theme.colors.gray[4]}`,
      borderRadius: 8,
    },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

(Home as any).Layout = HomeLayout;

export default Home;
