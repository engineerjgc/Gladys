import { Component } from 'preact';
import cx from 'classnames';
import { Text } from 'preact-i18n';
import { DEVICE_FEATURE_CATEGORIES } from '../../../../../../server/utils/constants';
import style from './style.css';
import { getFeatureIcon } from '../../../../utils/getFeatureIcon';

// Television push buttons are remote-control keys: the row already names them ("Channel up",
// "Play", ...), so the button only shows the key icon.
const REMOTE_CONTROL_CATEGORIES = [DEVICE_FEATURE_CATEGORIES.TELEVISION];

/*
 * A `button` feature is one thing, so it is drawn once: the button carries the
 * feature's own name and the row shows nothing else.
 *
 * It used to render an icon, the name, and a button labelled "Push" — three
 * representations of the same action, none of which said what pressing it
 * would do. The name is editable per feature, so labelling the button with it
 * lets an integration (or a user) call it "Apply" and have the row read as
 * one control rather than a caption with a generic button beside it.
 */
const SELF_LABELLING_CATEGORIES = [DEVICE_FEATURE_CATEGORIES.BUTTON];

/*
 * A button whose state is 0 is disabled: there is nothing to press for.
 *
 * Opt-in by publishing. A feature that never publishes a state has
 * `last_value` null and stays enabled, which is every existing button; an
 * integration that knows whether pressing would do anything — "apply the
 * changes I am holding" — says so by publishing 1 or 0.
 */
const isDisabled = deviceFeature => deviceFeature.last_value === 0;

class PushDeviceComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
  push = async () => {
    await this.setState({ loading: true });
    this.props.updateValue(this.props.deviceFeature, 1);
    setTimeout(() => {
      this.setState({ loading: false });
    }, 350);
  };

  render(props, { loading }) {
    const { category, type } = props.deviceFeature;
    const icon = getFeatureIcon(props.deviceFeature, 'circle');
    const iconOnly = REMOTE_CONTROL_CATEGORIES.includes(category);
    const selfLabelling = SELF_LABELLING_CATEGORIES.includes(category);
    const disabled = isDisabled(props.deviceFeature);

    const button = (
      <button
        onClick={this.push}
        type="button"
        disabled={disabled}
        aria-label={iconOnly ? props.rowName : undefined}
        title={iconOnly ? props.rowName : undefined}
        class={cx('btn', 'btn-outline-success', 'btn-sm', style.btnLoading, {
          'btn-loading': loading
        })}
      >
        {!selfLabelling && <i class={`fe fe-${icon}`} />}
        {selfLabelling && props.rowName}
        {!iconOnly && !selfLabelling && (
          <span>
            {' '}
            <Text id="dashboard.boxes.devicesInRoom.pushButton" />
          </span>
        )}
      </button>
    );

    if (selfLabelling) {
      return (
        <tr>
          <td colSpan="3" class="text-right">
            {button}
          </td>
        </tr>
      );
    }

    return (
      <tr>
        <td>
          <i class={`fe fe-${icon}`} />
        </td>
        <td>{props.rowName}</td>
        <td class="text-right">{button}</td>
      </tr>
    );
  }
}

export default PushDeviceComponent;
