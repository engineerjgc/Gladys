import { Text } from 'preact-i18n';
import get from 'get-value';

import { DeviceFeatureCategoriesIcon } from '../../../../utils/consts';
import style from './style.css';

/**
 * An editable number.
 *
 * The value is shown to at least one decimal when it is integral: `90` reads as
 * an ordinal or a setting, `90.0` reads as the measured quantity these features
 * usually are. Anything finer keeps the precision it has rather than being
 * rounded to look tidy, and an absent value stays an empty box rather than
 * becoming a `0.0` the device never reported.
 */
const formatValue = value => {
  if (value === null || value === undefined) {
    return '';
  }
  return Number.isInteger(value) ? value.toFixed(1) : value;
};

const NumberDeviceFeature = ({ children, ...props }) => {
  const { deviceFeature } = props;
  const { unit } = deviceFeature;

  function updateValue(e) {
    props.updateValueWithDebounce(deviceFeature, e.target.value);
  }

  return (
    <tr>
      <td>
        <i
          class={`fe fe-${get(
            DeviceFeatureCategoriesIcon,
            `${deviceFeature.category}.${deviceFeature.type}`,
            { default: 'hash' }
          )}`}
        />
      </td>
      <td>{props.rowName}</td>

      <td class="py-0">
        <div class="d-flex justify-content-end align-items-center">
          <input
            type="number"
            value={formatValue(deviceFeature.last_value)}
            class={`form-control text-center px-1 ${style.numberInput}`}
            onChange={updateValue}
            step={1}
            min={deviceFeature.min}
            max={deviceFeature.max}
          />
          {unit && (
            <span class="ml-2 text-muted">
              <Text id={`deviceFeatureUnitShort.${unit}`} />
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};

export default NumberDeviceFeature;
