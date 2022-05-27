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
            if(result[0].password_first === 0){
                req.session.flash = {
                    type: 'danger',
                    intro: 'Lỗi',
                    message: `Không được hỗ trợ các dịch vụ của hệ thống vì chưa đổi mật khẩu lần đầu`,
                }
                return res.redirect('/users/passwordFirst')
            }else{
                next()
            }
        }    
    })
}