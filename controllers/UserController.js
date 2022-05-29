const db = require('../models/db')
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs')
const otpGenerator = require('otp-generator')
const saltRounds = 10
const nodemailer = require('nodemailer')
const { validationResult } = require('express-validator')

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

function sendUsPd(email, message) {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Active account',
        text: message
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Email sent')
        }
    })
}

function sendOTP(email, message, req, res) {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'OTP for chuyển tiền',
        text: message
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            req.session.flash = {
                type: 'danger',
                intro: 'Lỗi',
                message: 'Thẻ không tồn tại',
            }
            return res.redirect('/users/services/transfer')
        } else {
            console.log('Email sent')
            return res.redirect('/users/services/otpTransfer')
        }
    })
}

function napTien(email, recharge, numberCard, expirationDate, codeCVV, status, req, res) {
    let currentdate = new Date();

    let date = "" + currentdate.getFullYear() + '-' + (currentdate.getMonth() + 1) + '-' + currentdate.getDate()
    let time = "" + currentdate.getHours() + ':' + currentdate.getMinutes() + ':' + currentdate.getSeconds()
    let type = "Nạp tiền"
    let note = ""

    let sql = "insert into historyServices(email, numberCard, expirationDate, codeCVV, recharge, dateRecharge, timeRecharge, type, note, status) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    let sql1 = "update surplusAccount set surplus = surplus + ? where email = ?"
    let param = [email, numberCard, expirationDate, codeCVV, recharge, date, time, type, note, status]
    let param1 = [recharge, email]
    let message = ''

    if (status === "chờ duyệt") {
        db.query(sql, param, (e, results, fields) => {
            if (e) {
                console.log(e.message)
            } else {
                req.session.flash = {
                    type: 'success',
                    intro: 'Thành công',
                    message: 'Chờ admin duyệt nạp tiền',
                }
                return res.redirect('/users/services/nopTien')
            }
        })
    } else {
        db.query(sql, param, (e, results, fields) => {
            if (e) {
                console.log(e.message)
            } else {
                db.query(sql1, param1, (err, ress, fss) => {
                    if (err) {
                        console.log(err.message)
                    } else {
                        req.session.flash = {
                            type: 'success',
                            intro: 'Thành công',
                            message: 'Nạp tiên thành công',
                        }
                        console.log("Nạp tiên thành công")
                        return res.redirect('/users/services/nopTien')
                    }
                })
            }
        })
    }


}

function rutTien(email, withdraw, numberCard, expirationDate, codeCVV, note, status, req, res) {
    let currentdate = new Date();

    let date = "" + currentdate.getFullYear() + '-' + (currentdate.getMonth() + 1) + '-' + currentdate.getDate()
    let time = "" + currentdate.getHours() + ':' + currentdate.getMinutes() + ':' + currentdate.getSeconds()
    let type = "Rút tiền"

    let withdraws = withdraw - withdraw * (5 / 100)

    let sql = "insert into historyServices(email, numberCard, expirationDate, codeCVV, recharge, dateRecharge, timeRecharge, type, note, status) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    let sql1 = "update surplusAccount set surplus = surplus - ? where email = ?"
    let param = [email, numberCard, expirationDate, codeCVV, withdraws, date, time, type, note, status]
    let param1 = [withdraw, email]
    let message = ''

    if (status === "chờ duyệt") {
        db.query(sql, param, (e, results, fields) => {
            if (e) {
                console.log(e.message)
            } else {
                req.session.flash = {
                    type: 'success',
                    intro: 'Thành công',
                    message: 'Chờ admin duyệt nạp tiền',
                }
                console.log('Chờ admin duyệt rút tiền')
                return res.redirect('/users/services/rutTien')
            }
        })
    } else {
        db.query(sql, param, (e, results, fields) => {
            if (e) {
                console.log(e.message)
            } else {
                db.query(sql1, param1, (err, ress, fss) => {
                    if (err) {
                        console.log(err.message)
                    } else {
                        req.session.flash = {
                            type: 'success',
                            intro: 'Thành công',
                            message: 'Rút tiên thành công',
                        }
                        console.log("Rút tiên thành công")
                        return res.redirect('/users/services/rutTien')
                    }
                })
            }
        })
    }
}

