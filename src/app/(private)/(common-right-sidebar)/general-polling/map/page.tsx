'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as d3 from 'd3';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { Info } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { firebaseAnalytics } from '@/lib/helper';
import { cn } from '@/lib/utils';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Loading from '@/components/utils/Loading';

import usStates from '@/../public/geojson/states.json';
import { getPollingWiseMapData } from '@/apis/generalPolling';

enum HigherFlagColors {
  Yellow = '#ffff00',
  Black = '#121315',
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

function parseAndRound(value: string) {
  const num = Number.parseFloat(value);
  return num % 1 === 0 ? `${num.toFixed(0)}%` : `${num.toFixed(2)}%`;
}

const GeneralPollingMap: React.FC<MapProps> = (props: any) => {
  const { searchParams } = props;
  const { pollId } = searchParams;

  const [federalMapVoteData, setFederalMapVoteData] = useState<any>([]);
  const [map, setMap] = useState({
    congressional: null,
    loading: false,
    mode: 'federal',
    currentState: null,
    fontSize: 10,
    selectedFeature: null, //state feature from the geoJson
    congMapUrl: '',
  });

  const parentMap = useMemo(() => {
    return map.mode === 'federal' ? usStates : map.congressional;
  }, [map.mode, map.congressional]);

  const { isLoading: isMapLoading } = useQuery({
    queryKey: ['get-general-poll-data', map.currentState],
    queryFn: async () => {
      setMap((prev) => ({ ...prev, loading: true }));

      try {
        const response: any = await getPollingWiseMapData({
          pollId: pollId,
          state: map.currentState,
        });
        setFederalMapVoteData(response);
        setMap((prev) => ({
          ...prev,
          loading: false,
        }));

        setMap((prev) => ({
          ...prev,
          // congressional: congData.data,
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
    enabled: false,
  });

  const { mutate, data: mapResponse } = useMutation({
    mutationFn: async (payload: any) => getPollingWiseMapData(payload),
    onSuccess: (res: any) => {
      setFederalMapVoteData(res);
      setMap((prev) => ({
        ...prev,
        loading: false,
      }));
    },
    onError(err: any) {
      toast('Error!', {
        description: err.response.data.message,
        duration: 2000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
    },
  });

  useEffect(() => {
    mutate({
      pollId,
      state: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const federalBillFeatures =
    map.mode === 'federal'
      ? federalMapVoteData?.data?.stateResults
      : federalMapVoteData?.data?.districtResults;

  const federalFeatureKey = map.mode === 'federal' ? 'stateId' : 'districtId';

  const federalBillFeatureIds = useMemo(
    () => federalBillFeatures?.map((dict: any) => dict[federalFeatureKey]),
    [federalBillFeatures, federalFeatureKey],
  );

  const mapChamber = map.mode === 'congressional' ? 'CD118FP' : 'STATEFP';

  const renderFeaturePercentage = useCallback(
    (feature: any) => {
      const district = federalBillFeatures.find(
        (d: any) => d[federalFeatureKey] === feature?.properties[mapChamber],
      );

      if (district) {
        const num = Number.parseFloat(district.higherPercentage);
        return num % 1 === 0 ? `${num.toFixed(0)}%` : `${num.toFixed(2)}%`;
      } else return '0%';
    },
    [federalBillFeatures, mapChamber, federalFeatureKey],
  );

  const renderFeatureFillColor = useCallback(
    (feature: any) => {
      const district = federalBillFeatures?.find(
        (d: any) => d[federalFeatureKey] === feature?.properties[mapChamber],
      );

      if (!district) return HigherFlagColors.DEFAULT_GRAY;

      switch (district.higherFlag) {
        case 1:
          return HigherFlagColors.Yellow;
        case 2:
          return HigherFlagColors.Black;
        case 3:
          return HigherFlagColors.Red;
        case 4:
          return HigherFlagColors.Green;
        default:
          return HigherFlagColors.DEFAULT_GRAY;
      }
    },
    [federalBillFeatures, mapChamber, federalFeatureKey],
  );

  const dataForFeaturePercentageText = useCallback(
    (_mapFeature: any) => {
      return (
        parentMap?.features?.filter((feature: any) =>
          federalBillFeatureIds?.includes(feature.properties['STATEFP']),
        ) || []
      );
    },
    [federalBillFeatureIds, parentMap?.features],
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

    const projectionTranslation = [width / 2, height / 2];
    const projectionScale = width;

    const projection = geoAlbersUsa()
      .translate(projectionTranslation)
      .scale(projectionScale);

    const pathGenerator = geoPath().projection(projection);

    const g = svg
      .append('g')
      .attr('class', 'center-container center-items us-state')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const states = g
      .append('g')
      .attr('id', 'states')
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
      .on('click', onClickFeature)
      .attr('fill', renderFeatureFillColor);

    states
      .append('path')
      .attr('d', pathGenerator)
      .attr('class', 'state-outer-border');

    // Draw initial state percentages
    const statePercentagesGroup = g.append('g').attr('id', 'state-percentages');

    statePercentagesGroup
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
        (_d: any) =>
          `${map.fontSize / Math.sqrt(d3.zoomTransform(svg.node()).k)}px`,
      )
      .attr('text-anchor', '');

    async function onClickFeature(_e: any, feature: any) {
      if (!federalBillFeatureIds.includes(feature?.properties?.STATEFP)) return;

      try {
        setMap((prev) => ({ ...prev, loading: true }));

        const data = { pollId, state: feature?.properties?.STUSPS };
        const resultWithMapUrl: any = await getPollingWiseMapData(data);
        const stateData = await axios.get(resultWithMapUrl?.map?.CD);

        const districtPercent = (featDist: any) => {
          const district = resultWithMapUrl.data.districtResults.find(
            (d: any) => d.districtId === featDist?.properties['CD118FP'],
          );
          if (district) {
            const num = Number.parseFloat(district.higherPercentage);
            return num % 1 === 0 ? `${num.toFixed(0)}%` : `${num.toFixed(2)}%`;
          } else return '0%';
        };

        const ColorPalette: any = {
          1: '#ffff00',
          2: '#121315',
          3: '#ee7c7c',
          4: '#78c388',
        };

        const districtColor = (featDist: any) => {
          const district = resultWithMapUrl.data.districtResults.find(
            (d: any) => d.districtId === featDist?.properties['CD118FP'],
          );
          return district ? ColorPalette[district.higherFlag] : '#c2c2c2';
        };

        // Remove previous district details
        g.select('#districts').remove();

        // Draw new districts and their labels
        const districtsGroup = g.append('g').attr('id', 'districts');

        districtsGroup
          .selectAll('path')
          .data(stateData.data.features)
          .enter()
          .append('path')
          .attr('d', pathGenerator)
          .attr('fill', districtColor)
          .attr('stroke', '#000')
          .attr('stroke-width', 0.2);

        districtsGroup
          .selectAll('text')
          .data(stateData.data.features)
          .enter()
          .append('text')
          .attr('x', (feature: any) => pathGenerator.centroid(feature)[0])
          .attr('y', (feature: any) => pathGenerator.centroid(feature)[1])
          .attr('dy', '.35em')
          .text(districtPercent)
          .attr('class', 'district-label')
          .attr(
            'font-size',
            (_d: any) => `${7 / Math.sqrt(d3.zoomTransform(svg.node()).k)}px`,
          )
          .attr('text-anchor', '');

        setMap((prev) => ({
          ...prev,
          loading: false,
          currentState: feature?.properties?.STATEFP,
        }));

        // Update the map zoom and position
        const bounds = pathGenerator.bounds(feature);
        const x = (bounds[0][0] + bounds[1][0]) / 2;
        const y = (bounds[0][1] + bounds[1][1]) / 2;
        const scale = 8;
        const translate = [width / 2 - scale * x, height / 2 - scale * y];

        svg
          .transition()
          .duration(750)
          .call(
            zoom.transform,
            d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale),
          );
      } catch (_error) {
        toast.error('Something went wrong');
        setMap((prev) => ({ ...prev, loading: false }));
      }
    }

    const zoom = d3
      .zoom()
      .scaleExtent([1, 40])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on('zoom', (event: any) => {
        g.attr('transform', event.transform);
        g.selectAll('.feature-percentage-value').attr(
          'font-size',
          (_d: any) => `${map.fontSize / Math.sqrt(event.transform.k)}px`,
        );
        g.selectAll('text.district-label').attr(
          'font-size',
          (_d: any) => `${6 / Math.sqrt(event.transform.k)}px`,
        );
      });

    svg.call(zoom);
  }, [
    isMapLoading,
    parentMap?.features,
    renderFeatureFillColor,
    dataForFeaturePercentageText,
    renderFeaturePercentage,
    map.fontSize,
    federalBillFeatureIds,
    pollId,
  ]);

  React.useEffect(() => {
    drawMap();
  }, [drawMap]);

  const resetMap = () => {
    drawMap();
    setMap((prev) => ({
      ...prev,
      currentState: null,
    }));
  };

  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  return (
    <div className='w-full flex flex-col h-full md:border-r md:border-r-gray-200 relative'>
      <title>General Poll-Map</title>
      <div className='flex flex-row justify-between p-2 mt-10 md:mt-0 items-center'>
        <div className='flex flex-col gap-2 '>
          <p className='text-sm'>{mapResponse?.data?.question?.question}</p>
          <div className='flex gap-2'>
            <div className='flex gap-1 text-xs items-center '>
              <span className='w-4 h-4 bg-[#ffff00] rounded-full block border border-gray-500' />
              <span>
                {parseAndRound(mapResponse?.data?.overall[0]?.percentage || 0)}
              </span>
            </div>
            <div className='flex gap-1 text-xs items-center '>
              <span className='w-4 h-4 bg-[#121315] rounded-full block border border-gray-300' />
              <span>
                {parseAndRound(mapResponse?.data?.overall[1]?.percentage || 0)}
              </span>
            </div>
            <div className='flex gap-1 text-xs items-center '>
              <span className='w-4 h-4 bg-[#ee7c7c] rounded-full block border border-gray-300' />
              <span>
                {parseAndRound(mapResponse?.data?.overall[2]?.percentage || 0)}
              </span>
            </div>
            <span className='w-4 h-4 bg-[#78c388] rounded-full block border border-gray-300' />

            <Popover>
              <PopoverTrigger className='w-4 h-4 '>
                <Info className='w-4 h-4' />
              </PopoverTrigger>
              <PopoverContent className='font-poppins w-fit flex flex-col gap-1'>
                <div className='flex gap-2 items-center '>
                  <span className='w-4 h-4 bg-[#ffff00] rounded-full block border border-gray-500'></span>
                  <span className='text-xs'>
                    {mapResponse?.data?.overall[0]?.answer || '...'}
                  </span>
                </div>
                <div className='flex gap-2 items-center '>
                  <span className='w-4 h-4 bg-[#121315] rounded-full block border border-gray-300'></span>
                  <span className='text-xs'>
                    {' '}
                    {mapResponse?.data?.overall[1]?.answer || '...'}
                  </span>
                </div>
                <div className='flex gap-2 items-center '>
                  <span className='w-4 h-4 bg-[#ee7c7c] rounded-full block border border-gray-300'></span>
                  <span className='text-xs'>
                    {' '}
                    {mapResponse?.data?.overall[2]?.answer || '...'}
                  </span>
                </div>
                <div className='flex gap-2 items-center '>
                  <span className='w-4 h-4 bg-[#78c388] rounded-full block border border-gray-300'></span>
                  <span className='text-xs'>50:50</span>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {map.currentState && (
          <button
            onClick={resetMap}
            className={cn(
              'bg-black text-xs text-white w-fit h-fit p-1 rounded-sm',
            )}
          >
            Reset
          </button>
        )}
      </div>

      <div
        className={cn('hidden w-full h-full absolute top-0 left-0 z-50', {
          block: isMapLoading || map.loading,
        })}
      >
        <div className='w-full h-1/2 bg-transparent z-50'>
          <Loading />
        </div>
      </div>

      <div className={cn('viz  relative h-full')}></div>
    </div>
  );
};

export default React.memo(GeneralPollingMap);
