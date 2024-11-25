const taxCategoryModel = require("../models/taxCategorymodel");
const taxFilesModel = require("../models/taxFilesmodel");
const cloudinary = require("../utils/cloudinaryConfig");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

module.exports = {
  add_category: async (req, res) => {
    try {
      const { categoryTitle, categoryCode, categoryDescription } = req.body;

      const { publicId, src } = await uploadToCloudinary(
        req.file.buffer,
        "auto",
        "Tax Categories"
      );

      const taxCategory = new taxCategoryModel({
        categoryTitle,
        categoryCode,
        categoryDescription,
        categoryImage: {
          publicId,
          src,
        },
      });

      taxCategory.save();

      res.json({ message: "Tax Category Added Successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "This category cannot be created." });
    }
  },

  delete_category: async (req, res) => {
    try {
      const categoryId = req.params.id;

      // Find the category by ID
      const category = await taxCategoryModel.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      // Find files associated with the category
      const files = await taxFilesModel.find({ file_category: categoryId });
      console.log("Files found:", files);

      // Function to delete a file from Cloudinary
      const deleteFromCloudinary = async (url) => {
        console.log("Deleting:", url);
        if (url) {
          try {
            const segments = url.split("/");
            const publicId =
              segments.slice(7, -1).join("/") +
              "/" +
              segments.pop().split(".")[0];

            console.log("Attempting to delete:", publicId);
            const result = await cloudinary.uploader.destroy(publicId);

            if (result.result === "ok") {
              console.log(`Successfully deleted Cloudinary file: ${publicId}`);
            } else {
              console.error(
                `Failed to delete Cloudinary file: ${publicId}`,
                result
              );
            }
          } catch (err) {
            console.error(
              `Error deleting file from Cloudinary: ${url}`,
              err.message
            );
          }
        } else {
          console.warn("Invalid or empty URL passed to deleteFromCloudinary.");
        }
      };

      for (let i = 0; i < files.length; i++) {
        for (let j = 0; j < files[i].file.length; j++) {
          console.log("originalName", files[i].file[j].originalName);
          console.log("secure_url", files[i].file[j].secureUrl);
          await deleteFromCloudinary(files[i].file[j].secureUrl);
        }
      }

      // Delete the files from the database
      const deletedFiles = await taxFilesModel.deleteMany({
        file_category: categoryId,
      });
      console.log(
        `Deleted ${deletedFiles.deletedCount} files from the database.`
      );

      // Delete category image from cloudinary
      await cloudinary.uploader.destroy(category.categoryImage.publicId);

      // Delete the category itself
      const deletedCategory = await taxCategoryModel.findByIdAndDelete(
        categoryId
      );
      if (deletedCategory) {
        console.log(`Category with ID ${categoryId} deleted successfully.`);
      }

      res.json({ message: "Category and associated files have been deleted" });
    } catch (error) {
      console.error("An error occurred during the deletion process:", error);
      res.status(500).json({
        error: "An internal server error occurred. Please try again later.",
      });
    }
  },

  get_all_categories: async (req, res) => {
    try {
      const categories = await taxCategoryModel.find();
      res.json({ categories, totalCategories: categories.length });
    } catch (error) {
      res.json({ ERROR: error });
    }
  },

  get_category: async (req, res) => {
    try {
      const categoryId = req.params.id;
      const category = await taxCategoryModel.findById({ _id: categoryId });
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json(category);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },

  update_category: async (req, res) => {
    try {
      const categoryId = req.params.id;
      const { categoryTitle, categoryCode, categoryDescription } = req.body;

      if (!req.file) {
        const updatedcategory = await taxCategoryModel.findByIdAndUpdate(
          categoryId,
          {
            categoryTitle,
            categoryCode,
            categoryDescription,
          }
        );

        if (!updatedcategory) {
          return res.status(404).json({ error: "Category not updated" });
        }

        return res
          .status(200)
          .json({ message: "Category updated successfully" });
      }

      if (req.file) {
        //deleting previous image from cloudinary
        await cloudinary.uploader.destroy(req.body.publicId);

        //uploading new image to cloudinary
        const { publicId, src } = await uploadToCloudinary(
          req.file.buffer,
          "auto",
          "Tax Categories"
        );

        const updatedcategory = await taxCategoryModel.findByIdAndUpdate(
          categoryId,
          {
            categoryTitle,
            categoryCode,
            categoryDescription,
            categoryImage: {
              publicId,
              src,
            },
          }
        );

        if (!updatedcategory) {
          return res.status(404).json({ error: "Category not updated" });
        }

        return res
          .status(200)
          .json({ message: "Category updated successfully" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },
};
