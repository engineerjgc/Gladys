import { Component } from 'preact';
import { Text, Localizer } from 'preact-i18n';
import cx from 'classnames';

import { DEVICE_FEATURE_TYPES } from '../../../../../../server/utils/constants';
import { getFeatureIcon } from '../../../../utils/getFeatureIcon';
import style from './style.css';

/**
 * A free-text value the user can edit from a dashboard, and its sibling for a
 * passphrase, a token or an API key.
 *
 * WHAT IS BEING TYPED IS HELD LOCALLY, and that is not a refinement — without
 * it the control does not work at all. An input whose value comes straight
 * from a prop is rewritten on the next render, and this row re-renders
 * whenever its device does: every state that arrives, every poll. Each
 * keystroke was reverted before it could be seen, so the box looked as though
 * it were simply refusing input.
 *
 * The draft is held until the APPLIANCE ANSWERS, not until the field loses
 * focus. Clearing it on blur shows the old value for as long as the round trip
 * takes — a second or two against a cloud controller — so the field appears to
 * discard the edit and then take it back. Whatever arrives from the appliance
 * wins, which is what makes a Revert elsewhere on the form reach this box.
 *
 * A SECRET is the same control with the characters masked. It is sensitive
 * rather than unreadable: the value is there, a dashboard simply does not
 * print it for anyone walking past, and the eye reveals it when its owner
 * asks. Revealing lasts until it is switched off — typing does not re-hide the
 * value, because somebody checking a passphrase as they correct it is exactly
 * who the button is for. An appliance that will not hand a value back
 * publishes no state and the field is empty, which is the honest thing to show
 * in that case.
 */
/*
 * Whether the characters can be hidden WITHOUT `type="password"`.
 *
 * Every engine now draws its own reveal button inside a password field, each
 * spelled differently and at least one of them (Gecko's) not addressable as a
 * pseudo-element at all — so a control of our own sits beside theirs and the
 * row shows two eyes. Masking a plain text field with CSS gives the native
 * button nothing to attach to.
 *
 * Tested rather than assumed, because the failure mode of assuming wrongly is
 * a passphrase rendered in clear. Where the property is missing we fall back
 * to a real password field: the duplicate button is ugly, and showing the
 * secret would be a fault.
 */
const CSS_CAN_MASK =
  typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('-webkit-text-security', 'disc');

class TextDeviceFeature extends Component {
  state = { draft: null, revealed: false, focused: false, lastStored: null };

  get isSecret() {
    return this.props.deviceFeature.type === DEVICE_FEATURE_TYPES.TEXT.SECRET;
  }

  get stored() {
    return this.props.deviceFeature.last_value_string || '';
  }

  onInput = e => this.setState({ draft: e.target.value });

  onFocus = () => this.setState({ focused: true });

  /*
   * Committed on BLUR, and never on `change`.
   *
   * `onChange` cannot be used here at all: preact/compat is loaded in this
   * bundle, and its vnode hook rewrites `onChange` on a text input to
   * `oninput` — then, finding `oninput` already taken by the handler above, to
   * `oninputCapture`. So a handler written as "when editing finishes" ran
   * before every single keystroke, which re-hid a revealed secret on the first
   * character typed and sent a value to the appliance per letter.
   */
  onBlur = e => {
    const value = e.target.value;
    this.setState({ focused: false });
    if (value !== this.stored) {
      this.props.updateValueWithDebounce(this.props.deviceFeature, value);
    }
  };

  onKeyDown = e => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  toggleReveal = () => this.setState(previous => ({ revealed: !previous.revealed }));

  /*
   * A value from the appliance replaces an uncommitted draft — that is how an
   * Apply, a Revert or a refused change elsewhere on the form reaches this
   * field. Not while the field has focus: somebody typing into it outranks a
   * poll landing mid-word, so such a value is noted and not acted on.
   */
  static getDerivedStateFromProps(props, state) {
    const stored = props.deviceFeature.last_value_string || '';
    if (stored === state.lastStored) {
      return null;
    }
    return state.focused ? { lastStored: stored } : { lastStored: stored, draft: null };
  }

  render({ deviceFeature, rowName }, { draft, revealed }) {
    const displayed = draft === null ? this.stored : draft;

    return (
      <tr>
        <td>
          <i class={`fe fe-${getFeatureIcon(deviceFeature, 'type')}`} />
        </td>
        <td>{rowName}</td>

        <td class="py-0">
          <div class={cx('d-flex justify-content-end align-items-center', style.secretWrapper)}>
            <Localizer>
              <input
                type={this.isSecret && !revealed && !CSS_CAN_MASK ? 'password' : 'text'}
                autocomplete={this.isSecret ? 'new-password' : 'off'}
                value={displayed}
                placeholder={this.isSecret ? <Text id="deviceFeature.secretPlaceholder" /> : ''}
                class={cx(
                  'form-control text-right',
                  style.textInput,
                  this.isSecret && style.secretInput,
                  this.isSecret && !revealed && CSS_CAN_MASK && style.masked
                )}
                onInput={this.onInput}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onKeyDown={this.onKeyDown}
                readOnly={deviceFeature.read_only}
              />
            </Localizer>
            {this.isSecret && !deviceFeature.read_only && (
              <Localizer>
                <button
                  type="button"
                  class={cx('btn btn-link p-0 text-muted', style.revealButton)}
                  onClick={this.toggleReveal}
                  title={revealed ? <Text id="deviceFeature.hideSecret" /> : <Text id="deviceFeature.revealSecret" />}
                >
                  <i class={`fe fe-${revealed ? 'eye-off' : 'eye'}`} />
                </button>
              </Localizer>
            )}
          </div>
        </td>
      </tr>
    );
  }
}

export default TextDeviceFeature;
