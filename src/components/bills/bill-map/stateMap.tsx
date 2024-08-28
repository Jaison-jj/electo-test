'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as d3 from 'd3';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import React, { useCallback, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import Loading from '@/components/utils/Loading';

import { userAtom } from '@/store/user.atom';

import { getStateMapVoteData } from '@/apis/map';

enum HigherFlagColors {
  Red = '#ee7c7c',
  Green = '#78c388',
  DEFAULT_GRAY = '#8a8a8a',
}

interface MapProps {
  billId: number | string;
  setOverall: (overall: any) => void;
  chamber: string;
}

const mapRatio = 0.6;
const margin = { top: 10, bottom: 10, left: 10, right: 10 };

// function parseAndRound(value: string) {
//   const num = Number.parseFloat(value);
//   return num % 1 === 0 ? `${num.toFixed(0)}%` : `${num.toFixed(2)}%`;
// }

const StateBillMap: React.FC<MapProps> = (props) => {
  const { billId, chamber, setOverall } = props;

  const [user] = useRecoilState(userAtom);

  const [federalMapVoteData, setFederalMapVoteData] = useState<any>([]);
  const [map, setMap] = useState({
    loading: false,
    fontSize: 10,
    upperChamberFeatCollection: null,
    lowerChamberFeatCollection: null,
  });

  const parentMap: any = useMemo(() => {
    return chamber === 'upper'
      ? map.upperChamberFeatCollection
      : map.lowerChamberFeatCollection;
  }, [chamber, map.lowerChamberFeatCollection, map.upperChamberFeatCollection]);

  const { isLoading: isMapLoading } = useQuery({
    queryKey: ['get-state-map-data'],
    queryFn: async () => {
      setMap((prev) => ({ ...prev, loading: true }));

      const params = {
        state: user?.state,
      };

      const reqData = {
        billId,
      };

      try {
        const response: any = await getStateMapVoteData(params, reqData);
        setOverall(response.data.overall || []);

        setFederalMapVoteData(response);
        setMap((prev) => ({
          ...prev,
          loading: false,
        }));

        const [lower, upper]: any = await Promise.all([
          axios.get(response?.map?.LC),
          axios.get(response?.map?.UC),
        ]).catch((_err) => {
          toast.error('error-lower-upper');
        });

        await setMap((prev) => ({
          ...prev,
          upperChamberFeatCollection: upper?.data,
          lowerChamberFeatCollection: lower?.data,
          loading: false,
        }));

        return response;
      } catch (error) {
        toast.error('Something went wrong, please try again later!');
        setMap((prev) => ({ ...prev, loading: false }));
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const billFeatures: any = federalMapVoteData?.data?.districtResults;

  const billFeatureIds = useMemo(
    () => billFeatures?.map((dict: any) => dict['districtId']),
    [billFeatures],
  );

  const featIdentifier = chamber === 'upper' ? 'SLDUST' : 'SLDLST';

  const renderFeaturePercentage = useCallback(
    (feature: any) => {
      const district = billFeatures.find(
        (d: any) => d['districtId'] === feature?.properties[featIdentifier],
      );

      if (district) {
        const num = Math.max(
          district.agreePercentage,
          district.disagreePercentage,
        );
        return num % 1 === 0 ? `${num.toFixed(0)}%` : `${num.toFixed(2)}%`;
      } else return '0%';
    },
    [billFeatures, featIdentifier],
  );

  const renderFeatureFillColor = useCallback(
    (feature: any) => {
      const district = billFeatures?.find(
        (d: any) => d['districtId'] === feature?.properties[featIdentifier],
      );

      if (!district) return HigherFlagColors.DEFAULT_GRAY;

      switch (district.higherFlag) {
        case 1:
          return HigherFlagColors.Green;
        case 2:
          return HigherFlagColors.Red;
        default:
          return HigherFlagColors.DEFAULT_GRAY;
      }
    },
    [billFeatures, featIdentifier],
  );

  const dataForFeaturePercentageText = useCallback(
    (_mapFeature: any) => {
      return (
        parentMap?.features?.filter((feature: any) =>
          billFeatureIds?.includes(feature.properties[featIdentifier]),
        ) || []
      );
    },
    [billFeatureIds, featIdentifier, parentMap?.features],
  );

  const drawMap = useCallback(() => {
    if (isMapLoading) return;

    d3.select('.viz').selectAll('svg').remove();

    let width = parseInt(d3.select('.viz').style('width'));
    const height = width * mapRatio;
    width = width - margin.left - margin.right;

    const svg = d3
      .select('.viz')
      .append('svg')
      .attr('class', 'center-container')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.left + margin.right);

    const g = svg
      .append('g')
      .attr('class', 'center-container center-items us-state')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const projection = geoAlbersUsa();
    const pathGenerator = geoPath().projection(projection);

    const states = g
      .append('g')
      .attr('id', 'state-districts')
      .selectAll('path')
      .data(parentMap?.features || [])
      .enter();

    states
      .append('path')
      .attr('key', (feature: any) => feature.properties['STATEFP'])
      .attr(
        'id',
        (feature: any) => `state_st_${feature?.properties['STATEFP']}`,
      )
      .attr('d', pathGenerator)
      .attr('class', 'state-feature')
      .attr('fill', renderFeatureFillColor);

    states
      .append('path')
      .attr('d', pathGenerator)
      .attr('class', 'state-outer-border');

    g.append('g')
      .selectAll('text')
      .data(dataForFeaturePercentageText)
      .enter()
      .append('text')
      .attr('x', (feature: any) => pathGenerator.centroid(feature)[0])
      .attr('y', (feature: any) => pathGenerator.centroid(feature)[1])
      .attr('dy', '.35em')
      .attr('class', 'feature-percentage-value')
      .text(renderFeaturePercentage)
      .attr(
        'font-size',
        (_d: any) => `${5 / Math.sqrt(d3.zoomTransform(svg.node()).k)}px`,
      )
      .attr('text-anchor', '');

    // **Calculate bounds, scale, and translation for initial zoom**
    const bounds = pathGenerator.bounds(parentMap); // Get the bounds of the state
    const dx = bounds[1][0] - bounds[0][0]; // Width of the bounds
    const dy = bounds[1][1] - bounds[0][1]; // Height of the bounds
    const x = (bounds[0][0] + bounds[1][0]) / 2; // Midpoint x
    const y = (bounds[0][1] + bounds[1][1]) / 2; // Midpoint y
    const initialScale = Math.min(width / dx, height / dy); // Scale based on the container size
    const translate = [
      width / 2 - initialScale * x,
      height / 2 - initialScale * y,
    ];

    const zoom = d3
      .zoom()
      .scaleExtent([initialScale, 40]) // Set the initial scale as the minimum, allowing only zooming in
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on('zoom', (event: any) => {
        g.attr('transform', event.transform);
        g.selectAll('.feature-percentage-value').attr(
          'font-size',
          (_d: any) => `${5 / Math.sqrt(event.transform.k)}px`,
        );
      });

    // Apply the initial transform (scale and translate)
    svg
      .call(zoom)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(translate[0], translate[1])
          .scale(initialScale),
      );
  }, [
    isMapLoading,
    parentMap,
    renderFeatureFillColor,
    dataForFeaturePercentageText,
    renderFeaturePercentage,
  ]);

  React.useEffect(() => {
    drawMap();
  }, [drawMap]);

  return (
    <div className='w-full flex flex-col h-full relative'>
      <div
        className={cn('hidden w-full h-full absolute top-0 left-0 z-50', {
          block: isMapLoading || map.loading,
        })}
      >
        <div className='w-full h-1/2 bg-transparent z-50'>
          <Loading />
        </div>
      </div>

      <div className={cn('viz  relative h-full', {})}></div>
    </div>
  );
};

export default React.memo(StateBillMap);
