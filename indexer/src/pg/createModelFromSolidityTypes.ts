import { sequelize } from './pg';

const { DataTypes } = require('sequelize');

const typeMap = {
  uint256: DataTypes.DECIMAL,
  uint8: DataTypes.INTEGER,
  address: DataTypes.STRING,
  bool: DataTypes.BOOLEAN,
  'address[]': DataTypes.ARRAY(DataTypes.STRING),
};

export async function createModelFromTypes(
  fieldNames,
  typeNames,
  modelName,
  indexOfPrimaryKey = 0,
) {
  const properties = {};

  typeNames.forEach((typeName, index) => {
    const propertyName = fieldNames[index];
    properties[propertyName] = {
      type: typeMap[typeName],
      allowNull: false,
      primaryKey: index === indexOfPrimaryKey,
    };
  });

  const model = sequelize.define(modelName, properties);

  await model.sync();

  return model;
}
