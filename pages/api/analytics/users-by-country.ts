import { BetaAnalyticsDataClient } from '@google-analytics/data';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';

export interface UsersByCountryData {
  country: string;
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
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'totalUsers' }],
  });
  // create data
  const data: UsersByCountryData[] = [];
  // check response contain rows
  if (!response.rows) {
    return res.status(200).json({ success: true, data });
  }
  // iterate though rows
  for (const row of response.rows) {
    // get country name
    const countryName = row.dimensionValues?.[0].value;
    // check value exist
    if (!countryName) continue;
    // get metric value
    const metricValue = row.metricValues?.[0].value;
    // check value exist
    if (!metricValue) continue;
    // push data to array
    data.push({ country: countryName, value: Number(metricValue) });
  }
  return res.status(200).json({ success: true, data });
};

export default analytics;
