import { Center } from '@mantine/core';
import dayjs from 'dayjs';
import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { UserEngagementDurationData } from '../../pages/api/analytics/user-engagement-duration';
import LottieLoader from '../LottieLoader';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface Props {
  loading: boolean;
  data: UserEngagementDurationData[];
}

const UserEngagementDurationChart = ({ loading, data }: Props): JSX.Element => {
  /* -------------------------------- helpers ------------------------------- */

  const yAxisFormatter = (value: any) => {
    // create date
    const date = dayjs().startOf('day').add(value, 's');
    // check hours available
    if (date.hour() > 0) {
      return date.format('H[h] m[m]');
    }
    // check minutes available
    if (date.minute() > 0) {
      return date.format('m[m] s[s]');
    }
    return date.format('s[s]');
  };

  const tooltipFormatter = (value: number) => {
    // create date
    const date = dayjs().startOf('day').add(value, 's');
    // return formatted date
    return date.format('H[h] m[m] s[s]');
  };

  /* -------------------------------- render -------------------------------- */

  return loading ? (
    <Center style={{ width: '100%', height: '100%' }}>
      <LottieLoader />
    </Center>
  ) : (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" style={{ fontSize: 10, fontWeight: 500 }} />
        <YAxis
          tickFormatter={yAxisFormatter}
          style={{ fontSize: 10, fontWeight: 500 }}
        />
        <Tooltip formatter={tooltipFormatter} />
        <Area
          name="Engagement Time"
          type="monotone"
          dataKey="value"
          stackId="1"
          stroke="#8884d8"
          fill="#8884d8"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default UserEngagementDurationChart;
