import UserModel from '../model/User.model.js'
import PostModel from '../model/Post.model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
import otpGenerator from 'otp-generator';

/** middleware for verify user */
export async function verifyUser(req, res, next){
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}


/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req,res){

    try {
        const { username, password, profile, email } = req.body;        

        // check the existing user
        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }, function(err, user){
                if(err) reject(new Error(err))
                if(user) reject({ error : "Please use unique username"});

                resolve();
            })
        });

        // check for existing email
        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }, function(err, email){
                if(err) reject(new Error(err))
                if(email) reject({ error : "Please use unique Email"});

                resolve();
            })
        });


        Promise.all([existUsername, existEmail])
            .then(() => {
                if(password){
                    bcrypt.hash(password, 10)
                        .then( hashedPassword => {
                            
                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            });

                            // return save result as a response
                            user.save()
                                .then(result => res.status(201).send({ msg: "User Register Successfully"}))
                                .catch(error => res.status(500).send({error}))

                        }).catch(error => {
                            return res.status(500).send({
                                error : "Unable to hash password"
                            })
                        })
                }
            }).catch(error => {
                return res.status(500).send({ 'existing username or existing Email': error })
            })


    } catch (error) {
        return res.status(500).send('Error catched' ,error);
    }

}


/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req,res){
   
    const { username, password } = req.body;

    try {
        
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"});

                        // create jwt token
                        const token = jwt.sign({
                                        userId: user._id,
                                        username : user.username
                                    }, ENV.JWT_SECRET , { expiresIn : "24h"});

                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });                                    

                    })
                    .catch(error =>{
                        return res.status(400).send({ error: "Password does not Match"})
                    })
            })
            .catch( error => {
                return res.status(404).send({ error : "Username not Found"});
            })

    } catch (error) {
        return res.status(500).send({ error});
    }
}


/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req,res){
    
    const { username } = req.params;

    try {
        
        if(!username) return res.status(501).send({ error: "Invalid Username"});

        UserModel.findOne({ username }, function(err, user){
            if(err) return res.status(500).send({ err });
            if(!user) return res.status(501).send({ error : "Couldn't Find the User"});

            /** remove password from user */
            // mongoose return unnecessary data with object so convert it into json
            const { password, ...rest } = Object.assign({}, user.toJSON());

            return res.status(201).send(rest);
        })

    } catch (error) {
        return res.status(404).send({ error : "Cannot Find User Data"});
    }

}


/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req,res){
    try {
        
        // const id = req.query.id;
        const { userId } = req.user;

        if(userId){
            const body = req.body;

            // update the data
            UserModel.updateOne({ _id : userId }, body, function(err, data){
                if(err) throw err;

                return res.status(201).send({ msg : "Record Updated...!"});
            })

        }else{
            return res.status(401).send({ error : "User Not Found...!"});
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}


/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req,res){
   if(req.app.locals.resetSession){
        return res.status(201).send({ flag : req.app.locals.resetSession})
   }
   return res.status(440).send({error : "Session expired!"})
}


// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req,res){
    try {
        
        if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired!"});

        const { username, password } = req.body;

        try {
            
            UserModel.findOne({ username})
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({ username : user.username },
                            { password: hashedPassword}, function(err, data){
                                if(err) throw err;
                                req.app.locals.resetSession = false; // reset session
                                return res.status(201).send({ msg : "Record Updated...!"})
                            });
                        })
                        .catch( e => {
                            return res.status(500).send({
                                error : "Enable to hashed password"
                            })
                        })
                })
                .catch(error => {
                    return res.status(404).send({ error : "Username not Found"});
                })

        } catch (error) {
            return res.status(500).send({ error })
        }

    } catch (error) {
        return res.status(401).send({ error })
    }
}
/** POST: http://localhost:8080/api/updateuser 
 * @param: {
  "id" : "value"
}
body: {
    title: '',
    photo : '',
}
*/
export async function createPost(req,res){
    try{
        const {username} = req.params
        
        const {title, photo,tags,description} = req.body
        if(!title || !photo){
            return res.status(422).send("Please enter all fields")
        }
        let exist = await UserModel.findOne({ username});
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        if(exist.role !="Chef"){
            return res.status(401).send({error: "You must be a chef before posting"})
        }
        const post = new PostModel({
            title,
            photo,
            tags,
            description,
            owner: exist
        })
        post.save()
        .then(result => res.status(201).send({ msg: "Post created Successfully"}))
        .catch(error => res.status(500).send({error}))

    }catch(error){
        return res.status(401).send({ error: "Couldn't create Post, try again later." });
    }

}
/** POST: http://localhost:8080/api/updateuser 
 * @param: {
  "id" : "value"
}
*/
export async function getPosts(req,res){
    try{
        const {username} = req.params
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        if(exist.role !="Chef"){
            return res.status(401).send({error: "You must be a chef in order to post and view your posts"})
        }
        PostModel.find({owner: exist}).then(async myposts =>{
            const modifiedPosts = await Promise.all(myposts.map(async post => {
                const owner = await UserModel.findById(post.owner);
                return {...post.toObject(), owner: owner.username}
            }));
            res.json(modifiedPosts)
        }).catch(error=>{console.log("error occured")})
    }catch(error){
        res.status(500).send({error:"Unable to get posts "})
    }
}

