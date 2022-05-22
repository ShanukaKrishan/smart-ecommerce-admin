import { createStyles, Divider, Group, Stack, Text } from '@mantine/core';
import { IconChevronRight, IconTruckDelivery } from '@tabler/icons';
import React, { ReactNode } from 'react';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {
  icon: ReactNode;
  title: string;
  value: string;
}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const OverviewItem = ({ icon, title, value }: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const { classes } = useStyles();

  /* -------------------------------- render -------------------------------- */

  return (
    <Stack px={12} py={8} className={classes.body} spacing={4}>
      <Group px={8}>
        {icon}
        <Stack spacing={0}>
          <Text size="xs" color="gray">
            {title}
          </Text>
          <Text weight={500}>{value}</Text>
        </Stack>
      </Group>
      <Divider />
      <Group px={8} mt={4} spacing={4}>
        <Text size="xs" color="gray">
          View All
        </Text>
        <IconChevronRight size={12} color="gray" />
      </Group>
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
      border: `2px solid ${theme.colors.gray[4]}`,
      borderRadius: 8,
    },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */
export default OverviewItem;
