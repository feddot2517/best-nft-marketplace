import * as fs from 'fs';
import { Model } from 'sequelize/types/model';

export async function updateField(data, params, config, root) {
  const [configId, pk, fieldId, value] = params;
  const options = { where: { [pk]: data[pk] } };
  const keys = { [fieldId]: value };

  const targetConfig = root.find(i => i.id === configId);

  await (targetConfig.model as Model).update(keys, options).catch(e => {
    console.log('Something went wrong when updating fieldId', fieldId, value, pk, e);
  });
}
