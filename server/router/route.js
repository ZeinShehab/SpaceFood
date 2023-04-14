import { Router } from "express";
const router = Router();

/** import all controllers */
import * as controller from '../controllers/appController.js';
import { registerMail } from '../controllers/mailer.js'
import Auth, { localVariables } from '../middleware/auth.js';


/** POST Methods */
// router.route('/register').post((req,res)=>res.json('register route'))
router.route('/register').post(controller.register); // register user
router.route('/registerMail').post(registerMail); // send the email
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route('/login').post(controller.verifyUser,controller.login); // login in app

/** GET Methods */
router.route('/user/:username').get(controller.getUser) // user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP) // generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP) // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession) // reset all the variables


/** PUT Methods */
router.route('/updateuser').put(Auth, controller.updateUser); // is use to update the user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // use to reset password

/* PostModel */
/* POST Methods */
router.route('/user/:username/createPost').post(Auth,controller.createPost)

/* GET Methods */
router.route('/user/:username/getPosts').get(Auth,controller.getPosts)
router.route('/chefs').get(controller.getChefs)
router.route('/AllPosts').get(controller.getAllPosts)
router.route('/Post/:Id').get(controller.viewPost)
/* DELETE Methods */
router.route('/user/:username/DeleteAllPosts').delete(Auth,controller.deleteAllPosts)
router.route('/DeletePost/:Id').delete(controller.deletePost)
router.route('/Post/:Id/updatePost').put(controller.updatePost)

export default router;