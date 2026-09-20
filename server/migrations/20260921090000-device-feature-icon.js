module.exports = {
  up: async (queryInterface, Sequelize) => {
    // A user-chosen icon for one device feature. Null means "work it out from
    // the category and type", which is what every feature does today and what
    // every feature keeps doing until somebody picks something else.
    //
    // Deliberately NOT an ENUM of the icon list, unlike t_scene.icon: SQLite
    // rewrites a table to change an enum, so pinning the column to today's
    // 472 names would make every future icon addition a migration. The value
    // is validated where it is set instead.
    await queryInterface.addColumn('t_device_feature', 'icon', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('t_device_feature', 'icon');
  },
};
