const {check} = require('express-validator')

module.exports = [
    check('codeCard')
    .exists().withMessage('Vui lòng nhập mã thẻ')
    .notEmpty().withMessage('Mã thẻ không được để trống')
    .isLength({max: 6}).withMessage('mã thẻ tối đa 6 kí tự'),

    check('expiredCard')
    .exists().withMessage('Vui lòng nhập hạn thẻ')
    .notEmpty().withMessage('Hạn thẻ không được để trống'),

    check('codeCVV')
    .exists().withMessage('Vui lòng nhập mã CVV')
    .notEmpty().withMessage('Mã CVV không được để trống')
    .isLength({max: 3}).withMessage('mã CVV tối đa 3 kí tự'),

    check('withdraw')
    .exists().withMessage('Vui lòng nhập số tiền rút')
    .notEmpty().withMessage('Số tiền rút không được để trống'),

    check('note')
    .exists().withMessage('Vui lòng nhập ghi chú')
    .notEmpty().withMessage('Ghi chú không được để trống'),

]