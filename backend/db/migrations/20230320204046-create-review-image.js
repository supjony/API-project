'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('ReviewImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reviewId: {
        type: Sequelize.INTEGER,
        references: {model: "Reviews"},

      },
      url: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, options);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "ReviewImages";
    return queryInterface.dropTable(options);
  }

  // async down(queryInterface, Sequelize) {
  //   // await queryInterface.dropTable('ReviewImages');
  //   options.tableName = "ReviewImages";
  //   return queryInterface.dropTable(options);
  // }
};
