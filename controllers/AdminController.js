const db = require('../models/db')

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
function sendTransferMail(email, message, req, res){
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Chuyển tiền',
        text: message
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
        console.log(err)
        }else{
            console.log('Email sent')
            return res.send('Chấp thuận thành công')
        }
    })
}

function chuyenTien(emailSend, emailReceived, moneyTransfer, fee, req, res){
    if(fee === "receive"){
        db.query("update surplusAccount set surplus = surplus - ? where email = ?", [moneyTransfer, emailSend], (e, results, fields) => {
            if(e){
                console.log(e)
            }else{
                let feeTransfer = moneyTransfer*5/100
                db.query("update surplusAccount set surplus = surplus + ? - ? where email = ?", [moneyTransfer, feeTransfer, emailReceived], (err, resss, fssss) => {
                    if(err){
                        console.log(err)
                    }else{
                        let money = parseInt(moneyTransfer).toLocaleString('vi', {style : 'currency', currency : 'VND'})
                        sendTransferMail(emailReceived, `Bạn đã được chuyển khoản từ ${emailSend} với số tiền là ${money} VND`, req, res)
                    }
                })
            }
        })
    }else{
        let feeTransfer = moneyTransfer*5/100
        db.query("update surplusAccount set surplus = surplus - ? - ? where email = ?", [moneyTransfer, feeTransfer, emailSend], (e, results, fields) => {
            if(e){
                console.log(e)
            }else{
                db.query("update surplusAccount set surplus = surplus + ? where email = ?", [moneyTransfer, emailReceived], (err, resss, fssss) => {
                    if(err){
                        console.log(err)
                    }else{
                        let money = parseInt(moneyTransfer).toLocaleString('vi', {style : 'currency', currency : 'VND'})
                        sendTransferMail(emailReceived, `Bạn đã được chuyển khoản từ ${emailSend} với số tiền là ${money} VND`, req, res)
                    }
                })
            }
        })
    }

}

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
        let sql = "SELECT * FROM account WHERE status = ? or status = ? and username != ?"
        let param = ["chờ xác minh", "yêu cầu bổ sung", "admin"]
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
        let sql = "SELECT * FROM account WHERE username != ? and activated = ?"
        let param = ["admin", 0]
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
        let sql = "SELECT * FROM account WHERE status = ? and username != ? or blocked = ?"
        let param = ["đã vô hiệu hóa", "admin", 1]
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
        let message = ""
        db.query("select * from historyServices where status = ?", ["chờ duyệt"], (err, results, fields) => {
            if(err){
                message = err.message
                return res.render('error', {message: message})
            }else{
                db.query("select * from historyTransfer where status = ?", ["chờ duyệt"], (errs, resultss, fieldss) => {
                    if(errs){
                        message = err.message
                        return res.render('error', {message: message})
                    }else{
                        console.log(results)
                        console.log(resultss)
                        let options = {
                            name: name,
                            dataNopRut: results.reverse(),
                            dataTransfer: resultss.reverse(),
                        }
                        return res.render('approve_withdraw_money', options)
                    }
                })
            }
        })
    }

    // [GET] /admin/detailUser
    detailUser(req, res){
        let email = req.params.email
        let sql = "SELECT * FROM account WHERE email = ?"
        let param = [email]
        let position = 1
        db.query(sql, param, (err, resulst, fields) => {
            if(err){
                return res.render('error', {message: err.message})
            }else{
                if(resulst[0].status === "đã vô hiệu hóa"){
                    let voHieuHoa = true
                    let options = {
                        name: req.session.name,
                        data: resulst,
                        position: position,
                        voHieuHoa: voHieuHoa,
                    }
                    return res.render('detail_user_admin', options)        
                }
                else if(resulst[0].status === "chờ xác minh" || resulst[0].status === "yêu cầu bổ sung"){
                    let choXacMinh = true
                    let options = {
                        name: req.session.name,
                        data: resulst,
                        position: position,
                        choXacMinh: choXacMinh,
                    }
                    return res.render('detail_user_admin', options)
                }else{
                    let options = {
                        name: req.session.name,
                        data: resulst,
                        position: position,
                    }
                    return res.render('detail_user_admin', options)
                }           
            }
        })
        
    }

    // [POST] /admin/approveActivated
    approve_activated_account(req, res){
        let email = req.body.email
        let sql = "update account set status = ?, activated = ? where email = ?"
        let param = ["đã xác minh", 1, email]
        db.query(sql, param, (err, resulst, fields) => {
            if(err){
                return res.render('error', {message: err.message})
            }
            if(resulst.affectedRows === 1){
                return res.send('Xác minh tài khoản thành công')
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
            return res.send('Vô hiệu hoá tài khoản thành công')
        }
    })
    }

    // [POST] /admin/additionalRequest/
    additionalRequest(req, res){
        let email = req.body.email
        let sql = "update account set status = ? where email = ?"
        let param = ["yêu cầu bổ sung", email]
        db.query(sql, param, (err, resulst, fields) => {
            if(err){
                return res.render('error', {message: err.message})
            }
            if(resulst.affectedRows === 1){
                return res.send('Yêu cầu bổ sung thông tin thành công')
            }
        })
    }

    // [POST] /admin/recoveryAccount/
    recoveryAccount(req, res){
        let email = req.body.email
        let sql = "update account set status = ?, blocked = ?, error = ? where email = ?"
        let param = ["chờ xác minh", 0, 0, email]
        db.query(sql, param, (err, resulst, fields) => {
            if(err){
                return res.render('error', {message: err.message})
            }
            if(resulst.affectedRows === 1){
                return res.send('Khôi phục tài khoản thành công')
            }
        })
    }

    // [GET] /admin/detailNopRut/:id
    detailNopRut(req, res){
        let id = req.params.id
        let position = req.session.position
        db.query("select * from historyServices where id = ?", [id], (err, results, fields) => {
            if(err){
                return res.render('error', {message: err.message})
            }else{
                let options = {
                    data: results,
                    name: req.session.name,
                    position: position,
                }
                return res.render('detailNopRut', options)
            }
        })
    }

    // [GET] /admin/detailTransfer/:id
    detailTransfer(req, res){
        let id = req.params.id
        let position = req.session.position
        db.query("select * from historyTransfer where id = ?", [id], (err, results, fields) => {
            if(err){
                return res.render('error', {message: err.message})
            }else{
                let options = {
                    data: results,
                    name: req.session.name,
                    position: position,
                }
                return res.render('detailTransfer', options)
            }
        })
    }

    // [POST] /admin/approveNopRut
    approveNopRut(req, res){
        const id = req.body.id
        db.query("select * from historyServices where id = ?", [id], (errorss, resssss, fssss) => {
            if(errorss){
                return res.render('error', {message: errorss.message})
            }else{
                let kq = resssss[0]
                db.query('update historyServices set status = ? where id = ?', ['duyệt', id], (err, results, fields) => {
                    if(err){
                        return res.render('error', {message: err.message})
                    }else{
                        console.log(kq)
                        if(kq.type === "Nạp tiền"){
                            db.query("update surplusAccount set surplus = surplus + ? where email = ?", [kq.recharge, kq.email], (e, ress, fss) => {
                                if(e){
                                    return res.render('error', {message: e.message})
                                }else{
                                    return res.send('Chấp thuận yêu cầu nạp tiền thành công')
                                }
                            })
                        }else{
                            db.query("update surplusAccount set surplus = surplus - ? where email = ?", [kq.recharge, kq.email], (e, ress, fss) => {
                                if(e){
                                    return res.render('error', {message: e.message})
                                }else{
                                    return res.send('Chấp thuận yêu cầu rút tiền thành công')
                                }
                            })
                        }
                    }
                })
            }
        })
    }
    // [POST] /admin/cancelNopRut
    cancelNopRut(req, res){
        const id = req.body.id
        db.query('update historyServices set status = ? where id = ?', ['từ chối', id], (err, results, fields) => {
            if(err){
                return res.render('error', {message: err.message})
            }else{
                return res.send('Từ chối yêu cầu thành công')
            }
        })
    }
    // [POST] /admin/approveTransfer
    approveTransfer(req, res){
        const id = req.body.id
        db.query("select * from historyTransfer where id = ?", [id], (errorss, resssss, fssss) => {
            if(errorss){
                return res.render('error', {message: errorss.message})
            }else{
                let kq = resssss[0]
                db.query('update historyTransfer set status = ? where id = ?', ['duyệt', id], (err, results, fields) => {
                    if(err){
                        return res.render('error', {message: err.message})
                    }else{
                        chuyenTien(kq.emailSend, kq.emailReceive, kq.money, kq.typeFee, req, res)
                    }
                })
            }
        })
    }
    // [POST] /admin/cancelTransfer
    cancelTransfer(req, res){
        const id = req.body.id
        db.query('update historyTransfer set status = ? where id = ?', ['từ chối', id], (err, results, fields) => {
            if(err){
                return res.render('error', {message: err.message})
            }else{
                return res.send('Từ chối yêu cầu thành công')
            }
        })
    }

}

module.exports = new AdminController