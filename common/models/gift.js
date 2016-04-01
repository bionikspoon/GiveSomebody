module.exports = function (Gift) {
  /**
   * List all available gifts
   * @param {function(Error, array)} callback
   */

  Gift.listFree = function (callback) {
    Gift.find({
      fields: {
        reserved: false
      }
    }, callback);
  };

  /**
   * Check if gift is available.
   * @param {number} id ID of gift.
   * @param {function(Error, string, boolean)} callback
   */

  Gift.isFree = function (id, callback) {
    Gift.findById(id, giftFoundCB);

    function giftFoundCB(err, gift) {
      if (err) return callback(err);
      var response, available;
      
      if (gift.reserved) {
        response = 'Sorry, the gift is reserved';
        available = false;
      }
      else {
        response = 'Great, this gift can be yours';
        available = true;
      }
      callback(null, response, available);
    }
  };
};
