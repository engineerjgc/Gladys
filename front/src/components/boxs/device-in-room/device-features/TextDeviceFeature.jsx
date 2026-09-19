import get from 'get-value';

import { DeviceFeatureCategoriesIcon } from '../../../../utils/consts';

/**
 * A free-text value the user can edit from a dashboard. The server already stores
 * text states (device.setValue writes last_value_string for a text feature, and an
 * integration publishes them as { text }); this is the control that was missing, so
 * until now a text feature could be displayed but never set.
 *
 * Committed on change rather than on every keystroke: an input debounced per
 * character sends every prefix of what is being typed, and a text feature is
 * usually a name or an address somewhere downstream, where a stream of partial
 * values is not harmless.
 */
const TextDeviceFeature = ({ children, ...props }) => {
  const { deviceFeature } = props;
  const { category, type } = deviceFeature;

  function updateValue(e) {
    props.updateValueWithDebounce(deviceFeature, e.target.value);
  }

  return (
    <tr>
      <td>
        <i class={`fe fe-${get(DeviceFeatureCategoriesIcon, `${category}.${type}`, { default: 'type' })}`} />
      </td>
      <td>{props.rowName}</td>

      <td class="py-0">
        <div class="d-flex justify-content-end">
          <input
            type="text"
            value={deviceFeature.last_value_string || ''}
            class="form-control text-right"
            onChange={updateValue}
            readOnly={deviceFeature.read_only}
          />
        </div>
      </td>
    </tr>
  );
};

export default TextDeviceFeature;
