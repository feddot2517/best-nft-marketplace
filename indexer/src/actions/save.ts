export async function save(data, params, config) {
  await config.model.create(data);
}
