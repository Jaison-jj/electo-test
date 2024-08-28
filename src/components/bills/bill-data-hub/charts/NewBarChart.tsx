import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const chartData = [
  {
    name: 'YAY',
    uv: 4000,
  },
  {
    name: 'NAY',
    pv: 2400,
  },
];

interface Props {
  data: any[];
  bar1DataKey: string;
  bar2DataKey?: string | any;
  yAxisTickFormatter?: any;
  yAxisTickDomain?: any;
}

const NewBarChart = (props: Props) => {
  const {
    data = chartData,
    bar1DataKey,
    bar2DataKey,
    yAxisTickFormatter,
    yAxisTickDomain = [0, 'auto'],
  } = props;

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          // right: 30,
          // left: 20,
          // bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <XAxis
          axisLine={false}
          tickMargin={10}
          dataKey='name'
          tick={{ fontSize: 12 }}
          tickLine={false}
          // padding={{ left: 30, right: 30 }}
        />
        <YAxis
          axisLine={false}
          tickMargin={10}
          tickLine={false}
          tick={{ fontSize: 12 }}
          tickCount={5}
          domain={yAxisTickDomain}
          tickFormatter={
            yAxisTickFormatter
              ? (tick) => yAxisTickFormatter(tick)
              : (null as any)
          }
        />
        <Tooltip itemStyle={{ textTransform: 'capitalize' }} />

        <Bar
          dataKey={bar1DataKey}
          fill='#77c388'
          activeBar={<Rectangle fill='#77c388' stroke='gray' />}
          barSize={5}
        />
        <Bar
          dataKey={bar2DataKey}
          fill='#ee7c7c'
          activeBar={<Rectangle fill='#ee7c7c' stroke='gray' />}
          barSize={5}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default NewBarChart;