export async function getChefs(req,res){
    try{
        const users = await UserModel.find({ role: "Chef" }).exec();
        if(!users){return res.status(404).send({ error : "No chefs found"});}
        res.json(users)
    }catch(err){
        res.status(500).send({error : "Couldn't get all chefs"})
    }
}

export async function getAllPosts(req,res){
    try{
        const posts = await PostModel.find().populate({ path: 'owner', model: UserModel, select: 'username' })
        if(!posts){res.status(404).send({error: "No posts found"})}
        const modifiedPosts = posts.map(post => {
            return {
                ...post._doc,
                owner: post.owner.username
            }
        })

        res.json(modifiedPosts)
    }catch(err){
        res.status(500).send({error: "Couldn't get all posts"})
    }
}
/* DELETES all posts for a user */
export async function deleteAllPosts(req,res){
    try{
        const {username} = req.params
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        await PostModel.deleteMany({owner: exist})
        res.status(200).send("All posts deleted successfully!")

    }catch(error){
        res.status(500).send({error: "Couldn't delete all posts"})
    }
}

export async function deletePost(req,res){
    try{
        const PostId = req.params.Id
        let exist = await PostModel.findById({_id: PostId})
        if(!exist) return res.status(404).send({ error : "Can't find Post!"});
        await PostModel.deleteOne({_id: PostId})
        return res.status(200).send("Post Deleted Successfully !")
    }catch(error){
        res.status(500).send({error: "Couldn't delete this post"})
    }
}
export async function viewPost(req,res){
    try{
        const postId = req.params.Id;
        let post = await PostModel.findById(postId).populate({
            path: 'comments.postedBy',
            select: '_id username'
        }).populate('owner', 'username');
        if(!post) {return res.status(404).send({error: "Post not found"})}
        return res.json(post)
    }catch(error){
        res.status(500).send({error: "Couldn't view this post"})
    }
}


