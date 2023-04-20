const users   = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt  = require('bcrypt');

const saltRounds = 10;
const JWT_SECRET = "newtonSchool";

const loginUser =async (req, res) => {

    const email  = req.body.email;
    const password = req.body.password;

    const user = await users.findOne({ 'email':email });

    if(user){

        if(bcrypt.compareSync(password , user.password)){

            const token = jwt.sign(
                { userId: user._id, name: user.name, email: user.email, role:user.role },
                JWT_SECRET,
                {
                    expiresIn: "1h",
                }
            );

            res.status(200).json({
                "status": 'success',
                "token" : token
            });
        }else{
            res.status(403).json({
                "message": 'Invalid Password, try again !!',
                "status": 'fail'
            });
        }
    }else{
        res.status(404).json({
            "message": 'User with this E-mail does not exist !!',
            "status": 'fail'
        });
    }

}



const signupUser = async (req, res) => {

    var {email, password, name, role} = req.body;


    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    var newuser = {
        "name":name,
        "email":email,
        "password": hashedPassword,
        "role": role
    };

    users.create(newuser).then((user) => {
        res.status(200).json({
            "message": 'User SignedUp successfully',
            "status": 'success'
        });
    })
    .catch((error) => {
        res.status(404).json({
            "status": 'fail',
            "message": error.message
        });
    });

}

/*
 You need to implement a logout controller which takes an token as input from req.body, verifies the token, clears the cookie and logs out the user.
 
 req.body = {
    "token": token
 }

 Instructions:
 
 If the token is missing, the controller should respond with a 401 Unauthorized status and a JSON object containing a 'message' field with value 'Authentication failed: Missing token.', and a 'status' field with value 'fail'.
  
 If the token is valid, the controller should clear the cookie and respond with a 200 OK status and a JSON object containing a 'message' field with value 'Logged out successfully.', and a 'status' field with value 'success'.
 
 If there is an error during the JWT verification process or clearing the cookie, the controller should respond with a 500 Internal Server Error status and a JSON object containing a 'message' field with value 'Something went wrong', a 'status' field with value 'fail', and an 'error' field with the error object.
 
 Input:
 Authorization Token, token is present in req.hearders.authorization
 
 Output:
 {
 "message": "Logged out successfully.",
 "status": "Success"
 }
 */

const logout = (req, res) => {
    const token = req.body.token;
    //Write your code here.
};

module.exports = { loginUser , signupUser, logout };