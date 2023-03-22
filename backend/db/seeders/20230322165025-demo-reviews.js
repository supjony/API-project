'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        review: "nice! 1",
        stars: 1
      },
      {
        spotId: 2,
        userId: 2,
        review: "nice! 2",
        stars: 2
      },
      {
        spotId: 3,
        userId: 3,
        review: "nice! 3",
        stars: 3
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      stars: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
