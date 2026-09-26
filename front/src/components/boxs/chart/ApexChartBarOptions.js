import { fixedRangeBand } from './fixedRangeBand';
import { yAxisFormatter } from './yAxisFormatter';

const getApexChartBarOptions = ({
  displayAxes,
  hideLegend,
  series,
  colors,
  locales,
  defaultLocale,
  yAxisFormatter: customYAxisFormatter,
  disableZoom,
  yAxisMin,
  yAxisMax
}) => {
  const options = {
    chart: {
      locales,
      defaultLocale,
      type: 'bar',
      fontFamily: 'inherit',
      height: displayAxes ? 200 : 100,
      parentHeightOffset: 0,
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: !displayAxes
      },
      animations: {
        enabled: false
      },
      stacked: true,
      zoom: {
        enabled: !disableZoom
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '90%'
      }
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1
    },
    series,
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4
      },
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
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
        formatter: customYAxisFormatter || yAxisFormatter
      }
    },
    colors,
    legend: {
      show: hideLegend ? false : displayAxes,
      position: 'bottom'
    }
  };
  return options;
};

export { getApexChartBarOptions };
