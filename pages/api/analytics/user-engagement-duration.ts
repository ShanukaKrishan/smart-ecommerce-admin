import { BetaAnalyticsDataClient } from '@google-analytics/data';
import dayjs from 'dayjs';
import IsSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { NextApiRequest, NextApiResponse } from 'next';

dayjs.extend(IsSameOrBefore);

export interface UserEngagementDurationData {
  name: string;
  date: Date;
  value: number;
}

const analytics = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  // create client
  const analyticsDataClient = new BetaAnalyticsDataClient();
  // create starting date
  const startDate = dayjs().subtract(2, 'week');
  // make request
  const [response] = await analyticsDataClient.runReport({
    property: `properties/316463457`,
    dateRanges: [
      { startDate: startDate.format('YYYY-MM-DD'), endDate: 'today' },
    ],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'userEngagementDuration' }],
  });
  // create data
  const data: UserEngagementDurationData[] = [];
  // iterate through days
  for (
    let day = dayjs(startDate);
    day.isSameOrBefore(dayjs(), 'day');
    day = day.add(1, 'day')
  ) {
    // add to data
    data.push({ name: day.format('D MMM'), date: day.toDate(), value: 0 });
  }
  // check response contain rows
  if (!response.rows) {
    return res.status(200).json({ success: true, data });
  }
  // iterate though rows
  for (const row of response.rows) {
    // get date value
    const date = dayjs(row.dimensionValues?.[0].value);
    // get index of data array
    const index = data.findIndex((data) =>
      dayjs(data.date).isSame(date, 'day')
    );
    // check index exist
    if (index === -1) continue;
    // get metric value for the date
    const metricValue = row.metricValues?.[0].value;
    // check value exist
    if (!metricValue) continue;
    // add value to data
    data[index].value = Number(metricValue);
  }
  return res.status(200).json({ success: true, data });
};

export default analytics;
