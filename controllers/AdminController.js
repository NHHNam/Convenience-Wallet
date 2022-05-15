const db = require('../models/db')

class AdminController{
    index(req, res){
        db.query("SELECT * FROM account", (err, results, fields) =>{
            if(err) throw err
            let personEmail = results[0].email
            return res.render('admin', {personEmail})
        })
    }

    // [GET] /admin/list/user_wait
    list_wait(req, res){
        return res.send("List of user who was waited for actived");
    }

    // [GET] /admin/list/user_actived
    list_actived(req, res){
        return res.send("List of user who was actived");
    }

    // [GET] /admin/list/user_block
    list_block(req, res){
        return res.send("List of user who was block because no active");
    }

    // [GET] /admin/list/user_block_infinity
    list_block_infinity(req, res){
        return res.send("List of user who entered wrong pass greater than 3");
    }

    // [GET] /admin/approve_withdraw_money
    approve_withdraw_money(req, res){
        return res.send("approve withdraw money in list");
    }
}

module.exports = new AdminController