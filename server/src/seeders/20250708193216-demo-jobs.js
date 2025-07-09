'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Jobs', [
      {
        title: 'React Developer',
        company: 'TechCorp',
        location: 'Remote',
        description: 'Build UIs using React...',
        skillsRequired: 'React, Redux, Tailwind',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Jobs', null, {});
  },
};
