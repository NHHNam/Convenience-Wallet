class UserController{
    // [GET] /user/
    index(req, res){
        return res.send('Welcome user page')
    }
}

module.exports = new UserController