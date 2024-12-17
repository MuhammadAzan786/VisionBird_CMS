const interview = require("../models/interview.model"); //interview models
const path = require("path");
const fs = require("fs");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");
const parentDir = path.dirname(__dirname);
const mainDir = path.join(parentDir, "uploads", "interviews");

// ! view all data
const viewData = async (req, res) => {
  try {
    const search = req.query.search || "";

    const interviewData = await interview.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { contact: { $regex: search, $options: "i" } },
        { CNIC: { $regex: search, $options: "i" } },
      ],
    });
    res.status(200).json(interviewData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ! view data by id
const viewDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const interviewdata = await interview.findById(id);
    res.status(200).json(interviewdata);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// !add data
const addData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No CV file uploaded" });
    }

    // Promisify the Cloudinary upload process
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "Interview Cvs" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    // Wait for the Cloudinary upload to complete
    const uploadCV = await uploadToCloudinary();

    // Create new interview data with the uploaded CV URL
    const interviewdata = new interview({
      ...req.body,
      response: "pending",
      CvUpload: uploadCV,
    });

    // Save interview data to the database
    await interviewdata.save();
    return res.json({ message: "Interview Data Saved" });
  } catch (err) {
    console.error("Error saving interview data:", err);
    res.status(500).json({ message: err.message });
  }
};

const pending_Evaluations = async (req, res) => {
  try {
    const search = req.query.search || "";
    const interviewData = await interview.find({
      response: "pending",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { contact: { $regex: search, $options: "i" } },
        { CNIC: { $regex: search, $options: "i" } },
      ],
    });
    console.log("Interview data fetched successfully:", interviewData);
    res.status(200).json({
      message:
        interviewData.length === 0
          ? "No pending evaluations"
          : "Pending evaluations found",
      interviewData,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: error.message });
  }
};

