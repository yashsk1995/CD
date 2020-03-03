/**
 * Created by zeeshan on 3/1/2017.
 */

module.exports = {

  list: function (search, sort, page, limit) {
    search = search || '';
    var criteria = {
      where: {
        ip: {'contains': search}
      }
    };

    var countQuery = WhitelistedIP.count(criteria);

    var findQuery = WhitelistedIP.find(criteria);

    if (sort) findQuery.sort(sort);
    if (page) findQuery.paginate({page: page, limit: limit});
    findQuery.populate('createdBy');
    return Promise.all([countQuery, findQuery]).then(function (response) {
      var pageCount = Math.ceil(response[0] / limit);
      return {
        pageCount: pageCount,
        ips: response[1]
      };
    });
  },

  create: function (params) {
    return WhitelistedIP.create(params).then(function (whitelistedIP) {
      return whitelistedIP;
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(WhitelistedIP, err.ValidationError)
        throw handledError;
      }
      throw {message: err.details};
    });
  },


  delete: function (id) {
    return WhitelistedIP.destroy({id: id}).then(function (deletedIP) {
      return deletedIP;
    }).catch(function (err) {
      throw {message: err.details};
    });
  },

  isIPExist: function (ip) {
    console.log("[Whitelisted IP Service][isIPExist");
    return WhitelistedIP.count({ip: ip}).then(function (count) {
      console.log("IP Count: " + count);
      return count > 0;
    }).catch(function (error) {
      console.log("IP Error: ");
      console.log(error)
      throw error;
    });
  }

};
