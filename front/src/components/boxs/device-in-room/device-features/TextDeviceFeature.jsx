import { Component } from 'preact';
import { Text, Localizer } from 'preact-i18n';
import cx from 'classnames';

import { DEVICE_FEATURE_TYPES } from '../../../../../../server/utils/constants';
import { getFeatureIcon } from '../../../../utils/getFeatureIcon';
import style from './style.css';

/**
 * A free-text value the user can edit from a dashboard, and its write-only
 * sibling for a passphrase, a token or an API key.
 *
 * WHAT IS BEING TYPED IS HELD LOCALLY, and that is not a refinement — without
 * it the control does not work at all. An input whose value comes straight
 * from a prop is rewritten on the next render, and this row re-renders
 * whenever its device does: every state that arrives, every poll. Each
 * keystroke was reverted before it could be seen, so the box looked as though
 * it were simply refusing input.
 *
 * The draft is cleared once committed and the row goes back to showing the
 * authoritative value — the one the appliance confirmed, rather than the one
 * that was typed at it.
 *
 * A SECRET never shows a stored value, because there is never one to show:
 * the server refuses to persist it. It can be revealed WHILE BEING TYPED,
 * which is the only thing there is to reveal, and is how somebody checks they
 * typed a passphrase correctly before committing it.
 */
class TextDeviceFeature extends Component {
  state = { draft: null, revealed: false };

  get isSecret() {
    return this.props.deviceFeature.type === DEVICE_FEATURE_TYPES.TEXT.SECRET;
  }

  onInput = e => this.setState({ draft: e.target.value });

  toggleReveal = () => this.setState(previous => ({ revealed: !previous.revealed }));

  commit = e => {
    this.props.updateValueWithDebounce(this.props.deviceFeature, e.target.value);
    // A secret leaves nothing behind: not in the box, not in component state,
    // and not on screen if it was being revealed.
    this.setState({ draft: null, revealed: false });
  };

  render({ deviceFeature, rowName }, { draft, revealed }) {
    const stored = this.isSecret ? '' : deviceFeature.last_value_string || '';
    const displayed = draft === null ? stored : draft;

    return (
      <tr>
        <td>
          <i class={`fe fe-${getFeatureIcon(deviceFeature, 'type')}`} />
        </td>
        <td>{rowName}</td>

        <td class="py-0">
          <div class="d-flex justify-content-end align-items-center">
            <Localizer>
              <input
                type={this.isSecret && !revealed ? 'password' : 'text'}
                autocomplete={this.isSecret ? 'new-password' : 'off'}
                value={displayed}
                placeholder={this.isSecret ? <Text id="deviceFeature.secretPlaceholder" /> : ''}
                class={cx('form-control text-right', style.textInput)}
                onInput={this.onInput}
                onChange={this.commit}
                readOnly={deviceFeature.read_only}
              />
            </Localizer>
            {this.isSecret && !deviceFeature.read_only && (
              <Localizer>
                <button
                  type="button"
                  class="btn btn-link px-2 text-muted"
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
