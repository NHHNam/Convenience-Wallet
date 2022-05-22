module.exports = (req, res, next) => {
    if(req.session.username){
        req.username = req.session.username 
        next()
    }else{
        return res.redirect('/users/login')
    }
}