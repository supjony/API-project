'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'spotimages.com1',
        preview: true
      },
      {
        spotId: 2,
        url: 'spotimages.com2',
        preview: true
      },
      {
        spotId: 3,
        url: 'spotimages.com3',
        preview: false
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['spotimages.com1', 'spotimages.com2', 'spotimages.com3'] }
    }, {});
  }
};
