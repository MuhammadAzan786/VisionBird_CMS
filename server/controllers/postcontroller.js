const Post = require("../models/postmodel");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../utils/cloudinaryConfig");

// Function to delete an image from Cloudinary
const deleteFromCloudinary = async (url) => {
  if (url) {
    const segments = url.split("/");
    // Extract the public ID which includes folder and file name but excludes extension
    const publicId =
      segments.slice(7, segments.length - 1).join("/") +
      "/" +
      segments.pop().split(".")[0];

    console.log("Deleting", publicId);
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted Cloudinary file: ${publicId}`);
    } catch (err) {
      console.log(`Failed to delete Cloudinary file: ${publicId}`, err);
    }
  }
};

module.exports = {
  // ! Create a simple post without images
  create_post: async (req, res) => {
    try {
      const post = new Post({ ...req.body });
      await post.save();
      res.status(201).json({ message: "Post created successfully!" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  // Allow up to 5 images to be uploaded, adjust as needed

  // ! Create Post with Images
  // Add Post Data with multiple file upload
  createPostImg: async (req, res) => {
    try {
      const {
        employee_obj_id,
        project_id,
        project_title,
        project_description,
        project_url,
      } = req.body;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      // Upload each file to Cloudinary
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
              folder: "project_images",
            },
            (error, result) => {
              if (error) {
                return reject(
                  new Error("Cloudinary upload failed: " + error.message)
                );
              }
              resolve(result.secure_url); // Return the secure URL
            }
          );

          // Stream the file buffer to Cloudinary
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      });

      const project_images = await Promise.all(uploadPromises);

      // Create a new post with images
      const newPost = new Post({
        employee_obj_id,
        project_id,
        project_title,
        project_description,
        project_url,
        project_images, // Save Cloudinary URLs
      });

      await newPost.save();
      res
        .status(201)
        .json({ message: "Post with images created successfully!", newPost });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Failed to create post", error: error.message });
    }
  },

  // ! Get all posts of a specific employee by employee ID
  get_all_posts: async (req, res) => {
    try {
      const search = req.query.search || "";
      const data = await Post.find({
        employee_obj_id: req.params.id,
        $or: [
          { project_id: { $regex: search, $options: "i" } },
          { project_title: { $regex: search, $options: "i" } },
        ],
      });

      res.status(200).json(data);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching posts", error: error.message });
    }
  },
  // ! Get all posts from all employees, including employee details
  get_all_emp_posts: async (req, res) => {
    try {
      const search = req.query.search || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 16;
      const skip = (page - 1) * limit;
      // get total count for pagination
      const totalCount = await Post.countDocuments({
        $or: [
          { project_id: { $regex: search, $options: "i" } },
          { project_title: { $regex: search, $options: "i" } },
        ],
      });

      const data = await Post.find({
        $or: [
          { project_id: { $regex: search, $options: "i" } },
          { project_title: { $regex: search, $options: "i" } },
        ],
      })
        .skip(skip)
        .limit(limit)
        .populate("employee_obj_id", "employeeName employeeProImage");
      console.log("port data", data.length);
      res.status(200).json({
        data,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching posts", error: error.message });
    }
  },

  // ! Get all posts by a specific user ID
  getPostsByUserId: async (req, res) => {
    try {
      const userId = req.params.userId;
      const posts = await Post.find({ employee_obj_id: userId });
      res.status(200).json(posts);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching posts", error: error.message });
    }
  },

  // ! Get data from post id
  PostDataById: async (req, res) => {
    try {
      const { id } = req.params;
      const postData = await Post.findById(id).populate(
        "employee_obj_id",
        "employeeName email employeeProImage"
      );
      if (!postData) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json(postData);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching post data", error: error.message });
    }
  },

  // ! Delete Single Post
  deletePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const postData = await Post.findById(postId);

      if (!postData) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Delete each image from Cloudinary
      const deletePromises = postData.project_images.map(async (imageUrl) => {
        await deleteFromCloudinary(imageUrl);
      });

      await Promise.all(deletePromises); // Wait for all deletions to complete

      // Now delete the post from the database
      await Post.findByIdAndDelete(postId);
      res.status(200).json({ message: "Post deleted successfully!" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting post", error: error.message });
    }
  },

  // ! paginated all posts
  getPaginatedPosts: async (req, res) => {
    try {
      const posts = await Post.find();
      if (!posts) {
        return res.status(404).json({ message: "No Posts found" });
      }
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const results = {};
      results.totalposts = posts.length;
      results.pageCount = Math.ceil(posts.length / limit);
      results.currentPage = page;

      if (endIndex < posts.length) {
        results.next = {
          page: page + 1,
        };
      }

      if (startIndex > 0) {
        results.prev = {
          page: page - 1,
        };
      }

      results.paginatedPosts = posts.slice(startIndex, endIndex);
      res.status(200).json(results);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },
};