const appeared_Evaluations = async (req, res) => {
  try {
    const search = req.query.search || "";
    const interviewData = await interview.find({
      response: "appeared",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { contact: { $regex: search, $options: "i" } },
        { CNIC: { $regex: search, $options: "i" } },
      ],
    });
    console.log("Interview data fetched successfully:", interviewData);
    res.status(200).json({
      message:
        interviewData.length === 0
          ? "No Appaered evaluations"
          : "Pending evaluations found",
      interviewData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const not_appeared_Evaluations = async (req, res) => {
  try {
    const search = req.query.search || "";
    const interviewData = await interview.find({
      response: "notAppeared",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { contact: { $regex: search, $options: "i" } },
        { CNIC: { $regex: search, $options: "i" } },
      ],
    });
    console.log("Interview data fetched successfully:", interviewData);
    res.status(200).json({
      message:
        interviewData.length === 0
          ? "No not Appaered evaluations"
          : "Pending evaluations found",
      interviewData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// !delete Data
const deleteData = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the interview data by ID
    const interviewdata = await interview.findById(userId);
    if (!interviewdata) {
      return res.status(404).json({ message: "Interview data not found" });
    }

    // Delete files from Cloudinary if URLs are present in the data
    const deleteFromCloudinary = async (url) => {
      if (url) {
        // Decode the URL in case of encoded characters (e.g., spaces as %20)
        const decodedUrl = decodeURIComponent(url);

        // Split the URL by '/' to get all segments
        const segments = decodedUrl.split("/");

        // Extract the public ID: Slice out the version and file extension
        const publicId =
          segments.slice(7, segments.length - 1).join("/") +
          "/" +
          segments.pop().split(".")[0];

        console.log("Public ID before deletion:", publicId);

        try {
          // Delete the file from Cloudinary
          const response = await cloudinary.uploader.destroy(publicId);
          console.log("Cloudinary deletion response:", response);

          // Check if the deletion was successful
          if (response.result === "ok") {
            console.log(`Deleted Cloudinary file: ${publicId}`);
          } else {
            console.warn(`Cloudinary file not found: ${publicId}`);
          }
          return response;
        } catch (err) {
          console.error(`Failed to delete Cloudinary file: ${publicId}`, err);
          throw err;
        }
      }
    };

    const fileResult = await deleteFromCloudinary(interviewdata.CvUpload);
    if (fileResult) {
      console.log("file deleted");
    } else {
      console.log("file not deleted");
    }
    // Delete the interview data from the database
    await interview.findByIdAndDelete(userId);

    res.status(200).json({
      message: "Interview data and associated files deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting interview data:", error);
    res
      .status(500)
      .json({ message: "An error occurred", details: error.message });
  }
};

const updateResponse = async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  try {
    const userId = req.params.id;
    const response = req.body.newValue;
    const interviewData = await interview.findByIdAndUpdate(
      userId,
      {
        response,
      },
      { new: true }
    );
    res.status(200).json({ msg: "Response Updated", interviewData });
  } catch (error) {
    res.status(500).json({ msg: "ERROR UPDATING RESPONSE" });
  }
};

// Update individual data of interview
const updateRemarks = async (req, res) => {
  console.log("receievd", req.body);
  const userId = req.params.id;

  // getting key and value to provide dynamic key to the mongoose Model
  const [key, value] = Object.entries(req.body)[0];
  try {
    const updatedRecord = await interview.findByIdAndUpdate(
      userId,
      {
        [key]: value,
      },
      { new: true }
    );

    const plainObject = updatedRecord.toObject();
    res.status(200).json({ msg: "Record Updated", ...plainObject });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "ERROR UPDATING RECORD" });
  }
};

const searchInterviews = async (req, res) => {
  try {
    const { qualification, workExp, applyFor, minSalary, maxSalary, skills } =
      req.query;

    const filter = createFilterQuery({
      qualification,
      workExp,
      applyFor,
      minSalary,
      maxSalary,
      skills,
    });

    console.log("filter values", filter);

    const filteredResults = await interview.find(filter);
    res.status(200).json([...filteredResults]);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

// Filter Creator Function
const createFilterQuery = (queryParams) => {
  const { qualification, workExp, applyFor, minSalary, maxSalary, skills } =
    queryParams;

  const filter = {};

  // Handle qualification filter
  if (qualification && qualification !== "all") {
    filter.qualification = qualification;
  }

  // Handle workExp filter
  if (workExp && workExp !== "all") {
    filter.workExp = workExp;
  }

  // Handle applyFor filter
  if (applyFor && applyFor !== "all") {
    filter.applyFor = applyFor;
  }

  // Handle the salary range filter
  if (minSalary && maxSalary) {
    filter.expectedSalary = {
      $gte: Number(minSalary),
      $lte: Number(maxSalary),
    };
  }

  // handle Expertise
  if (skills) {
    const skillsArray = skills.split(",").map((skill) => skill.trim());
    if (skillsArray && skillsArray.includes("all")) {
      return filter;
    }
    const skillPattern = skillsArray.join("|");
    filter.expertiseAndSkills = { $regex: skillPattern, $options: "i" };
  }

  return filter;
};

// Update the Interview record with additional information
const update_record_when_appeared = async (req, res) => {
  const { id } = req.params; // Get the interview id from the URL parameters
  const { expectedSalary, testRating, interviewRating, remarks, response } =
    req.body;

  try {
    // Find the interview by ID and update the fields
    const interviewRecord = await interview.findById(id); // Changed interview to interviewRecord

    if (!interviewRecord) {
      return res.status(404).json({ message: "Interview record not found" });
    }

    // Update the fields with new data
    interviewRecord.response = response || interviewRecord.response; // Changed interview to interviewRecord
    interviewRecord.expectedSalary =
      expectedSalary || interviewRecord.expectedSalary; // Changed interview to interviewRecord
    interviewRecord.testRating = testRating || interviewRecord.testRating; // Changed interview to interviewRecord
    interviewRecord.interviewRating =
      interviewRating || interviewRecord.interviewRating; // Changed interview to interviewRecord
    interviewRecord.remarks = remarks || interviewRecord.remarks; // Changed interview to interviewRecord

    // Save the updated interview
    await interviewRecord.save(); // Changed interview to interviewRecord

    // Respond with the updated record
    res.status(200).json({
      message: "Interview updated successfully",
      interview: interviewRecord,
    }); // Changed interview to interviewRecord
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating the interview", error });
  }
};

module.exports = {
  viewData,
  viewDataById,
  addData,
  deleteData,
  updateResponse,
  updateRemarks,
  searchInterviews,
  pending_Evaluations,
  appeared_Evaluations,
  not_appeared_Evaluations,
  update_record_when_appeared,
};
