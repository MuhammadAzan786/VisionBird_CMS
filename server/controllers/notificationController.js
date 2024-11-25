const notificationModel = require("../models/notificationModel");

module.exports = {
    deleteNotification: async (req, res) => {
        try{
            const _id = req.params.id;
            await notificationModel.findByIdAndDelete({ _id });
            res.status(200).json({ message: "Notification deleted successfully."});
          } catch (error) {
            console.error("Error deleting notification:", error);
            res.status(500).json({ error: "Error in deleting notification"});
          }    
    }
};