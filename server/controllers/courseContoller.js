import Course from "../models/Course.js";
import { clerkClient } from "@clerk/express";

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    // Fetch all published courses
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"]);

    // Fetch educator details from Clerk
    const coursesWithEducator = await Promise.all(
      courses.map(async (course) => {
        let educatorInfo = null;
        if (course.educator) {
          try {
            const user = await clerkClient.users.getUser(course.educator);
            educatorInfo = {
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.emailAddresses[0].emailAddress,
              imageUrl: user.profileImageUrl,
            };
          } catch (err) {
            console.error(`Failed to fetch educator ${course.educator}: ${err.message}`);
          }
        }
        return { ...course.toObject(), educator: educatorInfo };
      })
    );

    res.json({ success: true, courses: coursesWithEducator });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get course by ID
export const getCourseId = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    let educatorInfo = null;
    if (course.educator) {
      try {
        const user = await clerkClient.users.getUser(course.educator);
        educatorInfo = {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.emailAddresses[0].emailAddress,
          imageUrl: user.profileImageUrl,
        };
      } catch (err) {
        console.error(`Failed to fetch educator ${course.educator}: ${err.message}`);
      }
    }

    res.json({ success: true, course: { ...course.toObject(), educator: educatorInfo } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

