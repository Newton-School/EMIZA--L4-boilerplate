const express = require("express");

const { createTask, Taskdetail, Taskupdate, Taskdelete, alltask } = require("../controllers/taskControllers");
const { isowner } = require("../middleware/taskmiddleware.js");

const router = express.Router();

router.get("/", alltask);
router.post("/create", createTask);
router.get("/detail", isowner() , Taskdetail);
router.post("/delete", isowner() , Taskdelete);
router.post("/update", isowner() , Taskupdate);

module.exports = router;