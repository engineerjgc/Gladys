import get from 'get-value';

import { DeviceFeatureCategoriesIcon } from './consts';

/**
 * The icon a device feature draws.
 *
 * An icon is a function of the exact category/type PAIR, and a pair the map
 * does not carry falls back. This was resolved inline in three dozen places,
 * each with its own fallback and two of them passing the fallback as a
 * positional argument that `get-value` reads as an options object — so those
 * two had no fallback at all and rendered `fe fe-undefined` for any pair the
 * map happened not to hold.
 *
 * One place to ask means one place to change, which is what makes a
 * per-feature icon override a small change rather than a sweep.
 *
 * @param {object} deviceFeature - The feature, needing `category` and `type`.
 * @param {string} [fallback] - Drawn when the pair is not in the map.
 * @returns {string} The icon name, without the `fe-` prefix.
 * @example
 * <i class={`fe fe-${getFeatureIcon(deviceFeature)}`} />
 */
export function getFeatureIcon(deviceFeature, fallback = 'sliders') {
  if (!deviceFeature) {
    return fallback;
  }
  return get(DeviceFeatureCategoriesIcon, `${deviceFeature.category}.${deviceFeature.type}`, {
    default: fallback,
  });
}

export default getFeatureIcon;
