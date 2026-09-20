import { getFeatureIcon } from '../../../../../../utils/getFeatureIcon';

const SensorRowFeaturePreview = ({ label, category, type, children }) => (
  <tr>
    <td>
      <i class={`fe fe-${getFeatureIcon({ category, type }, 'radio')}`} />
    </td>
    <td>{label}</td>
    <td class="text-right">{children}</td>
  </tr>
);

export default SensorRowFeaturePreview;
