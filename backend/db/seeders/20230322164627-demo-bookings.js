'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: "1999-06-03",
        startDate: "1999-06-04"
      },
      {
        spotId: 2,
        userId: 2,
        startDate: "2000-06-03",
        startDate: "2000-06-04"
      },
      {
        spotId: 3,
        userId: 3,
        startDate: "2001-06-03",
        startDate: "2001-06-04"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      startDate: { [Op.in]: ['1999-06-03', '2000-06-03', '2001-06-03'] }
    }, {});
  }
};
