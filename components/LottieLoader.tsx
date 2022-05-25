import { Player } from '@lottiefiles/react-lottie-player';
import React from 'react';

interface Props {}

const LottieLoader = (props: Props): JSX.Element => {
  return (
    <Player src="/paper_plane.json" autoplay loop style={{ height: 150 }} />
  );
};

export default LottieLoader;
