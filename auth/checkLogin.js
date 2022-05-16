module.exports = (req, res, next) => {
    if(req.session.username){
        next()
    }else{
        next()
        return res.redirect('/users/login')
    }
}