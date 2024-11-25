const fs = require("fs");
const path = require("path");
const taxFilesModel = require("../models/taxFilesmodel");
const taxCategoryModel = require("../models/taxCategorymodel");
const archiver = require("archiver");
const parentDir = path.dirname(__dirname);
const mainDir = path.join(parentDir, "uploads", "TaxFiles");
const tempDir = path.join(parentDir, "uploads", "Temporary");
const deleteFiles = require("../controllers/functions");
const streamifier = require('streamifier'); 
const cloudinary = require("../utils/cloudinaryConfig"); 


// if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir, { recursive: true });
// }

module.exports = {
  create_File: async (req, res) => {
    try {
        const { id } = req.params;
        const { file_date } = req.body;
        const uniqueIdentifier = req.uniqueIdentifier;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        // Validate file_date and uniqueIdentifier
        if (!file_date || !uniqueIdentifier) {
            return res.status(400).json({ message: "file_date and uniqueIdentifier are required" });
        }

        // Upload each file to Cloudinary
        const uploadPromises = req.files.map((file) => {
            return new Promise((resolve, reject) => {
                const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'auto'; // Check file type
                console.log(resourceType)
                const stream = cloudinary.uploader.upload_stream(
                    { 
                        resource_type: resourceType,
                        folder: 'files',
                    },
                    (error, result) => {
                        if (error) {
                            return reject(new Error("Cloudinary upload failed: " + error.message));
                        }
                        resolve(result.secure_url); // Use secure_url from Cloudinary
                    }
                );
                streamifier.createReadStream(file.buffer).pipe(stream);
            });
        });

        const files = await Promise.all(uploadPromises); // Cloudinary URLs

        // Create an array to store file details
        const fileDetails = files.map((fileUrl, index) => ({
            originalName: req.files[index].originalname,
            secureUrl: fileUrl, // Use Cloudinary secure_url
        }));

        // Save file details array to the database
        const taxFiles = new taxFilesModel({
            file_category: id,
            file: fileDetails, // Cloudinary URLs
            file_date: file_date,
            uniqueIdentity: uniqueIdentifier,
        });
        await taxFiles.save();
        
        res.status(200).send("Files uploaded successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error uploading files");
    }
},

  delete_File: async (req, res) => {
    try {
      const { id } = req.params;
      console.log("id ",id)
      const data = await taxFilesModel.findById({ _id: id });

      if (!data) {
        return res.status(400).json({ error: "Document not found !!!" });  
      }

      const Deletedone = await taxFilesModel.deleteOne({ _id: id });
      if (!Deletedone) {
        return res.status(400).json({ error: "Document not deleted" });
         
        }
        

      const deleteFromCloudinary = async (url) => {
        if (url) {
          const segments = url.split('/');
          // Extract the public ID which includes folder and file name but excludes extension
          const publicId = segments.slice(7, segments.length - 1).join('/') + '/' + segments.pop().split('.')[0];
          
          console.log("Deleting", publicId);
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted Cloudinary file: ${publicId}`);
          } catch (err) {
            console.log(`Failed to delete Cloudinary file: ${publicId}`, err);
          }
        }
      };

      console.log(data.file)
      data.file.forEach(async(file)=>{
        console.log("urls")
        console.log(file.secureUrl)
        
      // Delete files from Cloudinary
      
      await deleteFromCloudinary(file.secureUrl);
      })
      
  



      res.status(200).send({ message: " record Deleted !!!" });

    } 
    catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    
    }
  },

  filter_Files: async (req, res) => {
    try {
      const categoryId = req.params.id;
      const { startDate, endDate } = req.body;

      const start = new Date(startDate);
      const end = new Date(endDate);

      const data = await taxFilesModel.find({
        file_category: categoryId,
        file_date: { $gte: start, $lte: end },
      });

      if (!data) {
        res.status(400).json({
          error: "Document not found or no document for this date criteria",
        });
      }
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  get_all_Files: async (req, res) => {
    try {
      const categoryId = req.params.id;
      const data = await taxFilesModel.find({ file_category: categoryId });
      if (data.length === 0) {
        return res.status(200).json({
          message: "No files found for this category",
          totalFiles: data.length,
        });
      }
      res.status(200).json({
        totalFiles: data.length,
        files: data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  get_File: async (req, res) => {
    try {
      const fileId = req.params.id;
      const data = await taxFilesModel.findById(fileId);
      if (!data) {
        res.status(400).json({ error: "File not found" });
      }
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },

  download_File: async (req, res) => {
    try {
      console.log("Downloading file")
      const fileId = req.params.id;
      
      const fileData = await taxFilesModel.findById(fileId);
      console.log(fileData)
      if (!fileData) {
        return res.status(400).json({ error: "File not found" });
      }
      console.log("File ID:", fileData);
      const files = fileData.file[0].secureUrl;
      console.log(files);
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files found" });
      }

    } catch (error) {
      return res.status(400).json(error);
    }
  },

  download_Filtered_Files: async (req, res) => {
    try {
      const categoryId = req.params.id;
      console.log("Category ID:", categoryId);

      const category = await taxCategoryModel.findOne({ _id: categoryId });
      console.log("Category:", category);

      if (!category) {
        console.log("Category not found");
        return res.status(400).json({ error: "Category not found" });
      }

      const start = new Date(req.params.startDate);
      console.log("Start Date:", start);

      const end = new Date(req.params.endDate);
      console.log("End Date:", end);

      const files = await taxFilesModel.find({
        file_category: categoryId,
        file_date: { $gte: start, $lte: end },
      });
      console.log("Files:", files);

      if (!files || files.length === 0) {
        console.log("No files found for this Date criteria");
        return res
          .status(400)
          .json({ error: "No files found for this Date criteria" });
      }

      // Create folder to contain files
      const startISOString = start.toISOString().replace(/[:\-]/g, "_");
      const endISOString = end.toISOString().replace(/[:\-]/g, "_");
      const timestamp = new Date().getTime(); // Add timestamp
      const folderName = `files_${categoryId}_StartDate${startISOString}_EndDate${endISOString}_${timestamp}`;
      console.log("Folder Name:", folderName);

      const folderPath = path.join(tempDir, folderName);
      console.log("Folder Path:", folderPath);

      if (!fs.existsSync(folderPath)) {
        console.log("Creating folder...");
        fs.mkdirSync(folderPath);
      } else {
        console.log("Folder already exists:", folderPath);
      }

      //create zip folder with files
      const output = fs.createWriteStream(`${folderPath}.zip`);
      console.log("ZIP output:", output);

      const archive = archiver("zip", {
        zlib: { level: 9 },
      });
      console.log("Archiver:", archive);

      output.on("close", async () => {
        try {
          console.log("ZIP folder closed");
          // Set headers for ZIP folder download
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${folderName}.zip"`
          );
          res.setHeader("Content-Type", "application/zip");
          // Stream ZIP folder to response
          const zipFileStream = fs.createReadStream(`${folderPath}.zip`);
          zipFileStream.pipe(res);
          console.log("ZIP folder streamed to response");
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Error while streaming ZIP folder" });
        }
      });
      archive.pipe(output);

      // Add files from server directory to folder and ZIP archive
      for (let i = 0; i < files.length; i++) {
        const fileObj = files[i];
        for (let j = 0; j < fileObj.file.length; j++) {
          const file = fileObj.file[j];
          const filePath = path.join(mainDir, file.filename); // Assuming file.filename contains the filename in the server directory

          // Generate a unique filename
          const uniqueFilename = `${i}_${Date.now()}_${file.originalName}`;

          // Read file asynchronously and append to archive
          await new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(filePath);
            readStream.on("error", reject);
            readStream.on("end", resolve);
            archive.append(readStream, { name: uniqueFilename });
          }).catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Error while reading files" });
          });
        }
      }
      // Log number of files added to archive
      console.log(`${archive.pointer()} total bytes`);
      console.log(
        "archiver has been finalized and the output file descriptor has closed."
      );

      // Finalize the ZIP archive
      archive.finalize();
      console.log("ZIP archive finalized");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  
  delete_Temporary_Folder: async (req, res) => {
    if (!fs.existsSync(tempDir)) {
      return res.status(200).json({ message: "Folder not Found" });
    }
    const folderPath = tempDir;
    fs.rm(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ message: "Error while deleting temporary folder" });
      }
      res.status(200).json({ message: "Temporary folder deleted" });
    });
  },
};
