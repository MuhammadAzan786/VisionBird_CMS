const express = require("express");
const router = express.Router();
const multer = require("multer");
const interneeController = require("../controllers/interneecontroller");

const auth = require("../Middlewares/auth");
const authorizeRoles = require("../Middlewares/authorization");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/create_internee", auth, authorizeRoles("admin", "manager"), interneeController.Add_internee);

router.patch("/update_internee/:id", auth, authorizeRoles("admin", "manager"), interneeController.Update_internee);

router.get("/get_internees", auth, authorizeRoles("admin", "manager"), interneeController.Get_All_internees);
router.get("/get_internee/:id", auth, authorizeRoles("admin", "manager"), interneeController.Get_internee);
router.delete("/delete_internee/:id", authorizeRoles("admin", "manager"), auth, interneeController.Delete_internee);

router.get("/get_active_internees", auth, authorizeRoles("admin", "manager"), interneeController.active_internees);

router.get("/get_inactive_internees", auth, authorizeRoles("admin", "manager"), interneeController.inactive_internees);

router.put(
  "/update_internee_status/:id",
  auth,
  authorizeRoles("admin", "manager"),
  interneeController.update_internee_status
);
module.exports = router;
