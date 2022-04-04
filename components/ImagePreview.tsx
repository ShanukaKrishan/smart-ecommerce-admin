import { Box, Center, createStyles, Group, Text } from '@mantine/core';
import { IconCircleMinus } from '@tabler/icons';
import Image from 'next/image';
import React from 'react';

/* -------------------------------------------------------------------------- */
/*                                 interfaces                                 */
/* -------------------------------------------------------------------------- */

interface Props {
  src: string;
  onRemoveImage: () => void;
}

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */

const ImagePreview = ({ src, onRemoveImage }: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const { classes } = useStyles();

  /* -------------------------------- render -------------------------------- */

  return (
    <Box className={classes.imageWrapper}>
      <Image layout="fill" objectFit="cover" src={src} alt="Product Image" />
      <div className={classes.imageOverlay}></div>
      <Center className={classes.imageOverlayContent} onClick={onRemoveImage}>
        <Group>
          <IconCircleMinus color="white" />
          <Text color="white">Click here to remove the image</Text>
        </Group>
      </Center>
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
