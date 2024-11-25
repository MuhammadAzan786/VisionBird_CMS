const express = require("express");
const router = express.Router();
const Project_controller = require("../controllers/projectcontroller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const auth = require('../Middlewares/auth');
const authorizeRoles= require('../Middlewares/authorization') 


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

  // creating project

  router.post("/create_project",auth,authorizeRoles('admin','manager','employee'), upload.fields(
    {name: "project_images"},
  )
 , Project_controller.create_project);

 router.get("/all_projects",auth,authorizeRoles('admin','manager','employee'),Project_controller.get_projects);

 router.get("get_project/:id", auth,authorizeRoles('admin','manager','employee'),Project_controller.get_project);

 router.get("/delete_project/:id",auth,authorizeRoles('admin','manager','employee'), Project_controller.delete_project);

 module.exports = router;