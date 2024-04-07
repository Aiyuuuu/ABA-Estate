const express = require('express');
const controller = require('./../Controller/routeController');
const router = express.Router();

router.route('/')
    .get(controller.showAuthenticationPage);
    
router.route('/submit')
    .post(controller.signUp);
    
router.route('/login')
.post(controller.login);

router.route('/home')
    .get(controller.showHome);

router.route('/details/:id')
    .get(controller.validate,controller.getIdHouseDetails);

router.route('/details/send-email')
    .post(controller.sendEmail);

router.route('/details')
    .get(controller.details);

router.route('/cards')
    .get(controller.showCards);

module.exports = router;