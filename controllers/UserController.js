const db = require('../models/db')
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs')
const otpGenerator = require('otp-generator')
const saltRounds = 10
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  })
  
function sendUsPd(email, message){
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Active account',
        text: message
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
        console.log(err)
        }else{
        console.log('Email sent')
        }
    })
}

class UserController{
    // [GET] /users/
    index(req, res){
        let name = req.session.name
        let username = req.session.username
        return res.render('index', {name, username})
    }

    // [GET] /users/passwordFirst
    changeFirst(req, res){
        let name = req.session.name
        let username = req.session.username
        return res.render('changePasswordFirst', {name, username})
    }

    changeFirstPassword(req, res){
        let username = req.body.username
        let pwd = req.body.pwd
        bcrypt.hash(pwd, saltRounds)
        .then(hash => {
            let sql = "update account set password = ?, password_first = ? where username = ?"
            let param = [hash, 1, username]
            db.query(sql, param, (e, result, fields) => {
                if(e){
                    message = e.message
                    res.render('error', {message})
                }else{
                    return res.send("Change Password completely")
                }
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    // [GET] /users/login
    login(req, res){
        res.render('login')
    }

    // [GET] /users/signup
    preRegister(req, res){
        res.render('signUp')
    }
    // [POST] /users/signup
    Register(req, res, next){
        const {sdt, email, name, ngaysinh, diachi} = req.body
        let pathUploads = path.join(__dirname, '../public/images');
        let file1 = req.files['attachment1'][0]
        let file2 = req.files['attachment2'][0]
        
        let name1 = file1.originalname
        let newPath1 = path.join(pathUploads, name1)
        let name2 = file2.originalname
        let newPath2 = path.join(pathUploads, name2)
        fs.renameSync(file1.path, newPath1)
        fs.renameSync(file2.path, newPath2)

        let cccdFont = path.join('images', name1)
        let cccdBeside = path.join('images', name2)
        let username = otpGenerator.generate(10, { digits: true, lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets:false })
        let password = otpGenerator.generate(6)
        bcrypt.hash(password, saltRounds)
        .then(hash => {
            let sql = `insert into account(sdt, email, name, ngaysinh, diachi, image_cccd_truoc,
                 image_cccd_sau, username, password, status, password_first, position, activated) 
                 values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            let param = [sdt, email, name, ngaysinh, diachi, cccdFont, cccdBeside, username, hash, "chờ xác minh", 0, 0, 0]
            db.query(sql, param, (e, results, fields) => {
                if(e){
                    message = e.message
                    res.render('error', {message})
                }else{
                    sendUsPd(email, `Username: ${username}, Password: ${password}`)
                    return res.send('Register completely')
                }
            })

        })
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
    get_forget(req, res) {
        res.render('forget')
    }

    // [POST] /users/forget
    post_forget(req, res) {
        const { email } = req.body
        db.query("SELECT * FROM account WHERE email = ?", [email], (e, result, fields) => {
            if (e) return res.render('error', { message: e.message })
            if (!result) return res.render('forget', { email, message: 'email is not true' })

            db.query("UPDATE account SET password = ? WHERE email = ?", [hashed, email], (e, result, fields) => {
                if (e) return res.render('error', { message: e.message })

                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: '', pass: '', }
                });

                transporter.sendMail({
                    from: '',
                    to: `${email}`,
                    subject: '[TB] THÔNG TIN TÀI KHOẢN KHÁCH HÀNG',
                    html: `<p>Cảm ơn bạn đã tin dùng ví điện tử của chúng tôi, vui lòng không chia sẻ thông tin này đến bất kỳ ai. 
                    Đây là thông tin tài khoản của bạn:</p><b>Tên khách hàng: </b>${result[0].fullname} <br> 
                    <b>Số tài khoản: </b>${result[0].username} <br><b>Mật khẩu: </b>${password}<p>Trân trọng ./.</p>`,
                });

                return res.render('forget', { message: 'Please check your email for information' });
            })
        })
    }
}

module.exports = new UserController
