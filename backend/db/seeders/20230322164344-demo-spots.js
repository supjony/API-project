'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '1 mission st',
        city: "San francisco 1",
        state: "CA 1",
        country: "USA 1",
        lat: 11.1111111,
        lng: 111.1111111,
        name: 'Beaux 1',
        description: 'it is lit 1',
        price: 1
      },
      {
        ownerId: 2,
        address: '2 mission st',
        city: "San francisco 2",
        state: "CA 2",
        country: "USA 2",
        lat: 22.2222222,
        lng: 222.2222222,
        name: 'Beaux 2',
        description: 'it is lit 2',
        price: 2
      },
      {
        ownerId: 3,
        address: '3 mission st',
        city: "San francisco 3",
        state: "CA 3",
        country: "USA 3",
        lat: 33.3333333,
        lng: 333.3333333,
        name: 'Beaux 3',
        description: 'it is lit 3',
        price: 3
      }
    ], {});
  },

  // down: async (queryInterface, Sequelize) => {
  //   options.tableName = 'Spots';
  //   const Op = Sequelize.Op;
  //   return queryInterface.bulkDelete(options, {
  //     price: { [Op.in]: [1, 2, 3] }
  //   }, {});
  // }
  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options);
  }
};



// npx sequelize-cli model:generate --name Spot --attributes ownerId:integer,address:string,city:string,state:string,country:string,lat:d
// ecimal,lng:decimal,name:string,description:string,price:decimal
