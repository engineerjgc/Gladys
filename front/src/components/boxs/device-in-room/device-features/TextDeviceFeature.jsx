import { Text, Localizer } from 'preact-i18n';
import get from 'get-value';

import { DEVICE_FEATURE_TYPES } from '../../../../../../server/utils/constants';
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
 *
 * A SECRET is the same control with the value taken away: masked, always empty,
 * and never bound to a state, because there is no state — device.setValue
 * refuses to persist one. Typing a new value replaces whatever the appliance
 * holds; the box goes back to empty because Gladys genuinely does not know what
 * is there, which is the honest thing to show.
 */
const TextDeviceFeature = ({ children, ...props }) => {
  const { deviceFeature } = props;
  const { category, type } = deviceFeature;
  const isSecret = type === DEVICE_FEATURE_TYPES.TEXT.SECRET;

  function updateValue(e) {
    props.updateValueWithDebounce(deviceFeature, e.target.value);
    if (isSecret) {
      // Cleared straight away: leaving it on screen is the shoulder-surfing
      // problem masking was for, and there is nothing to display afterwards.
      e.target.value = '';
    }
  }

  return (
    <tr>
      <td>
        <i class={`fe fe-${get(DeviceFeatureCategoriesIcon, `${category}.${type}`, { default: 'type' })}`} />
      </td>
      <td>{props.rowName}</td>

      <td class="py-0">
        <div class="d-flex justify-content-end">
          {isSecret ? (
            <Localizer>
              <input
                type="password"
                autocomplete="new-password"
                placeholder={<Text id="deviceFeature.secretPlaceholder" />}
                class="form-control text-right"
                onChange={updateValue}
                readOnly={deviceFeature.read_only}
              />
            </Localizer>
          ) : (
            <input
              type="text"
              value={deviceFeature.last_value_string || ''}
              class="form-control text-right"
              onChange={updateValue}
              readOnly={deviceFeature.read_only}
            />
          )}
        </div>
      </td>
    </tr>
  );
};

export default TextDeviceFeature;
