class WalletController{
     // [GET] /wallet/
     index(req, res){
        return res.send('Welcome wallet page')
    }
}

module.exports = new WalletController