function chuyenTien(emailSend, emailReceived, moneyTransfer, noteTransfer, fee, req, res) {
    if (fee === "receive") {
        if (parseInt(moneyTransfer) >= 5000000) {
            let sql = "insert into historyTransfer(emailReceive, emailSend, note, money, typeFee, date, time, status) values(?, ?, ?, ?, ?, ?, ?, ?)"
            let currentdate = new Date();

            let date = "" + currentdate.getFullYear() + '-' + (currentdate.getMonth() + 1) + '-' + currentdate.getDate()
            let time = "" + currentdate.getHours() + ':' + currentdate.getMinutes() + ':' + currentdate.getSeconds()
            let param = [emailReceived, emailSend, noteTransfer, moneyTransfer, fee, date, time, "chờ duyệt"]
            db.query(sql, param, (errr, ressss, fisss) => {
                if (errr) {
                    console.log(errr)
                } else {
                    req.session.flash = {
                        type: 'success',
                        intro: 'Thành công',
                        message: 'Chờ admin duyệt chuyển tiền',
                    }
                    return res.redirect('/users/services/transfer')
                }
            })
        } else {
            db.query("update surplusAccount set surplus = surplus - ? where email = ?", [moneyTransfer, emailSend], (e, results, fields) => {
                if (e) {
                    console.log(e)
                } else {
                    let feeTransfer = moneyTransfer * 5 / 100
                    db.query("update surplusAccount set surplus = surplus + ? - ? where email = ?", [moneyTransfer, feeTransfer, emailReceived], (err, resss, fssss) => {
                        if (err) {
                            console.log(err)
                        } else {
                            let sql = "insert into historyTransfer(emailReceive, emailSend, note, money, typeFee, date, time, status) values(?, ?, ?, ?, ?, ?, ?, ?)"
                            let currentdate = new Date();

                            let date = "" + currentdate.getFullYear() + '-' + (currentdate.getMonth() + 1) + '-' + currentdate.getDate()
                            let time = "" + currentdate.getHours() + ':' + currentdate.getMinutes() + ':' + currentdate.getSeconds()
                            let param = [emailReceived, emailSend, noteTransfer, moneyTransfer, fee, date, time, "duyệt"]
                            db.query(sql, param, (errr, ressss, fisss) => {
                                if (errr) {
                                    console.log(errr)
                                } else {
                                    req.session.flash = {
                                        type: 'success',
                                        intro: 'Thành công',
                                        message: 'Chuyển tiền thành công',
                                    }
                                    return res.redirect('/users/services/transfer')
                                }
                            })
                        }
                    })
                }
            })
        }
    } else {
        if (parseInt(moneyTransfer) >= 5000000) {
            let sql = "insert into historyTransfer(emailReceive, emailSend, note, money, typeFee, date, time, status) values(?, ?, ?, ?, ?, ?, ?, ?)"
            let currentdate = new Date();

            let date = "" + currentdate.getFullYear() + '-' + (currentdate.getMonth() + 1) + '-' + currentdate.getDate()
            let time = "" + currentdate.getHours() + ':' + currentdate.getMinutes() + ':' + currentdate.getSeconds()
            let param = [emailReceived, emailSend, noteTransfer, moneyTransfer, fee, date, time, "chờ duyệt"]
            db.query(sql, param, (errr, ressss, fisss) => {
                if (errr) {
                    console.log(errr)
                } else {
                    req.session.flash = {
                        type: 'success',
                        intro: 'Thành công',
                        message: 'Chờ admin duyệt chuyển tiền',
                    }
                    return res.redirect('/users/services/transfer')
                }
            })
        } else {
            let feeTransfer = moneyTransfer * 5 / 100
            db.query("update surplusAccount set surplus = surplus - ? - ? where email = ?", [moneyTransfer, feeTransfer, emailSend], (e, results, fields) => {
                if (e) {
                    console.log(e)
                } else {
                    db.query("update surplusAccount set surplus = surplus + ? where email = ?", [moneyTransfer, emailReceived], (err, resss, fssss) => {
                        if (err) {
                            console.log(err)
                        } else {
                            let sql = "insert into historyTransfer(emailReceive, emailSend, note, money, typeFee, date, time, status) values(?, ?, ?, ?, ?, ?, ?, ?)"
                            let currentdate = new Date();

                            let date = "" + currentdate.getFullYear() + '-' + (currentdate.getMonth() + 1) + '-' + currentdate.getDate()
                            let time = "" + currentdate.getHours() + ':' + currentdate.getMinutes() + ':' + currentdate.getSeconds()
                            let param = [emailReceived, emailSend, noteTransfer, moneyTransfer, fee, date, time, "duyệt"]
                            db.query(sql, param, (errr, ressss, fisss) => {
                                if (errr) {
                                    console.log(errr)
                                } else {
                                    req.session.flash = {
                                        type: 'success',
                                        intro: 'Thành công',
                                        message: 'Chuyển tiền thành công',
                                    }
                                    return res.redirect('/users/services/transfer')
                                }
                            })
                        }
                    })
                }
            })
        }
    }

}

