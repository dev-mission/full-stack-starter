/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Memberships', 'UserId', {
      type: Sequelize.UUID,
      allowNull: true,
    });
    await queryInterface.addColumn('Memberships', 'InviteId', {
      type: Sequelize.UUID,
      references: {
        model: 'Invites',
        key: 'id',
      },
    });
    await queryInterface.removeIndex('Memberships', 'memberships__team_id__user_id');
    await queryInterface.sequelize.query(
      'CREATE UNIQUE INDEX "memberships__team_id__user_id" ON "Memberships" ("TeamId", "UserId") WHERE "UserId" IS NOT NULL'
    );
    await queryInterface.sequelize.query(
      'CREATE UNIQUE INDEX "memberships__team_id__invite_id" ON "Memberships" ("TeamId", "InviteId") WHERE "InviteId" IS NOT NULL'
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Memberships', 'memberships__team_id__invite_id');
    await queryInterface.removeIndex('Memberships', 'memberships__team_id__user_id');
    await queryInterface.addIndex('Memberships', ['TeamId', 'UserId'], { unique: true });
    await queryInterface.removeColumn('Memberships', 'InviteId');
    await queryInterface.changeColumn('Memberships', 'UserId', {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },
};
