import { QueryFunction } from 'react-query';
import { PageViewsData } from '../pages/api/analytics/page-views';
import { TotalUsersData } from '../pages/api/analytics/total-users';
import { UserEngagementDurationData } from '../pages/api/analytics/user-engagement-duration';
import { UsersByCountryData } from '../pages/api/analytics/users-by-country';
import { UsersByPlatformData } from '../pages/api/analytics/users-by-platform';

interface UserEngagementDurationResponse {
  success: boolean;
  data: UserEngagementDurationData[];
}

interface TotalUsersResponse {
  success: boolean;
  data: TotalUsersData[];
}

interface UsersByCountryResponse {
  success: boolean;
  data: UsersByCountryData[];
}

interface UsersByPlatformResponse {
  success: boolean;
  data: UsersByPlatformData[];
}

interface PageViewsResponse {
  success: boolean;
  data: PageViewsData[];
}

export const fetchUserEngagementDuration: QueryFunction<
  UserEngagementDurationData[]
> = async () => {
  // make request
  const res = await fetch('/api/analytics/user-engagement-duration', {
    method: 'GET',
  });
  // decode response
  const resJson: UserEngagementDurationResponse = await res.json();
  // check error
  if (!res.ok || !resJson.success) {
    throw new Error('Analytics fetch error');
  }
  // return data
  return resJson.data;
};

export const fetchTotalUsers: QueryFunction<TotalUsersData[]> = async () => {
  // make request
  const res = await fetch('/api/analytics/total-users', {
    method: 'GET',
  });
  // decode response
  const resJson: TotalUsersResponse = await res.json();
  // check error
  if (!res.ok || !resJson.success) {
    throw new Error('Analytics fetch error');
  }
  // return data
  return resJson.data;
};

export const fetchPageViews: QueryFunction<PageViewsData[]> = async () => {
  // make request
  const res = await fetch('/api/analytics/page-views', {
    method: 'GET',
  });
  // decode response
  const resJson: PageViewsResponse = await res.json();
  // check error
  if (!res.ok || !resJson.success) {
    throw new Error('Analytics fetch error');
  }
  // return data
  return resJson.data;
};

export const fetchUsersByCountry: QueryFunction<
  UsersByCountryData[]
> = async () => {
  // make request
  const res = await fetch('/api/analytics/users-by-country', {
    method: 'GET',
  });
  // decode response
  const resJson: UsersByCountryResponse = await res.json();
  // check error
  if (!res.ok || !resJson.success) {
    throw new Error('Analytics fetch error');
  }
  // return data
  return resJson.data;
};

export const fetchUsersByPlatform: QueryFunction<
  UsersByPlatformData[]
> = async () => {
  // make request
  const res = await fetch('/api/analytics/users-by-platform', {
    method: 'GET',
  });
  // decode response
  const resJson: UsersByPlatformResponse = await res.json();
  // check error
  if (!res.ok || !resJson.success) {
    throw new Error('Analytics fetch error');
  }
  // return data
  return resJson.data;
};
