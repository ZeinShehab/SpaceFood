import { Router } from "express";
const router = Router();

/** import all controllers */
import * as controller from '../controllers/appController.js';
import { registerMail, verifyChef } from '../controllers/mailer.js'
import Auth, { localVariables } from '../middleware/auth.js';


/** POST Methods */
// router.route('/register').post((req,res)=>res.json('register route'))
router.route('/register').post(controller.register); // register user
router.route('/registerMail').post(registerMail); // send the email

router.route('/verifyChef').post(verifyChef)


router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route('/login').post(controller.verifyUser,controller.login); // login in app

/** GET Methods */
router.route('/user/:username').get(controller.getUser) // user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP) // generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP) // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession) // reset all the variables
router.route('/getEmail').get(controller.getUserByEmail)

/** PUT Methods */
router.route('/updateuser').put(Auth, controller.updateUser); // is use to update the user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // use to reset password

/* PostModel */
/* POST Methods */
router.route('/user/:username/createPost').post(Auth,controller.createPost)

/* GET Methods */
router.route('/user/:username/getPosts').get(controller.getPosts)
router.route('/chefs').get(controller.getChefs)
router.route('/AllPosts').get(controller.getAllPosts)
router.route('/Post/:Id').get(controller.viewPost)
router.route('/user/:username/Bookmarks').get(controller.viewBookmarks)
/* DELETE Methods */
router.route('/user/:username/DeleteAllPosts').delete(Auth,controller.deleteAllPosts)
router.route('/DeletePost/:Id').delete(controller.deletePost)
/* PUT Methods */
router.route('/Post/:Id/updatePost').put(controller.updatePost)
router.route('/Post/:Id/addComment').put(controller.addComment)
router.route('/user/:username/Bookmark').put(controller.addBookmark)
router.route('/user/:username/removeBookmark').put(controller.removeBookmark)
router.route('/user/:username/post/:postId').put(controller.modifyRating)
router.route('/post/:Id/updateRatings').put(controller.updatePostRatings)
router.route('/user/:username/updateRatings').put(controller.updateUserRatings)
router.route('/user/:username/post/:Id/deleteComment').put(controller.deleteComment)
router.route('/Post/:Id/editPost').put(controller.editPost)
export default router;