"use strict";

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(
      [
        {
          ownerId: 1,
          address: "123 Disney Lane",
          city: "San Francisco",
          state: "California",
          country: "United States of America",
          lat: 37.7645358,
          lng: -122.4730327,
          name: "App Academy",
          description: "Place where web developers are created",
          price: 123,
        },
        {
          ownerId: 2,
          address: "987 Times Square",
          city: "New York City",
          state: "New York",
          country: "United States of America",
          lat: 40.758896,
          lng: -73.98513,
          name: "Times Square Penthouse",
          description: "It's Times Square baby!",
          price: 999,
        },
        {
          ownerId: 3,
          address: " 2820 Industrial Dr",
          city: "Raleigh",
          state: "North Carolina",
          country: "United States of America",
          lat: 35.8163,
          lng: 78.6205,
          name: "The Ritz",
          description: "Puttin' on the Ritz!",
          price: 500,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";

    return queryInterface.bulkDelete(options, {});
  },
};
