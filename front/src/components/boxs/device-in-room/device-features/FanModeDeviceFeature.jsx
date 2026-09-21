import { Text } from 'preact-i18n';

import { FAN_MODE } from '../../../../../../server/utils/constants';
import { getFeatureIcon } from '../../../../utils/getFeatureIcon';

const FanModeDeviceFeature = ({ children, ...props }) => {
  const { deviceFeature } = props;
  const { category, type } = deviceFeature;

  function updateValue(e) {
    props.updateValueWithDebounce(deviceFeature, Number(e.currentTarget.value));
  }

  const modes = Object.values(FAN_MODE);

  return (
    <tr>
      <td>
        <i class={`fe fe-${getFeatureIcon(deviceFeature, 'wind')}`} />
      </td>
      <td>{props.rowName}</td>

      <td class="py-0">
        <div class="d-flex justify-content-end">
          <div class="form-group mb-0">
            <select value={deviceFeature.last_value} onChange={updateValue} class="form-control form-control-sm">
              {modes.map(mode => (
                <option key={mode} value={mode}>
                  <Text id={`deviceFeatureValue.category.fan.mode.${mode}`} />
                </option>
              ))}
            </select>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default FanModeDeviceFeature;
