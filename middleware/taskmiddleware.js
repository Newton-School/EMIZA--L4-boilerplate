const tasks   = require("../models/task.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "newtonSchool";

/*

req.body = {
    "task_id"    : task_id,
    "token"      : token
}

Response

1. if Given task_id does not exist in Tasks 

403 Status code

json = {
    "status": 'fail',
    'message': 'Given task doesnot exist'
}

2. if creator_id of task that belong to task_id is not same as userId that we get from payload of token
   means this is not the owner of given task hence

404 Status code
json = 
{
    'status': 'fail',
    'message': 'Access Denied'
}

3. if creator_id of task that belong to task_id is same as userId that we get from payload of token
   means this is the owner of given task hence

200 Status code with allowing further.

*/

function isowner() {
    try {
        return function (req, res, next) {

            const {task_id, token} = req.body;
            const decodedToken = jwt.verify(token, JWT_SECRET);
            const user_id = decodedToken.userId;

            tasks.findById(task_id).then((task)=> {

                if(String(task.creator_id) == user_id){
                    next();
                }
                else{
                    res.status(404).json({
                        'status': 'fail',
                        'message': 'Access Denied'
                    })
                }
            }).catch((err) => {
                res.status(403).json({
                    "status": 'fail',
                    'message': 'Given task doesnot exist'
                })
            });
            
        }
    } catch (err) {
        return res.status(400).json({
            'status': "error",
            'message': "Unable to check"
        })
    }
}

module.exports = { isowner };