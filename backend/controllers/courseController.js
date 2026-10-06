const Course = require("../models/Course");

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({
      createdAt: -1,
    });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load courses.",
      error: error.message,
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load course.",
      error: error.message,
    });
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json({
      message: "Course added successfully.",
      course,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to add course.",
      error: error.message,
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    res.status(200).json({
      message: "Course updated successfully.",
      course,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update course.",
      error: error.message,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(
      req.params.id
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    res.status(200).json({
      message: "Course deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete course.",
      error: error.message,
    });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};