class UserController {
    // [GET] /users/
    index(req, res) {

        if (req.session.username) {
            let name = req.session.name
            let username = req.session.username
            let email = req.session.email
            let sql = "select * from surplusAccount where email = ?"
            let param = [email]

            db.query(sql, param, (e, result, fields) => {
                if (e) {
                    message = e.message
                    res.render('error', { message })
                } else {
                    let surplus = result[0].surplus
                    return res.render('index', { name, username, surplus })
                }
            })
        } else {
            return res.redirect('/users/login')
        }

    }

    // [GET] /users/passwordFirst
    changeFirst(req, res) {
        let name = req.session.name
        let username = req.session.username
        return res.render('changePasswordFirst', { name, username })
    }

    //services


    // [GET] /users/services
    service(req, res) {
        let name = req.session.name
        let username = req.session.username
        let email = req.session.email
        let sql = "select * from surplusAccount where email = ?"
        let param = [email]
        let message = ''
        db.query(sql, param, (e, result, fields) => {
            if (e) {
                message = e.message
                res.render('error', { message })
            } else {
                let surplus = result[0].surplus
                return res.render('services', { name, username, surplus })
            }
        })
    }

    // [GET] /users/services/nopTien
    preNapTien(req, res) {
        let name = req.session.name
        let username = req.session.username
        let email = req.session.email
        let message = ''
        let sql = "select * from surplusAccount where email = ?"
        let param = [email]
        db.query(sql, param, (e, result, fields) => {
            if (e) {
                message = e.message
                res.render('error', { message })
            } else {
                let surplus = result[0].surplus

                // thong tin the
                let codeCard = req.session.codeCard || ""
                let expiredCard = req.session.expiredCard || ""
                let codeCVV = req.session.codeCVV || ""
                let recharge = req.session.recharge || ""

                return res.render('nopTien', { name, username, surplus, codeCard, expiredCard, codeCVV, recharge })
            }
        })
    }

