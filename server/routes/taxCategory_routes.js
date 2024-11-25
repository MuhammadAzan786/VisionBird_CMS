const express = require("express");
const router = express.Router();
const taxCategoryController = require("../controllers/taxCategorycontroller");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const auth = require("../Middlewares/auth");
const authorizeRoles = require("../Middlewares/authorization");

router.post(
  "/create_tax_category",
  auth,
  authorizeRoles("admin", "manager"),
  upload.single("image"),
  taxCategoryController.add_category
);

router.delete(
  "/delete_category/:id",
  auth,
  authorizeRoles("admin", "manager"),
  taxCategoryController.delete_category
);
router.get(
  "/get_categories",
  auth,
  authorizeRoles("admin", "manager"),
  taxCategoryController.get_all_categories
);
router.get(
  "/get_category/:id",
  auth,
  authorizeRoles("admin", "manager"),
  taxCategoryController.get_category
);
router.put(
  "/update_category/:id",
  auth,
  authorizeRoles("admin", "manager"),
  upload.single("image"),
  taxCategoryController.update_category
);
module.exports = router;
