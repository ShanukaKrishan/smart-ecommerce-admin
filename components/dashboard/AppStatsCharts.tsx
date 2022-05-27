import { Center } from '@mantine/core';
import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { EventCountsData } from '../../pages/api/analytics/event-counts';
import LottieLoader from '../LottieLoader';

interface Props {
  loading: boolean;
  data: EventCountsData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AppStatsCharts = ({ loading, data }: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const [activeIndex, setActiveIndex] = useState(0);

  /* -------------------------------- helpers ------------------------------- */

  const filteredData = data.filter((data) =>
    ['first_open', 'app_remove', 'app_clear_data'].includes(data.event)
  );

  const beautifyEventName = (eventName: string) => {
    switch (eventName) {
      case 'first_open':
        return 'App Installs';
      case 'app_remove':
        return 'App Uninstalls';
      case 'app_clear_data':
        return 'App Data Cleared';
      default:
        return eventName;
    }
  };

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {value}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(${beautifyEventName(payload.event)})`}
        </text>
      </g>
    );
  };

  /* ------------------------------- handlers ------------------------------- */

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  /* -------------------------------- render -------------------------------- */

  return loading ? (
    <Center style={{ width: '100%', height: '100%' }}>
      <LottieLoader />
    </Center>
  ) : (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={filteredData}
          dataKey="count"
          fill="#82ca9d"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          // label
          nameKey="event"
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        {/* <Tooltip /> */}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AppStatsCharts;
