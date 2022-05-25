module.exports = (req, res, next) => {
    if(req.session.username){
        next()
    }else{
        return res.redirect('/users/login')
    }
}