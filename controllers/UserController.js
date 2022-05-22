const db = require('../models/db')
const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator')


class UserController{
    // [GET] /users/
    index(req, res){
        let name = req.session.name
        return res.render('index', {name})
    }

     // [GET] /users/signup
    signup(req, res){
        res.render('signup')
    }

    // [POST] /users/signup
    register(req, res){
        const {email, phoneNumber, name, address, birthday} = req.body

        let result = validationResult(req)
        let message = ''
        
        if (result.errors.length !== 0){
            result = result.mapped()
            for (let field in result){
                message = result[field].msg
                break;
            }
            return res.render('signup', {message, email, phoneNumber, name, address, birthday})
        }

        // Check phone exists
        let sql = "SELECT * FROM account WHERE phoneNumber = ?"
        let param = [phoneNumber]

        db.query(sql, param, (e, result, fields) => {
            if(e){
                message = e.message
                res.render('error', {message})
            }else if(result != ""){
                message = 'Số điện thoại đã tồn tại'
                return res.render('signup', {message, email, phoneNumber, name, address, birthday})
            }
            else{
                // Check email exists
                sql = "SELECT * FROM account WHERE email = ?"
                param = [email]
        
                db.query(sql, param, (e, result, fields) => {
                    if(e){
                        message = e.message
                        res.render('error', {message})
                    }else if(result != ""){
                        console.log('error')
                        message = 'Email đã tồn tại'
                        return res.render('signup', {message, email, phoneNumber, name, address, birthday})
                    }
                    else{
                        let signupSuccessful = true;
                        return res.render('login', {signupSuccessful})
                    }
                })
            }
        })

        
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
                let login_fail_count = result[0].login_fail_count
                let suspicious = result[0].suspicious
                console.log('count:', login_fail_count)
                console.log('suspicious: ', suspicious)

                // Lock user if login fail 3 times
                if (login_fail_count >= 2){
                    if (suspicious === 1){
                        message = 'Tài khoản bị khóa vĩnh viễn'
                        return res.render('login', {username, message})
                    }
                    else {
                        // change user to suspicious account
                        sql = "UPDATE account SET suspicious = ? WHERE username = ?"
                        param = [1, username]
    
                        db.query(sql, param, (e, result, fields) => {
                            if(e){
                                message = e.message
                                res.render('error', {message})
                            }
                        })
    
                        // Reset after 1 minute
                        sql = "UPDATE account SET login_fail_count = ? WHERE username = ?"
                        param = [0, username]
    
                        db.query(sql, param, (e, result, fields) => {
                            if(e){
                                message = e.message
                                res.render('error', {message})
                            }
                        })
                        message = 'Tài khoản bị khóa 1 phút'
                        return res.render('login', {username, message})
                    }
                }
                else{
                    const hash = result[0].password
                    const position = result[0].position
                    // Check password
                    bcrypt.compare(password, hash)
                    .then(match => {
                        if(match){
                            // reset login_fail_count
                            if (login_fail_count > 0){
                                sql = "UPDATE account SET login_fail_count = ? WHERE username = ?"
                                param = [0, username]
        
                                db.query(sql, param, (e, result, fields) => {
                                    if(e){
                                        message = e.message
                                        res.render('error', {message})
                                    }
                                })
                            }
                            // reset user to normal
                            if (result[0].suspicious === 1){
                                sql = "UPDATE account SET suspicious = ? WHERE username = ?"
                                param = [0, username]
        
                                db.query(sql, param, (e, result, fields) => {
                                    if(e){
                                        message = e.message
                                        res.render('error', {message})
                                    }
                                })
                            }

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
                            login_fail_count = login_fail_count + 1
                            let sql = "UPDATE account SET login_fail_count = ? WHERE username = ?"
                            let param = [login_fail_count, username]
    
                            db.query(sql, param, (e, result, fields) => {
                                if(e){
                                    message = e.message
                                    res.render('error', {message})
                                }
                            })
                            return res.render('login', {username, message})}
                    })
                    .catch(e => {
                        res.render('error', {message: e.message})
                    })
                }
            } else{
                message = 'username or password is not true'
                return res.render('login', {username, password, message})
            }
        })
    }

    // [GET] /users/user
    user(req, res){
        res.render('user')
    }
}

module.exports = new UserController