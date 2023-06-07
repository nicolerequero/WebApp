import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Title from './TitleComponent';
import moment from 'moment';




export default function Chart(chartData) {
  const theme = useTheme();
  // Generate Collection Data
function createData(date, averageTotalAmount) {
  return { date, averageTotalAmount};
}

const data = chartData.data.map(item => createData(item.date, item.averageTotalAmount));
const formatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

  return (
    <React.Fragment>
      <Title>Average Transaction Sales Per Week In A Monthly Basis</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="date"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
         <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
            tickFormatter={value => formatter.format(value)}
            label={{ angle: -90, position: 'insideLeft' }}
          />
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="averageTotalAmount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}