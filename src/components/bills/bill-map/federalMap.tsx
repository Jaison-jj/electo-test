'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as d3 from 'd3';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import Loading from '@/components/utils/Loading';

import usStates from '@/../public/geojson/states.json';
import { getFederalMapVoteData } from '@/apis/map';

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

const FederalBillMap: React.FC<MapProps> = (props: any) => {
  const { billId, setOverall } = props;

  const [federalMapVoteData, setFederalMapVoteData] = useState<any>([]);
  const [map, setMap] = useState({
    congressional: null,
    loading: false,
    mode: 'federal',
    currentState: null,
    fontSize: 10,
    selectedFeature: null,
    congMapUrl: '',
  });

  const parentMap = useMemo(() => {
    return map.mode === 'federal' ? usStates : map.congressional;
  }, [map.mode, map.congressional]);

  const { isLoading: isMapLoading } = useQuery({
    queryKey: ['get-federal-map-data', map.currentState],
    queryFn: async () => {
      setMap((prev) => ({ ...prev, loading: true }));

      const params = {
        state: '',
      };

      const reqData = {
        billId,
      };

      try {
        const response: any = await getFederalMapVoteData(params, reqData);
        setOverall(response.data.overall || []);
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
    enabled: true,
  });

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
        const num = Math.max(
          district.agreePercentage,
          district.disagreePercentage,
        );
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
          return HigherFlagColors.Green;
        case 2:
          return HigherFlagColors.Red;
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
    if (isMapLoading || map.currentState) return;

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

    const statePercentagesGroup = g.append('g').attr('id', 'state-percentages');

    statePercentagesGroup
      .append('g')
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
        setMap((prev) => ({
          ...prev,
          loading: true,
        }));
        const params = {
          state: feature?.properties?.STUSPS,
        };
        const reqData = {
          billId,
        };

        const resultWithMapUrl: any = await getFederalMapVoteData(
          params,
          reqData,
        );
        const stateData = await axios.get(resultWithMapUrl?.map?.CD);

        const districtPercent = (featDist: any) => {
          const district = resultWithMapUrl.data.districtResults.find(
            (d: any) => d.districtId === featDist?.properties['CD118FP'],
          );

          if (district) {
            const num = Math.max(
              district.agreePercentage,
              district.disagreePercentage,
            );
            return num % 1 === 0 ? `${num.toFixed(0)}%` : `${num.toFixed(2)}%`;
          } else return '0%';
        };

        const ColorPalette: any = {
          1: '#78c388',
          2: '#ee7c7c',
          3: '#8a8a8a',
        };

        const districtColor = (featDist: any) => {
          const district = resultWithMapUrl.data.districtResults.find(
            (d: any) => d.districtId === featDist?.properties['CD118FP'],
          );
          return district ? ColorPalette[district.higherFlag] : '#c2c2c2';
        };

        g.select('#districts').remove();
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

        //remove the parent percentage to avoid overlapping
        // const nodes = g.selectAll('.feature-percentage-value').nodes();
        // nodes.forEach((node: any) => {
        //   if (feature.id !== node['__data__']?.id) return;
        //   d3.select(node).attr('class', 'hide-text-percentage');
        // });

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

        setMap((prev) => ({
          ...prev,
          loading: false,
          currentState: feature?.properties?.STATEFP,
        }));
      } catch (_error) {
        toast.error('Something went wrong fetching the state');
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
    map.currentState,
    map.fontSize,
    parentMap?.features,
    renderFeatureFillColor,
    dataForFeaturePercentageText,
    renderFeaturePercentage,
    federalBillFeatureIds,
    billId,
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

  return (
    <div className='w-full flex flex-col h-full relative'>
      <div className='mt-2 md:mt-0 ml-auto mb-2'>
        {map.currentState && (
          <button
            onClick={resetMap}
            className={cn(
              'bg-black text-xs text-white w-fit h-fit p-1 px-3 rounded-sm',
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

      <div className={cn('viz  relative h-full', {})}></div>
    </div>
  );
};

export default React.memo(FederalBillMap);