    // [POST] /users/services/nopTien
    napTien(req, res) {
        const { codeCard, expiredCard, codeCVV, recharge } = req.body
        let result = validationResult(req)
        if (result.errors.length === 0) {
            let sql = "select * from creditCard where numberCard = ?"
            let param = [codeCard]
            let message = ''
            delete req.session.codeCard
            delete req.session.expiredCard
            delete req.session.codeCVV
            delete req.session.recharge
            db.query(sql, param, (e, results, fields) => {
                if (e) {
                    message = e.message
                    res.render('error', { message })
                } else {
                    if (results.length == 0) {
                        req.session.flash = {
                            type: 'danger',
                            intro: 'Lỗi',
                            message: 'Thẻ không tồn tại',
                        }
                        req.session.codeCard = codeCard
                        req.session.expiredCard = expiredCard
                        req.session.codeCVV = codeCVV
                        req.session.recharge = recharge
                        return res.redirect('/users/services/nopTien')
                    } else {
                        // console.log(results)
                        if (expiredCard != results[0].expirationDate) {
                            req.session.flash = {
                                type: 'danger',
                                intro: 'Lỗi',
                                message: 'Hết hạn thẻ sai',
                            }
                            req.session.codeCard = codeCard
                            req.session.expiredCard = expiredCard
                            req.session.codeCVV = codeCVV
                            req.session.recharge = recharge
                            return res.redirect('/users/services/nopTien')
                        } else if (codeCVV != results[0].codeCVV) {
                            req.session.flash = {
                                type: 'danger',
                                intro: 'Lỗi',
                                message: 'Code CVV thẻ sai',
                            }
                            req.session.codeCard = codeCard
                            req.session.expiredCard = expiredCard
                            req.session.codeCVV = codeCVV
                            req.session.recharge = recharge
                            return res.redirect('/users/services/nopTien')
                        } else {
                            req.session.success = "Nộp tiền thành công"
                            let email = req.session.email
                            let status = ""
                            if (codeCard === '111111') {
                                if (parseInt(recharge) >= 5000000) {
                                    status = "chờ duyệt"
                                    napTien(email, recharge, codeCard, expiredCard, codeCVV, status, req, res)

                                } else {
                                    status = "duyệt"
                                    napTien(email, recharge, codeCard, expiredCard, codeCVV, status, req, res)

                                }
                            } else if (codeCard === '222222') {
                                if (parseInt(recharge) > 1000000) {
                                    req.session.flash = {
                                        type: 'danger',
                                        intro: 'Lỗi',
                                        message: 'Chỉ được nạp tối đa là 1 triệu',
                                    }
                                    req.session.codeCard = codeCard
                                    req.session.expiredCard = expiredCard
                                    req.session.codeCVV = codeCVV
                                    req.session.recharge = recharge
                                    return res.redirect('/users/services/nopTien')
                                } else {
                                    status = "duyệt"
                                    napTien(email, recharge, codeCard, expiredCard, codeCVV, status)

                                    return res.redirect('/users/services/nopTien')
                                }
                            } else {
                                req.session.flash = {
                                    type: 'danger',
                                    intro: 'Lỗi',
                                    message: 'Thẻ hết tiền',
                                }
                                req.session.codeCard = codeCard
                                req.session.expiredCard = expiredCard
                                req.session.codeCVV = codeCVV
                                req.session.recharge = recharge
                                return res.redirect('/users/services/nopTien')
                            }
                        }

                    }
                }
            })
        } else {
            let messages = result.mapped()
            let message = ''
            req.session.codeCard = codeCard
            req.session.expiredCard = expiredCard
            req.session.codeCVV = codeCVV
            req.session.recharge = recharge
            for (let m in messages) {
                message = messages[m]
                break
            }
            req.session.flash = {
                type: 'danger',
                intro: 'Lỗi',
                message: message.msg,
            }
            return res.redirect('/users/services/nopTien')
        }

    }

    // [GET] /users/services/rutTien
    preRutTien(req, res) {
        let name = req.session.name
        let username = req.session.username
        let email = req.session.email
        let sql = "select * from surplusAccount where email = ?"
        let param = [email]
        db.query(sql, param, (e, result, fields) => {
            if (e) {
                message = e.message
                res.render('error', { message })
            } else {
                let surplus = result[0].surplus

                // thong tin the
                let codeCard = req.session.codeCard
                let expiredCard = req.session.expiredCard
                let codeCVV = req.session.codeCVV
                let withdraw = req.session.withdraw
                let note = req.session.note
                return res.render('rutTien', { name, username, surplus, codeCVV, codeCard, expiredCard, withdraw, note })
            }
        })
    }

