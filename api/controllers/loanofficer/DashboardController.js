/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboard
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  render: function (req, res) {
    return res.view("loanofficer/dashboard", {layout: ''});
  }
};

