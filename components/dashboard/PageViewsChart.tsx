import { Center } from '@mantine/core';
import React from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { PageViewsData } from '../../pages/api/analytics/page-views';
import LottieLoader from '../LottieLoader';

interface Props {
  loading: boolean;
  data: PageViewsData[];
}

const PageViewsChart = ({ loading, data }: Props): JSX.Element => {
  /* -------------------------------- render -------------------------------- */

  return loading ? (
    <Center style={{ width: '100%', height: '100%' }}>
      <LottieLoader />
    </Center>
  ) : (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" style={{ fontSize: 10 }} />
        <PolarRadiusAxis />
        <Tooltip />
        <Radar
          name="Views"
          dataKey="value"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default PageViewsChart;
