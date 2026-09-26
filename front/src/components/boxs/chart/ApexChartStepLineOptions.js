import { fixedRangeBand } from './fixedRangeBand';
import { yAxisFormatter } from './yAxisFormatter';

const getApexChartStepLineOptions = ({
  height,
  displayAxes,
  series,
  colors,
  locales,
  defaultLocale,
  yAxisMin,
  yAxisMax,
  yAxisRangeColor
}) => {
  const options = {
    chart: {
      locales,
      defaultLocale,
      type: 'line',
      fontFamily: 'inherit',
      height,
      parentHeightOffset: 0,
      sparkline: {
        enabled: !displayAxes
      },
      toolbar: {
        show: false
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1
    },
    stroke: {
      width: 2,
      curve: 'stepline'
    },
    series,
    grid: {
      strokeDashArray: 4,
      padding: {
        left: -4
      }
    },
    xaxis: {
      labels: {
        padding: 0,
        datetimeUTC: false
      },
      tooltip: {
        enabled: false
      },
      axisBorder: {
        show: false
      },
      type: 'datetime'
    },
    annotations: fixedRangeBand(yAxisMin, yAxisMax, yAxisRangeColor),
    yaxis: {
      /*
       * Pinned when the box asks for a fixed scale, automatic otherwise.
       * ApexCharts reads `undefined` as "work it out", so an absent bound
       * leaves the behaviour every existing chart has always had.
       */
      min: Number.isFinite(yAxisMin) ? yAxisMin : undefined,
      max: Number.isFinite(yAxisMax) ? yAxisMax : undefined,
      labels: {
        padding: 4,
        formatter: yAxisFormatter
      }
    },
    colors,
    legend: {
      show: displayAxes,
      position: 'bottom'
    }
  };
  return options;
};

export { getApexChartStepLineOptions };
