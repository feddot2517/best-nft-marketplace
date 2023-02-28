import * as fs from 'fs';

export async function pushAddress(data, params, config, root) {
  const [id, addressField] = params;
  const targetConfig = root.find(config => config.id === id);
  const datum = data[addressField];

  targetConfig.addresses.push(datum);

  const file = JSON.parse(fs.readFileSync(targetConfig.__filePath).toString());
  file.addresses.push(datum);
  fs.writeFileSync(targetConfig.__filePath, JSON.stringify(file));
}
