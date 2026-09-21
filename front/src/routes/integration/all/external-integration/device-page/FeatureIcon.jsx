import { Component } from 'preact';
import { Text, Localizer } from 'preact-i18n';

import IconSelector from '../../../../../components/scene/IconSelector';
import { getFeatureIcon } from '../../../../../utils/getFeatureIcon';

/**
 * One feature's icon, on the device editor of an external integration.
 *
 * The definition of a feature belongs to the integration — its name, category,
 * unit and bounds all come from the appliance — but the PICTURE is the user's,
 * for the same reason the room is: it is a property of how they read their own
 * dashboard rather than of the thing being read.
 *
 * It is offered here because this is the only editor the devices of an
 * external integration ever reach. The icon column and the picker were added
 * against `UpdateDeviceFeature`, which serves the MQTT, Tasmota, Tuya, Xiaomi,
 * MELCloud, Broadlink and Bluetooth screens — so an installation whose devices
 * all arrive through integrations could not use the feature at all.
 *
 * The chosen value is cleared to null, never to an empty string: null means
 * "work it out from the category and type", where "" is a choice of nothing
 * and draws no glyph.
 */
class FeatureIcon extends Component {
  state = { opened: false };

  toggle = () => this.setState(previous => ({ opened: !previous.opened }));

  choose = e => {
    this.props.updateFeatureIcon(this.props.featureIndex, e.target.value);
    this.setState({ opened: false });
  };

  reset = () => {
    this.props.updateFeatureIcon(this.props.featureIndex, null);
    this.setState({ opened: false });
  };

  render({ feature }, { opened }) {
    return (
      <div class="mb-2">
        <div class="d-flex align-items-center">
          <Localizer>
            <button
              type="button"
              class="btn btn-link p-0 mr-3 text-decoration-none"
              onClick={this.toggle}
              title={<Text id="editDeviceForm.changeIconLabel" />}
            >
              <i class={`fe fe-${getFeatureIcon(feature)}`} />
            </button>
          </Localizer>
          <span>{feature.name}</span>
        </div>
        {opened && (
          <div class="mt-2">
            <IconSelector value={feature.icon} onChange={this.choose} />
            {feature.icon && (
              <button type="button" class="btn btn-sm btn-outline-secondary mt-2" onClick={this.reset}>
                <Text id="editDeviceForm.useDefaultIcon" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default FeatureIcon;
