const db = require('../models/db')
const bcrypt = require('bcrypt');

class UserController{
    // [GET] /users/
    index(req, res){
        let name = req.session.name
        return res.render('index', {name})
    }
    // [GET] /users/login
    login(req, res){
        res.render('login')
    }

    // [POST] /users/login
    enter(req, res){
        const {username, password} = req.body

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
                            req.session.name = result['0'].name
                            req.session.username = username
                            req.session.position = 1
                            return res.redirect('/admin')
                        }else{
                            req.session.position = 0
                            req.session.name = result['0'].name
                            req.session.username = username
                            return res.redirect('/users')
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