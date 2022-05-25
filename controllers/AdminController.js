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
        let sql = "SELECT * FROM account WHERE status = ? and username != ?"
        let param = ["chờ xác minh", "admin"]
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
        let sql = "SELECT * FROM account WHERE status = ? and username != ?"
        let param = ["đã xác minh", "admin"]
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
        let param = ["lock", "admin"]
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
        let param = ["đã vô hiệu hóa", "admin"]
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

    // [GET] /admin/detailUser
    detailUser(req, res){
        let email = req.params.email
        let sql = "SELECT * FROM account WHERE email = ?"
        let param = [email]
        db.query(sql, param, (err, resulst, fields) => {
            if(err){
                return res.render('error', {message: err.message})
            }
            let options = {
                name: req.session.name,
                data: resulst,
            }
            return res.render('detail_user', options)
        })
        
    }

    // [POST] /admin/approveActivated
    approve_activated_account(req, res){
        let email = req.body.email
        let sql = "update account set status = ? where email = ?"
        let param = ["đã xác minh", email]
        db.query(sql, param, (err, resulst, fields) => {
            if(err){
                return res.render('error', {message: err.message})
            }
            if(resulst.affectedRows === 1){
                return res.send('Actived account completely')
            }
        })
    }
     // [POST] /admin/cancelActivated
     cancel_activated_account(req, res){
        let email = req.body.email
        let sql = "update account set status = ? where email = ?"
        let param = ["đã vô hiệu hóa", email]
        db.query(sql, param, (err, resulst, fields) => {
            if(err){
                return res.render('error', {message: err.message})
            }
            if(resulst.affectedRows === 1){
                return res.send('Cancel account completely')
            }
        })
     }
}

module.exports = new AdminController