    // [POST] /users/services/rutTien
    rutTien(req, res) {
        const { codeCard, expiredCard, codeCVV, note, withdraw } = req.body
        let result = validationResult(req)
        if (result.errors.length === 0) {
            let sql = "select * from creditCard where numberCard = ?"
            let param = [codeCard]
            let message = ''
            delete req.session.codeCard
            delete req.session.expiredCard
            delete req.session.codeCVV
            delete req.session.withdraw
            delete req.session.note
            let status = ""
            db.query(sql, param, (e, results, fields) => {
                if (e) {
                    message = e.message
                    res.render('error', { message })
                } else {
                    if (results.length == 0) {
                        req.session.flash = {
                            type: 'danger',
                            intro: 'Lỗi',
                            message: 'Thẻ không tồn tại',
                        }
                        req.session.codeCard = codeCard
                        req.session.expiredCard = expiredCard
                        req.session.codeCVV = codeCVV
                        req.session.withdraw = withdraw
                        req.session.note = note
                        return res.redirect('/users/services/rutTien')
                    } else {
                        if (expiredCard != results[0].expirationDate) {
                            req.session.flash = {
                                type: 'danger',
                                intro: 'Lỗi',
                                message: 'Hết hạn thẻ sai',
                            }
                            req.session.codeCard = codeCard
                            req.session.expiredCard = expiredCard
                            req.session.codeCVV = codeCVV
                            req.session.withdraw = withdraw
                            req.session.note = note
                            return res.redirect('/users/services/rutTien')
                        } else if (codeCVV != results[0].codeCVV) {
                            req.session.flash = {
                                type: 'danger',
                                intro: 'Lỗi',
                                message: 'Code CVV thẻ sai',
                            }
                            req.session.codeCard = codeCard
                            req.session.expiredCard = expiredCard
                            req.session.codeCVV = codeCVV
                            req.session.withdraw = withdraw
                            req.session.note = note
                            return res.redirect('/users/services/rutTien')
                        } else {
                            if (withdraw < 50000) {
                                req.session.flash = {
                                        type: 'danger',
                                        intro: 'Lỗi',
                                        message: 'Mệnh giá rút phải từ 50.000 VND trở lên',
                                    }
                                    // req.session.message = "Mệnh giá rút phải từ 50.000 VND trở lên"
                                req.session.codeCard = codeCard
                                req.session.expiredCard = expiredCard
                                req.session.codeCVV = codeCVV
                                req.session.withdraw = withdraw
                                req.session.note = note
                                return res.redirect('/users/services/rutTien')
                            } else {
                                let email = req.session.email
                                db.query("select * from surplusAccount where email = ?", [email], (err, ress, fss) => {
                                    if (err) {
                                        message = err.message
                                        res.render('error', { message })
                                    } else {
                                        if (parseInt(withdraw) > parseInt(ress[0].surplus)) {
                                            req.session.flash = {
                                                type: 'danger',
                                                intro: 'Lỗi',
                                                message: 'Số tiền bạn rút về lớn hơn số có trong tài khoản',
                                            }
                                            req.session.codeCard = codeCard
                                            req.session.expiredCard = expiredCard
                                            req.session.codeCVV = codeCVV
                                            req.session.withdraw = withdraw
                                            req.session.note = note
                                            return res.redirect('/users/services/rutTien')
                                        } else {
                                            if (parseInt(withdraw) >= 5000000) {
                                                status = "chờ duyệt"
                                                rutTien(email, withdraw, codeCard, expiredCard, codeCVV, note, status, req, res)
                                            } else {
                                                status = "duyệt"
                                                rutTien(email, withdraw, codeCard, expiredCard, codeCVV, note, status, req, res)
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    }
                }
            })
        } else {
            let messages = result.mapped()
            let message = ''
            req.session.codeCard = codeCard
            req.session.expiredCard = expiredCard
            req.session.codeCVV = codeCVV
            req.session.withdraw = withdraw
            req.session.note = note
            for (let m in messages) {
                message = messages[m]
                break
            }
            req.session.flash = {
                type: 'danger',
                intro: 'Lỗi',
                message: message.msg,
            }
            return res.redirect('/users/services/rutTien')
        }
    }

    // [GET] /users/services/history
    historyService(req, res) {
        let name = req.session.name
        let username = req.session.username
        let email = req.session.email
        let sql = "select * from surplusAccount where email = ?"
        let param = [email]
        let message = ''
        db.query(sql, param, (e, result, fields) => {
            if (e) {
                message = e.message
                res.render('error', { message })
            } else {
                let surplus = result[0].surplus
                db.query("select * from historyServices where email = ?", [email], (err, ress, fss) => {
                    if (err) {
                        message = err.message
                        res.render('error', { message })
                    } else {
                        let options = {
                            name,
                            username,
                            surplus,
                            data: ress.reverse()
                        }
                        return res.render('rechargeHistory', options)
                    }
                })
            }
        })
    }

    // [GET] /users/services/transfer

    preTransfer(req, res) {
        let name = req.session.name
        let username = req.session.username
        let email = req.session.email
        let sql = "select * from surplusAccount where email = ?"
        let param = [email]
        db.query(sql, param, (e, result, fields) => {
            if (e) {
                message = e.message
                res.render('error', { message })
            } else {
                let surplus = result[0].surplus

                return res.render('transfer', { name, username, surplus })
            }
        })
    }

    // [POST] /users/services/transfer

    Transfer(req, res) {
        const { sdt, note, fee, transferMoney } = req.body

        let message = ''
        let emailSend = req.session.email
        let sql = "select * from account where sdt = ?"
        let param = [sdt]
        db.query(sql, param, (e, result, fields) => {
            if (e) {
                message = e.message
                res.render('error', { message })
            } else {
                if (result.length == 0) {
                    req.session.flash = {
                        type: 'danger',
                        intro: 'Lỗi',
                        message: 'Thẻ không tồn tại',
                    }
                    return res.redirect('/users/services/transfer')
                } else {
                    let otp = otpGenerator.generate(4, { digits: true, lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false })
                    let mess = `Your otp for transfer money is ${otp}`
                    let currentdate = new Date();
                    let emailReceive = result[0].email
                    let date = "" + currentdate.getFullYear() + '-' + (currentdate.getMonth() + 1) + '-' + currentdate.getDate()
                    let time = "" + currentdate.getHours() + ':' + currentdate.getMinutes() + ':' + currentdate.getSeconds()
                    let sql1 = "insert into otpCode(email, otp, date, time, status) values(?, ?, ?, ?, ?)"
                    let param1 = [emailSend, otp, date, time, "đang có"]
                    db.query(sql1, param1, (err, ress, fsss) => {
                        if (err) {
                            message = err.message
                            res.render('error', { message })
                        } else {
                            sendOTP(emailSend, mess, req, res)
                            req.session.noteTransfer = note
                            req.session.moneyTransfer = transferMoney
                            req.session.fee = fee
                            req.session.emailReceive = emailReceive
                        }
                    })
                }
            }
        })
    }

    // [GET] /users/services/otpTransfer
    enterOTP(req, res) {
        let name = req.session.name
        let username = req.session.username
        let email = req.session.email
        let sql = "select * from surplusAccount where email = ?"
        let param = [email]
        db.query(sql, param, (e, result, fields) => {
            if (e) {
                message = e.message
                res.render('error', { message })
            } else {
                let surplus = result[0].surplus

                return res.render('otpTransfer', { name, username, surplus })
            }
        })
    }

    // [POST] /users/services/otpTransfer
    transferMoney(req, res) {
        const { otp } = req.body
        let email = req.session.email
        let sql = "select * from otpCode where email = ?"
        let param = [email]
        db.query(sql, param, (e, results, fields) => {
            if (e) {
                message = e.message
                res.render('error', { message })
            } else {
                let row = results.reverse()
                console.log(row[0])
                console.log(otp)
                if (parseInt(otp) === parseInt(row[0].otp)) {
                    let moneyTransfer = req.session.moneyTransfer
                    let noteTransfer = req.session.noteTransfer
                    let emailReceive = req.session.emailReceive
                    let fee = req.session.fee
                    chuyenTien(email, emailReceive, moneyTransfer, noteTransfer, fee, req, res)
                } else {
                    req.session.flash = {
                        type: 'danger',
                        intro: 'Lỗi',
                        message: 'Sai mã otp',
                    }
                    return res.redirect('/users/services/otpTransfer')
                }
            }
        })
    }

    // [GET] /users/getName
    getName(req, res) {
        const { sdt } = req.body
        let sql = "select * from account where sdt = ?"
        let param = [sdt]
        db.query(sql, param, (e, result, fields) => {
            if (e) {
                message = e.message
                res.render('error', { message })
            } else {
                if (result.length === 0) {
                    return res.send(`Không tồn tại người dung có số điện thoại: ${sdt}`)
                } else {
                    let name = result[0].name
                    return res.send(name)
                }
            }
        })
    }

    // end services


    changeFirstPassword(req, res) {
        let username = req.body.username
        let pwd = req.body.pwd
        bcrypt.hash(pwd, saltRounds)
            .then(hash => {
                let sql = "update account set password = ?, password_first = ? where username = ?"
                let param = [hash, 1, username]
                db.query(sql, param, (e, result, fields) => {
                    if (e) {
                        message = e.message
                        res.render('error', { message })
                    } else {
                        return res.send("Change Password completely")
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    // [GET] /users/login
    login(req, res) {
        if (req.session.username) {
            return res.redirect('/users/')
        } else {
            return res.render('login')
        }
    }

    // [GET] /users/signup
    preRegister(req, res) {
            res.render('signUp')
        }
        // [POST] /users/signup
    Register(req, res, next) {
        const { sdt, email, name, ngaysinh, diachi } = req.body
        let pathUploads = path.join(__dirname, '../public/images');
        let file1 = req.files['attachment1'][0]
        let file2 = req.files['attachment2'][0]
        let message = ''

        let name1 = file1.originalname
        let newPath1 = path.join(pathUploads, name1)
        let name2 = file2.originalname
        let newPath2 = path.join(pathUploads, name2)
        fs.renameSync(file1.path, newPath1)
        fs.renameSync(file2.path, newPath2)

        let cccdFont = path.join('images', name1)
        let cccdBeside = path.join('images', name2)
        let username = otpGenerator.generate(10, { digits: true, lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false })
        let password = otpGenerator.generate(6)
        bcrypt.hash(password, saltRounds)
            .then(hash => {
                let sql = `insert into account(sdt, email, name, ngaysinh, diachi, image_cccd_truoc,
                 image_cccd_sau, username, password, status, password_first, position, activated) 
                 values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                let param = [sdt, email, name, ngaysinh, diachi, cccdFont, cccdBeside, username, hash, "chờ xác minh", 0, 0, 0]
                db.query(sql, param, (e, results, fields) => {
                    if (e) {
                        message = e.message
                        res.render('error', { message })
                    } else {
                        let sqls = "insert into surplusAccount(email, surplus) values(? ,?)"
                        let param1 = [email, 0]
                        db.query(sqls, param1, (errs, ress, fieldss) => {
                            if (errs) {
                                message = errs.message
                                res.render('error', { message })
                            }
                            console.log(ress)
                        })
                        sendUsPd(email, `Username: ${username}, Password: ${password}`)
                        return res.send('Register completely')
                    }
                })

            })
            .catch(e => {
                console.log(e.message)
            })
    }

    //[GET] /users/information
    informaiton(req, res) {
        let username = req.session.username
        let sql = "SELECT * FROM account WHERE username = ?"
        let param = [username]
        let message = ''
        db.query(sql, param, (e, result, fields) => {
            if (e) {
                message = e.message
                res.render('error', { message })
            } else {
                let email = req.session.email
                let sqlss = "select * from surplusAccount where email = ?"
                let paramss = [email]
                db.query(sqlss, paramss, (e, results, fieldss) => {
                    if (e) {
                        message = e.message
                        res.render('error', { message })
                    } else {
                        let surplus = results[0].surplus
                        let options = {
                            name: req.session.name,
                            data: result,
                            surplus: surplus
                        }
                        return res.render('detail_user', options)
                    }
                })
            }
        })
    }

    // [POST] /users/login
    enter(req, res) {
        const { username, password } = req.body

        let sql = "SELECT * FROM account WHERE username = ?"
        let param = [username]
        let message = ''
        db.query(sql, param, (e, result, fields) => {
            if (e) {
                message = e.message
                res.render('error', { message })
            } else if (result != "") {
                const hash = result[0].password
                const position = result[0].position
                bcrypt.compare(password, hash)
                    .then(match => {
                        if (match) {
                            var time = new Date()
                            if (result[0].blocked == 1) {
                                message = 'Tài khoản của bạn đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hổ trợ'
                                return res.render('login', { username, password, message })
                            }
                            if (result[0].disabled == 1) {
                                message = 'Tài khoản đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008'
                                return res.render('login', { username, password, message })
                            }
                            if (result[0].error == 3 && time - result[0].error_date < 100000) {
                                message = 'Tài khoản hiện đang bị khóa, vui lòng thử lại sau 1 phút'
                                return res.render('login', { username, password, message });
                            }
                            db.query("UPDATE `account` SET `error`= 0 WHERE `username` = ?", [username], (e, result, fields) => {
                                if (e) {
                                    message = e.message
                                    return res.render('error', { message })
                                }
                            })
                            if (position) {
                                req.session.name = result['0'].name
                                req.session.username = username
                                req.session.position = 1
                                return res.redirect('/admin')
                            } else {
                                req.session.position = 0
                                req.session.name = result['0'].name
                                req.session.username = username
                                req.session.email = result['0'].email
                                return res.redirect('/users')
                            }
                        } else {
                            const error = result[0].error;

                            if (error == 4) {
                                let sql = "UPDATE `account` SET `blocked` = 1 WHERE `username` = ?";
                                let param = [username];
                                db.query(sql, param, (e, result, fields) => {
                                    if (e) {
                                        message = e.message
                                        return res.render('error', { message })
                                    }
                                })
                                message = 'Tài khoản của bạn đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hổ trợ'
                                return res.render('login', { username, password, message })
                            }

                            if (error == 2) {
                                var time = new Date()
                                if (time - result[0].error_date >= 100000) {
                                    let sql = "UPDATE `account` SET `error`= error + 1, `error_date` = ? WHERE `username` = ?";
                                    let error_date = new Date()
                                    let param = [error_date, username];
                                    db.query(sql, param, (e, result, fields) => {
                                        if (e) {
                                            message = e.message
                                            return res.render('error', { message })
                                        }
                                    })
                                    message = 'password is not true'
                                    return res.render('login', { username, password, message })
                                }
                                message = 'Tài khoản hiện đang bị khóa, vui lòng thử lại sau 1 phút'
                                return res.render('login', { username, password, message })
                            }

                            let sql = "UPDATE `account` SET `error`= error + 1, `error_date` = ? WHERE `username` = ?";
                            let error_date = new Date()
                            let param = [error_date, username];
                            db.query(sql, param, (e, result, fields) => {
                                if (e) {
                                    message = e.message
                                    return res.render('error', { message })
                                }
                            })
                            message = 'password is not true'
                            return res.render('login', { username, password, message })
                        }
                    })
                    .catch(e => {
                        res.render('error', { message: e.message })
                    })
            } else {
                message = 'username or password is not true'
                return res.render('login', { username, password, message })
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
