module.exports = (req, res, next) => {
    if(req.session.position){
        next()
    }else{
        next()
        return res.redirect('/users')
    }
}