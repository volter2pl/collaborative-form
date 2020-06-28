const CommonModel = require('../models/common');

exports.index = function(req, res) {
    res.render('index', {
        ver: CommonModel.getVersion(),
        title: CommonModel.getTitle()
    });
};
