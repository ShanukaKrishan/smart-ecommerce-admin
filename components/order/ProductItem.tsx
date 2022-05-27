import { createStyles, Divider, Group, Stack, Text } from '@mantine/core';
import Image from 'next/image';
import React from 'react';
import Product from '../../models/product';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {
  firstItem: boolean;
  product: Product;
  quantity: number;
}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const ProductItem = ({ firstItem, product, quantity }: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const { classes } = useStyles();

  /* -------------------------------- render -------------------------------- */

  return (
    <Stack spacing={0}>
      {!firstItem && (
        <Divider sx={(theme) => ({ borderColor: theme.colors.gray[3] })} />
      )}
      <Group py={32} px={12} spacing={24} align="stretch">
        <Image
          className={classes.image}
          height={150}
          width={150}
          objectFit="cover"
          src={product.images[0].url}
          alt="Product Image"
        />
        <Stack py={12} justify="space-between" style={{ flexGrow: 1 }}>
          <Stack spacing={8}>
            <Text weight={500}>{product.name}</Text>
            <Text size="xs" weight={400} color="gray">
              {product.description}
            </Text>
          </Stack>
          <Group className={classes.detailsWrapper} position="apart">
            <Group spacing={12}>
              <Text size="xs" weight={500}>
                Quantity
              </Text>
              <Text size="xs">{quantity}</Text>
            </Group>
            <Group spacing={12}>
              <Text size="xs" weight={500}>
                Price
              </Text>
              <Text size="xs">USD {product.price}</Text>
            </Group>
            <Group spacing={12}>
              <Text size="xs" weight={500}>
                Total
              </Text>
              <Text size="xs">USD {product.price * quantity}</Text>
            </Group>
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   styles                                   */
/* -------------------------------------------------------------------------- */

const useStyles = createStyles((theme, _, getRef) => {
  return {
    image: {
      borderRadius: 4,
    },
    detailsWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        flexDirection: 'column',
        alignItems: 'start',
      },
    },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

export default ProductItem;
