const async = require('async');
const giftData = require('../../data/gifts.json');
const receiverData = require('../../data/receivers.json');
const donorData = require('../../data/donors.json');
const _ = require('lodash');

// max 100
const NUMBER_OF_DONORS = 10;
const NUMBER_OF_RECEIVERS = 25;
const NUMBER_OF_GIFTS = 50;

module.exports = function createSampleModels(app) {
  const mongoDS = app.datasources.mongoDS;

  // create donors and receivers;
  async.parallel({
    donors: async.apply(createDonors),
    receivers: async.apply(createReceivers)
  }, usersCreated);

  function usersCreated(err, results) {
    if (err) throw err;

    createGifts(results.donors, results.receivers, (err, gifts) => {
      if (err) throw err;

      console.log('>', results.donors.length, 'Donor', 'models created successfully');
      console.log('>', results.receivers.length, 'Receiver', 'models created successfully');
      console.log('>', gifts.length, 'Gift', 'models created successfully');
    });
  }


  function createDonors(callback) {
    mongoDS.automigrate('Donor', err => {
      if (err) return callback(err);
      const Donor = app.models.Donor;

      console.log('> Migrating Donors');


      Donor.create(_.sampleSize(donorData, NUMBER_OF_DONORS), callback);
    });
  }

  function createReceivers(callback) {
    mongoDS.automigrate('Receiver', err => {
      if (err) return callback(err);
      const Receiver = app.models.Receiver;

      console.log('> Migrating Receivers');

      Receiver.create(_.sampleSize(receiverData, NUMBER_OF_RECEIVERS), callback);
    });
  }

  function createGifts(donors, receivers, callback) {
    mongoDS.automigrate('Gift', err => {
      if (err) return callback(err);
      const Gift = app.models.Gift;

      console.log('> Migrating Gifts');

      Gift.create(_.sampleSize(giftData, NUMBER_OF_GIFTS).map(mapGifts), callback);

      function mapGifts(gift) {
        return _.merge({}, gift, {
          donorId: _.sample(donors).id,
          receiverId: _.sample(receivers).id,
        })

      }

    });
  }

};

