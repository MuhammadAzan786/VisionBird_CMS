const express = require("express");
const router = express.Router();
const Post_controller = require("../controllers/postcontroller");
const multer = require("multer");

const auth = require("../Middlewares/auth");
const authorizeRoles = require("../Middlewares/authorization");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/createPostImg",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  upload.array("project_images", 5),
  Post_controller.createPostImg
);

router.post(
  "/create_post",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  Post_controller.create_post
);
router.get(
  "/get_all_posts/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  Post_controller.get_all_posts
);
router.get(
  "/get_all_emp_posts",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  Post_controller.get_all_emp_posts
);
router.get(
  "/PostDataById/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  Post_controller.PostDataById
);
router.delete(
  "/delete_post/:id",
  auth,
  authorizeRoles("admin", "manager", "employee"),
  Post_controller.deletePost
);
module.exports = router;
