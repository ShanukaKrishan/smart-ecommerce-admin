import { createStyles, Grid, Stack } from '@mantine/core';
import React, { ReactNode } from 'react';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {
  label: ReactNode;
  children?: ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const FormCategory = ({ label, children }: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const { classes } = useStyles();

  /* -------------------------------- render -------------------------------- */

  return (
    <div className={classes.body}>
      <Grid className={classes.gridWrapper} columns={12}>
        <Grid.Col span={3}>{label}</Grid.Col>
        <Grid.Col span={9}>{children}</Grid.Col>
      </Grid>
      <Stack className={classes.flexWrapper}>
        {label}
        {children}
      </Stack>
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
    },
    gridWrapper: {
      width: '100%',
      height: '100%',
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        display: 'none',
      },
    },
    flexWrapper: {
      width: '100%',
      height: '100%',
      [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
        display: 'none',
      },
    },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

export default FormCategory;
