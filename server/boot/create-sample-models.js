const async = require('async');
const giftData = require('../../data/gifts.json');
const receiverData = require('../../data/receivers.json');
const donorData = require('../../data/donors.json');


module.exports = function createSampleModels(app) {
  const mongoDS = app.datasources.mongoDS;

  // create donors and receivers;
  async.parallel({
    donors: async.apply(createDonors),
    receivers: async.apply(createReceivers)
  }, createUsersCB);

  function createUsersCB(err, results) {
    if (err) throw err;

    createGifts(results.donors, results.receivers, function (err, gifts) {
      if (err) throw err;

      console.log('>', results.donors.length, 'Donor', 'models created successfully');
      console.log('>', results.receivers.length, 'Receiver', 'models created successfully');
      console.log('>', gifts.length, 'Gift', 'models created successfully');
    });
  }


  function createDonors(callback) {
    mongoDS.automigrate('Donor', function (err) {
      if (err) return callback(err);
      const Donor = app.models.Donor;

      console.log('> Migrating Donors');


      Donor.create(donorData.slice(0, 15), callback);
    });
  }

  function createReceivers(callback) {
    mongoDS.automigrate('Receiver', function (err) {
      if (err) return callback(err);
      const Receiver = app.models.Receiver;

      console.log('> Migrating Receivers');

      Receiver.create(receiverData.slice(0, 50), callback);
    });
  }

  function createGifts(donors, receivers, callback) {
    mongoDS.automigrate('Gift', function (err) {
      if (err) return callback(err);
      const Gift = app.models.Gift;

      console.log('> Migrating Gifts');

      Gift.create(giftData.map(mapGifts), callback);

      function mapGifts(gift) {
        return Object.assign({}, gift, {
          donorId: donors[ gift.donorId ].id,
          receiverId: receivers[ gift.receiverId ].id
        })

      }

    });
  }

};

