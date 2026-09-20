import { Text } from 'preact-i18n';

import { getFanFeatureOptions } from '../../../../../../server/utils/constants';
import { getFeatureIcon } from '../../../../utils/getFeatureIcon';

const FanLabeledSelectDeviceFeature = ({ children, ...props }) => {
  const { deviceFeature } = props;
  const { category, type, min, max } = deviceFeature;

  function updateValue(e) {
    props.updateValueWithDebounce(deviceFeature, Number(e.currentTarget.value));
  }

  const options = getFanFeatureOptions(type, min, max);

  return (
    <tr>
      <td>
        <i class={`fe fe-${getFeatureIcon({ category, type }, 'wind')}`} />
      </td>
      <td>{props.rowName}</td>

      <td class="py-0">
        <div class="d-flex justify-content-end">
          <div class="form-group mb-0">
            <select value={deviceFeature.last_value} onChange={updateValue} class="form-control form-control-sm">
              {options.map(value => (
                <option key={value} value={value}>
                  <Text id={`deviceFeatureValue.category.${category}.${type}.${value}`} />
                </option>
              ))}
            </select>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default FanLabeledSelectDeviceFeature;
