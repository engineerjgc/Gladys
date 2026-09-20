import { Text } from 'preact-i18n';

import { getFeatureIcon } from '../../../utils/getFeatureIcon';

const DeviceFeature = ({ feature }) => (
  <span class="tag">
    <Text id={`deviceFeatureCategory.${feature.category}.${feature.type}`} />
    <div class="tag-addon">
      <i class={`fe fe-${getFeatureIcon(feature)}`} />
    </div>
  </span>
);

export default DeviceFeature;
