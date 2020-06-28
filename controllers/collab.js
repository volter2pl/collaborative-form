let CommonModel = require('../models/common');

exports.index = function(req, res) {
    res.render('collab', {
        ver: CommonModel.getVersion(),
        title: CommonModel.getTitle()
    });
};
