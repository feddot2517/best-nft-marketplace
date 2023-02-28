import { save } from './save';
import { pushAddress } from './pushAddress';
import { updateField } from './updateField';

export const actions: { [key: string]: (data, params, config, root) => void } = {
  save: save,
  pushAddress: pushAddress,
  updateField: updateField,
};