export async function updatePost(req,res){
    try {
        
        // const id = req.query.id;
        const  postId  = req.params.Id;
        if(postId){
            const body = req.body;
            
            // update the data
            PostModel.updateOne({ _id : postId }, body, function(err, data){
                if(err) throw err;

                return res.status(201).send({ msg : "Record Updated...!"});
            })

        }else{
            return res.status(401).send({ error : "Post Not Found...!"});
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}

export async function addComment(req, res) {
    const user = await UserModel.findById(req.body.postedBy);
    let comment = req.body
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.Id,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate({
        path: "comments.postedBy",
        select: "_id username",
        options: { strictPopulate: false } // add the strictPopulate option to override the error
      })
      .exec();
  
    res.json(updatedPost);
  }
  
//this sends the post to the front with owner being the id and the username. we can modify this later 

export async function addBookmark(req, res){
    try{
        const {username} = req.params
        const postId = req.body.post
        const post = await PostModel.findById(postId)
        const user = await UserModel.findOneAndUpdate({ username: username }, { $push: { bookmarkedPosts: post } }, { new: true });
        return res.status(201).send("Bookmark added!")
    }catch(error){
        res.status(500).send({error})
    }
    
}

export async function removeBookmark(req,res){
    try{
        const {username} = req.params
        const postId = req.body.post
        const user = await UserModel.findOneAndUpdate({ username: username }, { $pull: { bookmarkedPosts: postId } }, { new: true });
        return res.status(201).send("Bookmark removed!")
    }catch(error){
        res.status(500).send({error})
    }
}

export async function viewBookmarks(req,res){
    try{
        const {username} = req.params
        let user = await UserModel.findOne({ username });
        if(user){
        const bookmarkedPostIds = user.bookmarkedPosts;
        const bookmarkedPosts = await Promise.all(
          bookmarkedPostIds.map(async (postId) => {
            const post = await PostModel.findById(postId).populate({
                path: "owner",
                select: "username",
              }).exec();
            return post
          })
        );
        const validBookmarkedPosts = bookmarkedPosts.filter((post) => post !== null);
        return res.json(validBookmarkedPosts);
        }
        else{
            console.log("Can't find user")
        }
    }catch(error){
        return res.status(500).send({error: "Please try again later"})
    }
}

export async function modifyRating(req, res) {
    try {
      const { username, postId } = req.params;
      const { rating } = req.body;
      // Find the user
      
      const user = await UserModel.findOne({ username });
      if (!user) {
        return res.status(400).send("User not found");
      }
      // Check if the user has already rated the post
      const hasRatedPost = user.ratedPosts.some((ratedPost) => ratedPost.postId && ratedPost.postId.equals(postId));
      const post = await PostModel.findById(postId);
      post.ratings = post.ratings.filter(rating=>rating!==0)
      if (!post) {
        return res.status(400).send("Post not found");
      }
      if (hasRatedPost) {
        // Update the rating value for the post
        const existingRatingIndex = user.ratedPosts.findIndex(
          (ratedPost) => ratedPost.postId && ratedPost.postId.equals(post._id)
        );
        if(rating == 0){
            user.ratedPosts.splice(existingRatingIndex,1);
            const index = post.ratings.findIndex((rating) => rating.ratedBy && rating.ratedBy.equals(user._id))
            post.ratings.splice(index, 1);
        }
        else{
            if (existingRatingIndex === -1) {
            return res.status(400).send("User has not rated this post");
            }
            user.ratedPosts[existingRatingIndex].rating = rating;
            const index = post.ratings.findIndex((rating) => rating.ratedBy && rating.ratedBy.equals(user._id))
            if(index === -1){
                return res.status(400).send("Post does not have rating from this user")
            }
            post.ratings[index] = {rating,ratedBy:user._id}; // if you put user the whole user will show
    }
      } else {
        // Add the rating value to the post and add the post ID to the user's ratedPosts
        
        post.ratings.push({rating, ratedBy: user._id });
        
        user.ratedPosts.push({postId,rating});
        
      }
    
    const sumOfRatings = post.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = sumOfRatings / post.ratings.length;
    post.rating = averageRating;
  
      await post.save();
      await user.save();
      res.json(post);
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  export async function updatePostRatings(req,res){
    try{
        const postId = req.params.Id
        const post = await PostModel.findById(postId)
        post.ratings=[]
        await post.save()
        res.json(post)
    }catch(error){
        res.status(500).send({error})
    }
}
export async function updateUserRatings(req,res){
    try{
        const username = req.params.username
        const user = await UserModel.findOne({username})
        user.ratedPosts=[]
        await user.save()
        res.json(user)
    }catch(error){
        res.status(500).send({error})
    }
}

export async function deleteComment(req,res){
    try{
        const postId = req.params.Id
    
        const commentId = req.body.comment
        
        const username = req.params.username
        
        
        const post = await PostModel.findById(postId)
        
        const user = await UserModel.findOne({username})

        const comment = post.comments.find((comment) => comment._id == commentId);
        
        

        if (!comment) {
            
            return res.status(400).send("Comment not found");
        }
        if(!comment.postedBy.equals(user._id)){
            
            return res.status(400).send("User doesn't own this comment")
        }
        
        const index = post.comments.findIndex((comment) => comment._id == commentId);
        
        post.comments.splice(index, 1);
        
        // Save the post
        await post.save();
        res.json(post);
    }catch(error){
        res.status(500).send({error})
    }
}

export async function editPost(req,res){
    const id  = req.params.Id;
    const { title, description, photo, tags } = req.body;
    try {
        const post = await PostModel.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        post.title = title || post.title;
        post.description = description || post.description;
        post.photo = photo || post.photo;
        post.tags = tags || post.tags;
        await post.save();
        res.json({ message: 'Post updated successfully' });
  } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
  }
}