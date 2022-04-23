import { Box, Center, createStyles, Group, Stack, Text } from '@mantine/core';
import { IconCircleMinus } from '@tabler/icons';
import Image from 'next/image';
import React from 'react';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {
  overlayMessage?: string;
  markedAsRemoved?: boolean;
  src: string;
  onRemoveImage: () => void;
}

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */

const ImagePreview = ({
  overlayMessage,
  markedAsRemoved = false,
  src,
  onRemoveImage,
}: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const { classes } = useStyles();

  /* -------------------------------- render -------------------------------- */

  return (
    <Box mb={16} className={classes.imageWrapper}>
      <Image layout="fill" objectFit="cover" src={src} alt="Product Image" />
      {!markedAsRemoved && <div className={classes.imageOverlay}></div>}
      {markedAsRemoved && <div className={classes.removeOverlay}></div>}
      {markedAsRemoved && (
        <Center
          className={classes.removeOverlayContent}
          onClick={onRemoveImage}
        >
          <Stack spacing={0} align="center">
            <Text color="white">Marked to remove</Text>
            <Text color="white">(Click to unmark)</Text>
          </Stack>
        </Center>
      )}
      {!markedAsRemoved && (
        <Center
          px={16}
          className={classes.imageOverlayContent}
          onClick={onRemoveImage}
        >
          <Group>
            <IconCircleMinus color="white" />
            <Text color="white">
              {overlayMessage ?? 'Click here to remove the image'}
            </Text>
          </Group>
        </Center>
      )}
    </Box>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   styles                                   */
/* -------------------------------------------------------------------------- */

const useStyles = createStyles((theme, _, getRef) => {
  return {
    imageWrapper: {
      position: 'relative',
      width: '100%',
      height: 200,
      border: `1px solid ${theme.colors.gray[4]}`,
      borderRadius: theme.radius.md,
      overflow: 'hidden',
      userSelect: 'none',
      [`&:hover .${getRef('imageOverlay')}`]: {
        opacity: 0.4,
      },
      [`&:hover .${getRef('imageOverlayContent')}`]: {
        opacity: 1,
      },
    },
    removeOverlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: '#FF0000',
      opacity: 0.4,
    },
    removeOverlayContent: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    imageOverlay: {
      ref: getRef('imageOverlay'),
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: '#000000',
      opacity: 0,
      transition: 'all 0.2s',
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        opacity: 0.4,
      },
    },
    imageOverlayContent: {
      ref: getRef('imageOverlayContent'),
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0,
      transition: 'all 0.2s',
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        opacity: 1,
      },
    },
  };
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

export default ImagePreview;
