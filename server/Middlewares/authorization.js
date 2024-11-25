const User = require("../models/employeemodel");

const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    // console.log("on authorization");

    // Ensure the user is authenticated
    // console.log("requested user", req.user);
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user information available" });
    }

    try {
      // Fetch the user from the database asynchronously
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // console.log("User role:", user.role);
      // console.log("Allowed roles:", allowedRoles);

      const userRole = user.role; // Get the role from the database user object

      // Handle case where role is undefined
      if (!userRole) {
        return res
          .status(403)
          .json({ message: "Forbidden: No role found for user" });
      }

      // Check if user's role is included in the allowed roles array
      if (!allowedRoles.includes(userRole)) {
        console.log("u don't have authority");
        return res.status(403).json({
          message: `Forbidden: You need one of the following roles: ${allowedRoles.join(
            ", "
          )}`,
        });
      }

      // console.log("u have authority");
      next(); // User is authorized, proceed to the next middleware or route
    } catch (error) {
      console.error("Error in authorization middleware:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};

module.exports = authorizeRoles;
