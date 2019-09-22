'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('posts', [
      {
        from: 'devmissionorg',
        title: 'Leo at Latinx Hispanic Heritage Month',
        full_text: "Yesterday our CEO &amp; Founder Leo Sosa was invited to speak at Latinx &amp; Hispanic Heritage Month Celebration hosted by Techqueria. Leo spoke about our organization &amp; our mission to create the next generation of tech talent. https:\/\/t.co\/xUTZ7D0ztX",
        media_url: "https:\/\/pbs.twimg.com\/media\/EEY8uNvXkAAur47.jpg",
        created_at: new Date("Sat Sep 14 02:00:20 +0000 2019"),
        updated_at: new Date()
      },
      {
        from: 'devmissionorg',
        title: 'Grand Opening of 90 Kiska',
        full_text: "We were at the Grand Opening of 90 Kiska Bayview Hunters Point West\/East Westbrook Community Center. We have been working in that community for the past 2 years delivering STEAM Programs for K-24. We are thankful for the support from @SFHDC https:\/\/t.co\/anATr5GOb5",
        media_url: "https:\/\/pbs.twimg.com\/media\/EESgtmqXYAEKSWS.jpg",
        created_at: new Date("Thu Sep 12 20:00:15 +0000 2019",),
        updated_at: new Date()
      },
      {
        from: 'devmissionorg',
        title: 'Ivan Hurtado 1st Year anniversary',
        full_text: "Our Lead instructor Ivan Hurtado just completed his 1st Year with our organization. Throughout his time here Ivan has Developed and Standardized a new curriculum, which included more interactive educational program. Has taught 4 cohorts and graduated over 50 Students. https:\/\/t.co\/BqJlgio12z",
        media_url: "https:\/\/pbs.twimg.com\/media\/EEtjImmX4AENMIT.jpg",
        created_at: new Date("Wed Sep 18 02:00:34 +0000 2019"),
        updated_at: new Date()
      },
      {
        from: 'devmissionorg',
        title: 'Python at Open Lab',
        full_text: "Last night we had a great open lab where our CTO @klnusbaum and Board Member @ taught Python &amp; Math. Very happy to see our alumni come back and learn more programming skills to help with their future. https:\/\/t.co\/5xUmUNiGjJ",
        media_url: "https:\/\/pbs.twimg.com\/media\/EEMSmSOXUAUoANO.jpg",
        created_at: new Date("Wed Sep 11 15:00:51 +0000 2019"),
        updated_at: new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('posts', null, {});
  }
};
