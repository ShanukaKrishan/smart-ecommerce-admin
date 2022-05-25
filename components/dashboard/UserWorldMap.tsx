import { FloatingTooltip, Group, Stack } from '@mantine/core';
import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
  ZoomableGroup,
} from 'react-simple-maps';
import { UsersByCountryData } from '../../pages/api/analytics/users-by-country';

interface Props {
  data: UsersByCountryData[];
}

const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

const UserWorldMap = ({ data }: Props): JSX.Element => {
  /* --------------------------------- hooks -------------------------------- */

  const [label, setLabel] = useState('');

  /* -------------------------------- render -------------------------------- */

  return (
    <FloatingTooltip
      mt={-40}
      label={label}
      disabled={label === ''}
      style={{ width: '100%', height: '100%' }}
    >
      <ComposableMap style={{ width: '100%', height: '100%' }}>
        <ZoomableGroup>
          <Sphere id="123" fill="#ffffff" stroke="#E4E5E6" strokeWidth={0.5} />
          <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // get details
                const { NAME: countryName } = geo.properties;
                // find metrics for the country
                const countryData = data.find(
                  (data) => data.country === countryName
                );
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      setLabel(
                        `${countryName}${
                          countryData?.value == null
                            ? ''
                            : ' : ' + countryData.value
                        }`
                      );
                    }}
                    onMouseLeave={() => {
                      setLabel('');
                    }}
                    fill={countryData == null ? '#E9E9E9' : '#FF6464'}
                    stroke="#D0D0D0"
                    style={{
                      hover: {
                        fill: '#67FF71',
                        stroke: '#ffffff',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </FloatingTooltip>
  );
};

export default UserWorldMap;
