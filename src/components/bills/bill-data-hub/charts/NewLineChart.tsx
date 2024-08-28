import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatTickNumber } from '@/lib/helper';

interface Props {
  data: any[];
  line1DataKey?: string;
  line2DataKey?: string | any;
  yAxisTickFormatter?: any;
  yAxisTickDomain?: any;
  xAxisTickAxisAngle?: number;
}

const NewLineChart = (props: Props) => {
  const {
    data,
    line1DataKey,
    line2DataKey,
    xAxisTickAxisAngle = 0,
    yAxisTickDomain = [0, 'auto'],
    // yAxisTickFormatter,
  } = props;
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 10,
          // left: 20,
          // bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <XAxis
          axisLine={false}
          tickMargin={10}
          dataKey='name'
          tick={{ fontSize: 12 }}
          tickLine={false}
          padding={{ left: 0, right: 10 }}
          angle={xAxisTickAxisAngle}
          interval={0}
        />
        <YAxis
          axisLine={false}
          tickMargin={10}
          tickLine={false}
          tick={{ fontSize: 12 }}
          // padding={{ top: 50, }}
          interval={1} //adjust this for number of segments on the y axis to adjust the tick value
          domain={yAxisTickDomain}
          tickFormatter={(tick) => formatTickNumber(tick)}
        />
        <Tooltip itemStyle={{ textTransform: 'capitalize' }} />
        <Line
          type='linear'
          dataKey={line1DataKey}
          stroke='#ee7c7c'
          activeDot={{ r: 8 }}
          dot={{ fill: '#ee7c7c' }}
        />
        <Line
          type='linear'
          dataKey={line2DataKey}
          stroke='#82ca9d'
          activeDot={{ r: 8 }}
          dot={{ fill: '#82ca9d' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default NewLineChart;
