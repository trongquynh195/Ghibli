const User = require('../models/User');
const bcrypt = require('bcrypt');

class userController {
    getAllUser(req, res){
        Promise.all([
            User.findOne({username: req.body.username})
        ])
        .then(async ([user]) => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    }
}
module.exports = new userController();