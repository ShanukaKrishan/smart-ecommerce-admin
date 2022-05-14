import React, { ReactNode } from 'react';
import { Global, MantineProvider, MantineThemeOverride } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

interface Props {
  children: ReactNode;
}

const MantineTheme = ({ children }: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const theme: MantineThemeOverride = {
    fontFamily: ['Montserrat'].join(','),
    colors: {
      accent: [
        '#ffefe8',
        '#a37f71',
        '#a37f71',
        '#a37f71',
        '#a37f71',
        '#a37f71',
        '#a37f71',
        // '#87675b',
        '#a37f71',
        '#a37f71',
        '#a37f71',
      ],
    },
    primaryColor: 'accent',
  };

  /* -------------------------------- render -------------------------------- */

  return (
    <MantineProvider
      withNormalizeCSS
      withGlobalStyles
      theme={theme}
      defaultProps={{ Group: { noWrap: true } }}
      styles={{
        AppShell: (theme) => ({
          main: { maxHeight: '100vh' },
        }),
        TextInput: (theme) => ({
          label: {
            color: theme.colors.gray[7],
          },
          error: {
            fontSize: theme.fontSizes.xs,
          },
        }),
        NumberInput: (theme) => ({
          label: {
            color: theme.colors.gray[7],
          },
          error: {
            fontSize: theme.fontSizes.xs,
          },
        }),
        PasswordInput: (theme) => ({
          label: {
            color: theme.colors.gray[7],
          },
          error: {
            fontSize: theme.fontSizes.xs,
          },
        }),
        Select: (theme) => ({
          label: {
            color: theme.colors.gray[7],
          },
          error: {
            fontSize: theme.fontSizes.xs,
          },
        }),
        Stepper: (theme) => ({
          stepLabel: {
            fontSize: theme.fontSizes.sm,
            color: theme.colors.gray[7],
          },
        }),
      }}
    >
      <Global
        styles={(theme) => ({
          body: {
            height: '100vh',
            fontFamily: theme.fontFamily,
          },
          '#__next': {
            height: '100%',
          },
          '.firebase-emulator-warning': {
            opacity: 0,
            pointerEvents: 'none',
          },
        })}
      />
      <NotificationsProvider>{children}</NotificationsProvider>
    </MantineProvider>
  );
};

export default MantineTheme;
