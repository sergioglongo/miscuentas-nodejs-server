'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('pay_methods', 'type', {
      type: Sequelize.ENUM(['in', 'out', 'adjustment']),
      allowNull: false,
      defaultValue: 'out',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('pay_methods', 'type', {
      type: Sequelize.ENUM(['in', 'out']),
      allowNull: false,
      defaultValue: 'out',
    });
  }
};