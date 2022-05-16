const db = require('../models/db')

class AdminController{
    index(req, res){
        let name = req.session.name
        return res.render('admin', {name})
    }

    manageUser(req, res){
        let name = req.session.name
        return res.render('manageUser', {name})
    }

    // [GET] /admin/list/user_wait
    list_wait(req, res){
        let sql = "SELECT * FROM account WHERE activated = ? and username != ?"
        let param = [0, "admin"]
        db.query(sql, param, (err, resulst, fields) => {
            if(err){
                return res.render('error', {message: err.message})
            }
            let options = {
                name: req.session.name,
                data: resulst.reverse(),
            }
           return res.render('user_wait', options)
        })
    }

    // [GET] /admin/list/user_actived
    list_actived(req, res){
        let sql = "SELECT * FROM account WHERE activated = ? and username != ?"
        let param = [1, "admin"]
        db.query(sql, param, (err, resulst, fields) => {
            if(err){
                return res.render('error', {message: err.message})
            }
            let options = {
                name: req.session.name,
                data: resulst.reverse(),
            }
           return res.render('user_actived', options)
        })
    }

    // [GET] /admin/list/user_block
    list_block(req, res){
        let sql = "SELECT * FROM account WHERE status = ? and username != ?"
        let param = [0, "admin"]
        db.query(sql, param, (err, resulst, fields) => {
            if(err){
                return res.render('error', {message: err.message})
            }
            let options = {
                name: req.session.name,
                data: resulst.reverse(),
            }
           return res.render('user_block', options)
        })
    }

    // [GET] /admin/list/user_block_infinity
    list_block_infinity(req, res){
        let sql = "SELECT * FROM account WHERE status = ? and username != ?"
        let param = [0, "admin"]
        db.query(sql, param, (err, resulst, fields) => {
            if(err){
                return res.render('error', {message: err.message})
            }
            let options = {
                name: req.session.name,
                data: resulst.reverse(),
            }
           return res.render('user_block_infinity', options)
        })
    }

    // [GET] /admin/approve_withdraw_money
    approve_withdraw_money(req, res){
        let name = req.session.name
        return res.render('approve_withdraw_money', {name})
    }
}

module.exports = new AdminController