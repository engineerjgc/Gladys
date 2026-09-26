/*
 * A fixed scale's range, drawn.
 *
 * With the Y axis pinned to a feature's working range, a line at 86% sits
 * 86% of the way up - but nothing on the chart says where 0% and 100% are,
 * so a reader cannot tell that is what it means. A faint tint over exactly
 * that range makes the plot area's own edges the reference.
 *
 * Only when BOTH bounds are set, which is only when the box asks for a fixed
 * scale: an auto-scaled chart has no range worth drawing, and drawing its
 * data extent would make noise look like a boundary.
 *
 * `color` is the theme's muted colour, resolved by the caller from the page.
 */
export const fixedRangeBand = (yAxisMin, yAxisMax, color = '#7c8396') => {
  if (!Number.isFinite(yAxisMin) || !Number.isFinite(yAxisMax) || yAxisMax <= yAxisMin) {
    return undefined;
  }
  return {
    yaxis: [
      {
        y: yAxisMin,
        y2: yAxisMax,
        fillColor: color,
        opacity: 0.1,
        borderColor: 'transparent',
        strokeDashArray: 0
      }
    ]
  };
};
