const db = require('../models/db')

const checkVerified = (req, res, next) => {
    const username = req.username
    let sql = "SELECT * FROM account WHERE username = ?"
    let param = [username]
    
    db.query(sql, param, (e, result, fields) => {
        if(e){
            message = e.message
            res.render('error', {message})
        }else if(result[0].verified === 0){
            return res.redirect('/users/user')
        }
        next()
    })
}

module.exports = checkVerified