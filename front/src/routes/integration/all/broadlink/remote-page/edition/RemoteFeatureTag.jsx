import { Component } from 'preact';
import { Text } from 'preact-i18n';
import cx from 'classnames';

import { getFeatureIcon } from '../../../../../../utils/getFeatureIcon';

class RemoteFeatureTag extends Component {
  select = () => {
    if (!this.props.disabled) {
      this.props.selectFeature(this.props.selected ? null : this.props.type);
    }
  };

  render({ category, type, editedFeature = {}, selected, disabled }) {
    const { codes = {} } = editedFeature;
    const withCodes = Object.keys(codes).length > 0;

    return (
      <span
        onClick={this.select}
        class={cx('tag', {
          'cursor-pointer': !disabled,
          'tag-primary': !disabled && withCodes && !selected,
          'tag-dark': !disabled && selected,
          'tag-info': disabled && withCodes && !selected,
          'tag-secondary': disabled && selected
        })}
      >
        <Text id={`deviceFeatureCategory.${category}.${type}`} />
        <div class="tag-addon">
          <i class={`fe fe-${getFeatureIcon({ category, type })}`} />
        </div>
      </span>
    );
  }
}

export default RemoteFeatureTag;
