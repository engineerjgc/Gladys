/**
 * Whether a row on a devices box is controllable, or only readable.
 *
 * A box may say that one of its rows is governed by another feature:
 * `feature_enabled_by[<selector>] = { feature, value }`. The row is a control
 * while that feature reads that value, and a reading otherwise.
 *
 * WHAT IT IS FOR. A pump driven by plant logic has an Auto/Manual mode beside
 * it. In Auto the logic owns the output and a person must be able to SEE what
 * it is doing without being able to change it; in Manual the same row is a
 * switch again. Gladys had no way to express that: `read_only` is fixed when
 * a device is adopted, and no widget has ever looked at another feature.
 *
 * IT IS NOT A SAFEGUARD, and must not be treated as one. A dashboard decides
 * what to draw; whatever is on the other end decides what it will accept. The
 * integration refuses the write as well, exactly as the UniFi integration
 * refuses a protected SSID it never displays in the first place.
 *
 * A rule naming a feature the box no longer carries leaves the row
 * controllable. Silently locking a control because a selector went stale is
 * the worse failure: a pump nobody can switch, and nothing on screen saying
 * why.
 *
 * @param {object} deviceFeature - The feature whose row is being drawn.
 * @param {object} box - The box's configuration.
 * @param {Array} deviceFeatures - Every feature the box holds, with its state.
 * @returns {boolean} true when the row may be operated.
 * @example
 * const enabled = isFeatureEnabled(feature, box, deviceFeatures);
 */
export function isFeatureEnabled(deviceFeature, box = {}, deviceFeatures = []) {
  const rule = (box.feature_enabled_by || {})[deviceFeature.selector];
  if (!rule || !rule.feature) {
    return true;
  }
  const governing = deviceFeatures.find(f => f.selector === rule.feature);
  if (!governing) {
    return true;
  }
  return currentValue(governing) === `${rule.value}`;
}

/**
 * A feature's value as a string, whichever column it lives in.
 *
 * A select or a text feature holds a string, everything else a number, and a
 * rule is compared as text so one comparison serves both: a mode reads
 * `"Manual"`, a binary reads `"1"`.
 *
 * @param {object} deviceFeature - The feature to read.
 * @returns {string} The current value, or '' when there is none.
 * @example
 * currentValue({ last_value: 1 }); // '1'
 */
export function currentValue(deviceFeature = {}) {
  const { last_value_string: text, last_value: value } = deviceFeature;
  if (text !== null && text !== undefined) {
    return `${text}`;
  }
  if (value !== null && value !== undefined) {
    return `${value}`;
  }
  return '';
}

export default isFeatureEnabled;
