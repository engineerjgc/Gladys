import { fixedRangeBand } from './fixedRangeBand';
import { yAxisFormatter } from './yAxisFormatter';

const getApexChartAreaOptions = ({
  displayAxes,
  height,
  series,
  colors,
  locales,
  defaultLocale,
  yAxisMin,
  yAxisMax
}) => {
  const options = {
    chart: {
      locales,
      defaultLocale,
      type: 'area',
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
      opacity: 0.16,
      type: 'solid'
    },
    stroke: {
      width: 2,
      lineCap: 'round',
      curve: 'smooth'
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
    annotations: fixedRangeBand(yAxisMin, yAxisMax),
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

export { getApexChartAreaOptions };
