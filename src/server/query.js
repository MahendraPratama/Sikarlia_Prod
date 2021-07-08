var express = require('express');
var router = express.Router();

//import database
var connection = require('../server/database');

/**
 * INDEX POSTS
 */
class queries{
    static getUsers(){
        router.get('/', function (req, res, next) {
            //query
            connection.query('SELECT * FROM users', function (err, rows) {
                if (err) {
                    // req.flash('error', err);
                    // res.render('posts', {
                    //     data: ''
                    // });
                    return { data : '' };
                } else {
                    //render ke view posts index
                    return {
                        data: rows // <-- data posts
                    };
                }
            });
        });
        
        module.exports = router;
    }
}
export default {queries}