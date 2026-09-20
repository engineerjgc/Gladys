import { Text } from 'preact-i18n';
import cx from 'classnames';

import { smartRound } from '../../../../../../server/utils/units';

import style from './style.css';
import { getFeatureIcon } from '../../../../utils/getFeatureIcon';

const MultiLevelDeviceType = ({ children, ...props }) => {
  function updateValue(e) {
    props.updateValueWithDebounce(props.deviceFeature, e.target.value);
  }

  return (
    <tr>
      <td>
        <i class={`fe fe-${getFeatureIcon(props.deviceFeature, 'arrow-right')}`} />
      </td>
      <td>{props.rowName}</td>

      <td class="text-right py-0">
        <div class="col d-flex align-items-center justify-content-end">
          <input
            type="range"
            value={props.deviceFeature.last_value}
            onChange={updateValue}
            class={cx('custom-range', style.rangeInput)}
            step="1"
            min={props.deviceFeature.min}
            max={props.deviceFeature.max}
          />
          <span class="ml-2 text-right">
            {props.deviceFeature.unit ? (
              <span>
                {`${smartRound(props.deviceFeature.last_value)} `}
                <Text id={`deviceFeatureUnitShort.${props.deviceFeature.unit}`} />
              </span>
            ) : (
              <span>{smartRound(props.deviceFeature.last_value)}</span>
            )}
          </span>
        </div>
      </td>
    </tr>
  );
};

export default MultiLevelDeviceType;
