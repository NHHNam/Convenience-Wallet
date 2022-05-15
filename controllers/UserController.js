const db = require('../models/db')
const bcrypt = require('bcrypt');

class UserController{
    // [GET] /users/
    index(req, res){
        return res.send('Welcome user page')
    }
    // [GET] /users/login
    login(req, res){
        res.render('login')
    }

    // [POST] /users/login
    enter(req, res){
        const {username, password} = req.body

        console.log(username, password)
        let sql = "SELECT * FROM account WHERE username = ?"
        let param = [username]
        let message = ''
        db.query(sql, param, (e, result, fields) => {
            if(e){
                message = e.message
                res.render('error', {message})
            }else if(result != ""){
                const hash = result[0].password
                const position = result[0].position
                bcrypt.compare(password, hash)
                .then(match => {
                    if(match){
                        if(position){
                            return res.render('admin', {username, password})
                        }else{
                            return res.render('index', {username, password})
                        }
                    }else{
                        message = 'password is not true'
                        return res.render('login', {username, password, message})
                    }
                })
                .catch(e => {
                    res.render('error', {message: e.message})
                })
            }else{
                message = 'username or password is not true'
                return res.render('login', {username, password, message})
            }
        })
    }
}

module.exports = new UserController