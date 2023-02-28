import {col, DataTypes, fn, UUIDV4} from 'sequelize';
import {sequelize} from './pg';

require('dotenv').config();

const {PG_TABLE_MARKET} = process.env;

const {STRING, DECIMAL, ARRAY, INTEGER} = DataTypes;

const Market = sequelize.define(
    'Compound',
    {
        address: {
            primaryKey: true,
            type: STRING,
        },
        chainId: STRING,
        nftCollection: STRING,
        currencies: ARRAY(STRING),
        authorRoyalty: INTEGER
    },
    {
        tableName: PG_TABLE_MARKET,
    },
);

export async function syncAllTables(clean: Boolean) {
    if (clean) {
        await sequelize.sync({force: true});
        process.exit(0);
    }
    await sequelize.sync();
}

export {Market};
