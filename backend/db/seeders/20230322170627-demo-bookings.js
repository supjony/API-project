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
        startDate: new Date('2025-10-10'),
        endDate: new Date('2025-11-11')
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date('2025-01-11'),
        endDate: new Date('2025-02-11')
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date('2025-06-12'),
        endDate: new Date('2025-07-12')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      startDate: { [Op.in]: ['2025-10-10', '2025-01-11', '2025-06-12'] }
    }, {});
  }
};
