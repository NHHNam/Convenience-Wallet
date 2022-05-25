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
                return res.redirect('/users/passwordFirst')
            }else{
                next()
            }
        }    
    })
}