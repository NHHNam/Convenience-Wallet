const db = require('../models/db')
module.exports = (req, res, next) => {
    let username = req.session.username
    let sql = "select * from account where username = ?"
    let param = [username]
    db.query(sql, param, (e, result, fields) => {
        if(e){
            message = e.message
            res.render('error', {message})
        }else{
            if((result[0].status !== "đã xác minh" && result[0].activated === 1) || (result[0].status !== "đã xác minh" && result[0].activated === 0 )){
                req.session.flash = {
                    type: 'danger',
                    intro: 'Lỗi',
                    message: `Không được hỗ trợ các dịch vụ của hệ thống vì tài khoản chưa được xác minh`,
                }
                return res.redirect('/users')
            }else{
                next()
            }
        }    
    })
}