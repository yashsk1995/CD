/**
 * Created by zeeshan on 3/1/2017.
 */

module.exports = {


  createOrUpdate: function (key, value) {
    var content = {key, value};
    return Config.findOne({key: key}).then(function (config) {
      if (config) {
        return Config.update(config.id, content);
      } else {
        return Config.create(content);
      }
    });
  },

  getByKey: function (key) {
    return Config.findOne({key: key}).then(function (config) {
      return config ? config.value : {};
    });
  },
};
