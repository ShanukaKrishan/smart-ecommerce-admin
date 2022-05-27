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
import LottieLoader from '../LottieLoader';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export interface RevenueByDateData {
  name: string;
  date: Date;
  value: number;
}

interface Props {
  loading: boolean;
  data: RevenueByDateData[];
}

const RevenuePerDayChart = ({ loading, data }: Props): JSX.Element => {
  /* -------------------------------- helpers ------------------------------- */

  // const yAxisFormatter = (value: any) => {
  //   // create date
  //   const date = dayjs().startOf('day').add(value, 's');
  //   // check hours available
  //   if (date.hour() > 0) {
  //     return date.format('H[h] m[m]');
  //   }
  //   // check minutes available
  //   if (date.minute() > 0) {
  //     return date.format('m[m] s[s]');
  //   }
  //   return date.format('s[s]');
  // };

  // const tooltipFormatter = (value: number) => {
  //   // create date
  //   const date = dayjs().startOf('day').add(value, 's');
  //   // return formatted date
  //   return date.format('H[h] m[m] s[s]');
  // };

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
        <YAxis style={{ fontSize: 10, fontWeight: 500 }} />
        <Tooltip />
        <Area
          name="Revenue"
          type="monotone"
          dataKey="value"
          stackId="1"
          stroke="#ffc658"
          fill="#ffc658"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RevenuePerDayChart;
