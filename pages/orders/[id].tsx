import {
  Avatar,
  Button,
  Center,
  createStyles,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Stepper,
  Text,
} from '@mantine/core';
import {
  IconAnchor,
  IconArrowBigUpLines,
  IconCheck,
  IconRotateClockwise2,
  IconTruckDelivery,
  IconTruckLoading,
  IconX,
} from '@tabler/icons';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import HomeLayout from '../../components/HomeLayout';
import {
  getFirestore,
  doc,
  updateDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../helpers/notification';
import Product, { productConverter } from '../../models/product';
import Head from 'next/head';
import Order, { DeliveryStatus, orderConverter } from '../../models/order';
import ProductItem from '../../components/order/ProductItem';
import User, { userConverter } from '../../models/user';
import LottieLoader from '../../components/LottieLoader';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface FormValues {
  images: File[];
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  price: number;
  featured: boolean;
}

interface OrderProduct {
  product: Product;
  quantity: number;
}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const EditOrder = (): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const [loading, setLoading] = useState(true);

  const [userLoading, setUserLoading] = useState(true);

  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);

  const [cancelDeliveryLoading, setCancelDeliveryLoading] = useState(false);

  const [order, setOrder] = useState<Order>();

  const [products, setProducts] = useState<OrderProduct[]>([]);

  const [user, setUser] = useState<User>();

  const [deliveryStep, setDeliveryStep] = useState(0);

  const router = useRouter();

  const { classes } = useStyles();

  useEffect(() => {
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = doc(
      firestore,
      'orders',
      router.query.id as string
    ).withConverter(orderConverter);
    // subscribe to data
    const unsubscribe = onSnapshot(
      ref,
      async (snapshot) => {
        // get order
        const order = snapshot.data();
        // check order exist
        if (order == null) return;
        // set delivery step
        setDeliveryStep(deliveryStepByStatus(order.status));
        // initialize order
        await order.initialize();
        // save order
        setOrder(order);
        // set orders loading
        setLoading(false);
      },
      (error) => {
        console.log(error);
        // show notification
        showErrorNotification('Error Occurred..');
        // set orders loading
        setLoading(false);
      }
    );
    // unsubscribe on page detached
    return () => unsubscribe();
  }, [router.query.id]);

  useEffect(() => {
    // check order fetched
    if (order == null) return;
    // get firestore
    const firestore = getFirestore();
    // create products
    const products: OrderProduct[] = [];
    // create un subscribers
    const unSubscribers: Unsubscribe[] = [];
    // iterate through order products
    for (const [index, orderProduct] of order!.products.entries()) {
      // create reference with converter
      const ref = doc(firestore, 'products', orderProduct.id).withConverter(
        productConverter
      );
      // subscribe to data
      const unsubscribe = onSnapshot(
        ref,
        async (snapshot) => {
          // get product
          const product = snapshot.data();
          // check product exist
          if (product == null) return;
          // initialize product
          await product.initialize();
          // get related product from order
          const relatedProduct = order?.products.find(
            (product) => product.id === orderProduct.id
          );
          // check product exist
          if (relatedProduct == null) return;
          // get current products
          const currentProducts = products;
          // replace product
          currentProducts[index] = {
            product: product,
            quantity: relatedProduct.quantity,
          };
          // save products
          setProducts(currentProducts);
        },
        (error) => {
          console.log(error);
          // show notification
          showErrorNotification('Error Occurred While Fetching Product..');
        }
      );
      // add unsubscribe function to array
      unSubscribers.push(unsubscribe);
    }
    // unsubscribe on page detached
    return () => {
      for (const unsubscribe of unSubscribers) {
        unsubscribe();
      }
    };
  }, [order]);

  useEffect(() => {
    // check order fetched
    if (order == null) return;
    // get firestore
    const firestore = getFirestore();
    // create reference with converter
    const ref = doc(firestore, 'users', order!.userId).withConverter(
      userConverter
    );
    // subscribe to data
    const unsubscribe = onSnapshot(
      ref,
      async (snapshot) => {
        // get user
        const user = snapshot.data();
        // save user
        setUser(user);
        // set user loading
        setUserLoading(false);
      },
      (error) => {
        console.log(error);
        // show notification
        showErrorNotification('Error Occurred..');
        // set user loading
        setUserLoading(false);
      }
    );
    // unsubscribe on page detached
    return () => unsubscribe();
  }, [order]);

  /* ------------------------------- handlers ------------------------------- */

  const handleCancel = async () => {
    // start loading
    setCancelDeliveryLoading(true);
    try {
      // get firestore
      const firestore = getFirestore();
      // create reference with converter
      const ref = doc(firestore, 'orders', order!.id);
      // add document to the database
      await updateDoc(ref, {
        orderStatus: DeliveryStatus.Canceled,
      });
      // show notification
      showSuccessNotification('Successfully canceled order');
    } catch (error) {
      // show error
      showErrorNotification('Error Occurred');
    } finally {
      // stop loading
      setCancelDeliveryLoading(false);
    }
  };

  const updateOrderStatus = async () => {
    // start loading
    setUpdateStatusLoading(true);
    try {
      // get firestore
      const firestore = getFirestore();
      // create reference with converter
      const ref = doc(firestore, 'orders', order!.id);
      // add document to the database
      await updateDoc(ref, {
        orderStatus: nextDeliveryStatus(order!.status),
      });
      // show notification
      showSuccessNotification('Successfully updated order');
    } catch (error) {
      // show error
      showErrorNotification('Error Occurred');
    } finally {
      // stop loading
      setUpdateStatusLoading(false);
    }
  };

  /* -------------------------------- helpers ------------------------------- */

  const productsItems = products.map((product, index) => (
    <ProductItem
      key={index}
      firstItem={index === 0}
      product={product.product}
      quantity={product.quantity}
    />
  ));

  const productsLoading = products.length < (order?.products.length ?? 0);

  const completedStepperIcon =
    order?.status === DeliveryStatus.Canceled ? <IconX /> : undefined;

  const completedStepperColor =
    order?.status === DeliveryStatus.Canceled ? 'red' : undefined;

  /* -------------------------------- render -------------------------------- */

  return (
    <Stack className={classes.body} align="stretch">
      {/* head */}
      <Head>
        <title>Smart Ecommerce Store Admin - Order</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* body */}
      {loading ? (
        <Center style={{ height: '100%', width: '100%' }}>
          <LottieLoader />
        </Center>
      ) : (
        <ScrollArea>
          <Stack spacing={0}>
            <Group
              px={40}
              py={20}
              className={classes.title}
              position="apart"
              spacing={0}
            >
              <Stack spacing={0}>
                <Text size="xl" weight={600}>
                  Order {order?.orderId}{' '}
                  {order?.status === DeliveryStatus.Canceled
                    ? '(Canceled)'
                    : undefined}
                </Text>
                <Text size="xs" color="gray" weight={400}>
                  Order placed on {order?.date}
                </Text>
              </Stack>
              {order?.status !== DeliveryStatus.Canceled && (
                <Group>
                  {order?.status !== DeliveryStatus.Delivered && (
                    <Button
                      loading={updateStatusLoading}
                      leftIcon={
                        order?.status === DeliveryStatus.Pending ? (
                          <IconCheck />
                        ) : (
                          <IconArrowBigUpLines />
                        )
                      }
                      onClick={updateOrderStatus}
                    >
                      {updateButtonText(order!.status)}
                    </Button>
                  )}
                  {order?.status === DeliveryStatus.Pending && (
                    <Button
                      loading={cancelDeliveryLoading}
                      variant="outline"
                      leftIcon={<IconX />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}
                </Group>
              )}
            </Group>
            {/* <Divider /> */}
            <Stack align="center">
              <Stack className={classes.content} spacing={0}>
                <Stepper
                  pt={20}
                  pb={40}
                  px={12}
                  active={deliveryStep}
                  breakpoint="lg"
                  color="green"
                >
                  <Stepper.Step
                    icon={<IconRotateClockwise2 />}
                    label="Pending"
                    color={completedStepperColor}
                    completedIcon={completedStepperIcon}
                  />
                  <Stepper.Step
                    icon={<IconTruckLoading />}
                    label="Processing"
                    color={completedStepperColor}
                    completedIcon={completedStepperIcon}
                  />
                  <Stepper.Step
                    icon={<IconAnchor />}
                    label="Shipped"
                    color={completedStepperColor}
                    completedIcon={completedStepperIcon}
                  />
                  <Stepper.Step
                    icon={<IconTruckDelivery />}
                    label="Delivered"
                    color={completedStepperColor}
                    completedIcon={completedStepperIcon}
                  />
                </Stepper>
                <Divider />
                {productsLoading ? (
                  <Stack
                    align="center"
                    justify="center"
                    style={{ height: 300 }}
                    spacing={0}
                  >
                    <LottieLoader />
                    <Text size="xs" color="gray">
                      Loading products..
                    </Text>
                  </Stack>
                ) : (
                  productsItems
                )}
                <Divider />
                {userLoading ? (
                  <Stack
                    align="center"
                    justify="center"
                    style={{ height: 150 }}
                  >
                    <LottieLoader />
                    <Text size="xs" color="gray">
                      Loading user..
                    </Text>
                  </Stack>
                ) : (
                  <Stack py={20} px={12} align="end">
                    <Group className={classes.orderedByWrapper} spacing={8}>
                      <Stack spacing={4} style={{ flexGrow: 1 }}>
                        <Text size="xs" weight={500}>
                          Ordered by
                        </Text>
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
                      <Avatar radius={9999} size="xl" src={user?.imageUrl} />
                    </Group>
                  </Stack>
                )}
                <Divider />
                <Stack py={20} px={12}>
                  <Group
                    align="start"
                    position="right"
                    style={{ width: '100%' }}
                    spacing={0}
                  >
                    <Stack className={classes.addressWrapper} spacing={4}>
                      <Text size="xs" weight={500}>
                        Shipping address
                      </Text>
                      <Text size="xs" color="gray">
                        {order?.primaryAddress},
                      </Text>
                      <Text size="xs" color="gray">
                        {order?.country}
                      </Text>
                      <Text size="xs" color="gray">
                        {order?.zipCode} (Postal Code)
                      </Text>
                    </Stack>
                    <Stack className={classes.addressWrapper} spacing={4}>
                      <Text size="xs" weight={500}>
                        Billing address
                      </Text>
                      <Text size="xs" color="gray">
                        {order?.secondaryAddress},
                      </Text>
                      <Text size="xs" color="gray">
                        {order?.country}
                      </Text>
                      <Text size="xs" color="gray">
                        {order?.zipCode} (Postal Code)
                      </Text>
                    </Stack>
                  </Group>
                </Stack>
                <Divider />
                <Stack py={20} px={12}>
                  <Stack align="end" spacing={8}>
                    <Group className={classes.totalWrapper} position="apart">
                      <Text size="xs" weight={500}>
                        Sub Total
                      </Text>
                      <Text size="xs">LKR {order?.total}</Text>
                    </Group>
                    <Group className={classes.totalWrapper} position="apart">
                      <Text size="xs" weight={500}>
                        Total
                      </Text>
                      <Text size="xs">LKR {order?.total}</Text>
                    </Group>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </ScrollArea>
      )}
    </Stack>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   styles                                   */
/* -------------------------------------------------------------------------- */

const useStyles = createStyles((theme, _, getRef) => {
  return {
    body: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    },
    title: {
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        flexDirection: 'column',
        gap: 20,
      },
    },
    titleButtonWrapper: {
      flexDirection: 'row',
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        flexDirection: 'column',
      },
    },
    content: {
      width: '60%',
      height: '100%',
      [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
        width: '100%',
        paddingLeft: 44,
        paddingRight: 44,
      },
    },
    orderedByWrapper: {
      width: '60%',
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        width: '100%',
      },
    },
    addressWrapper: {
      width: '30%',
      maxWidth: '30%',
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        width: '100%',
        maxWidth: '100%',
      },
    },
    totalWrapper: {
      width: '60%',
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        width: '100%',
      },
    },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */

const deliveryStepByStatus = (status: DeliveryStatus): number => {
  switch (status) {
    case DeliveryStatus.Pending:
      return 0;
    case DeliveryStatus.Processing:
      return 1;
    case DeliveryStatus.Shipped:
      return 2;
    case DeliveryStatus.Delivered:
      return 3;
    case DeliveryStatus.Canceled:
      return 4;
    default:
      return 0;
  }
};

const nextDeliveryStatus = (status: DeliveryStatus): DeliveryStatus => {
  switch (status) {
    case DeliveryStatus.Pending:
      return DeliveryStatus.Processing;
    case DeliveryStatus.Processing:
      return DeliveryStatus.Shipped;
    case DeliveryStatus.Shipped:
      return DeliveryStatus.Delivered;
    default:
      throw 'invalid status';
  }
};

const updateButtonText = (status: DeliveryStatus): string => {
  switch (status) {
    case DeliveryStatus.Pending:
      return 'Accept Order';
    case DeliveryStatus.Processing:
      return 'Mark as Shipped';
    case DeliveryStatus.Shipped:
      return 'Mark as Delivered';
    default:
      return '';
  }
};

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

(EditOrder as any).Layout = HomeLayout;

export default EditOrder;
