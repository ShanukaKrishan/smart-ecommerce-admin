import { Center } from '@mantine/core';
import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TotalUsersData } from '../../pages/api/analytics/total-users';
import LottieLoader from '../LottieLoader';

interface Props {
  loading: boolean;
  data: TotalUsersData[];
}

const TotalUsersChart = ({ loading, data }: Props): JSX.Element => {
  /* -------------------------------- render -------------------------------- */

  return loading ? (
    <Center style={{ width: '100%', height: '100%' }}>
      <LottieLoader />
    </Center>
  ) : (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" style={{ fontSize: 10 }} />
        <YAxis style={{ fontSize: 10 }} />
        <Tooltip />
        <Line name="Total Users" type="linear" dataKey="value" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TotalUsersChart;
