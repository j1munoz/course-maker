const express = require("express");
const cors = require("cors");
const pool = require("./db.js");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
// Routes regarding the user
// Create a user
app.post("/users", async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    console.log(req.body);
    const newUser = await pool.query(
      "INSERT INTO users (email, password, first_name, last_name, role) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [email, password, firstName, lastName, role]
    );

    res.json(newUser.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// Get a user's information
app.get("/users/:id", async (req, res) => {
  try {
    const { userID } = req.params;
    const user = await pool.query(
      "SELECT first_name, last_name, role, created_at FROM users WHERE user_id = $1",
      [userID]
    );
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Update a user's password
app.put("/users/:id", async (req, res) => {
  try {
    const { userID } = req.params;
    const { password } = req.body;

    await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [
      password,
      userID,
    ]);

    res.json("You have successfully reset your password!");
  } catch (error) {
    console.error(error.message);
  }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const { userID } = req.params;

    await pool.query("DELETE FROM users WHERE user_id = $1", [userID]);
    res.json("User was deleted!");
  } catch (error) {
    console.error(error.message);
  }
});

// Routes regarding the course
// Create a course
app.post("/courses", async (req, res) => {
  try {
    const {
      courseTitle,
      courseDescription,
      currentEnrolled,
      totalEnrolled,
      instructorID,
    } = req.body;
    const newCourse = await pool.query(
      "INSERT INTO courses (title, description, current_enrolled, total_enrolled, instructor_id) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [
        courseTitle,
        courseDescription,
        currentEnrolled,
        totalEnrolled,
        instructorID,
      ]
    );

    res.json(newCourse.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Get a course from an instructor
app.get("/courses/:id", async (req, res) => {
  try {
    const { instructorID } = req.params;
    const course = await pool.query(
      "SELECT title, description, current_enrolled, total_enrolled FROM courses WHERE instructor_id = $1",
      [instructorID]
    );
    res.json(course.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Update a course's information
app.put("/courses/:id", async (req, res) => {
  try {
    const { courseID } = req.params;
    const { courseName, courseDescription, currentEnrolled, totalEnrolled } =
      req.body;

    await pool.query(
      "UPDATE courses SET title = $1, description = $2, current_enrolled = $3, total_enrolled = $4 WHERE course_id = $5",
      [courseName, courseDescription, currentEnrolled, totalEnrolled, courseID]
    );

    res.json("Course was updated!");
  } catch (error) {
    console.error(error.message);
  }
});

// Delete a course
app.delete("/courses/:id", async (req, res) => {
  try {
    const { courseID } = req.params;
    await pool.query("DELETE FROM courses WHERE course_id = $1", [courseID]);
    res.json("Course was deleted!");
  } catch (error) {
    console.error(error.message);
  }
});

// Routes regarding the enrollment
// Enroll a student in a course
app.post("/enrollment", async (req, res) => {
  try {
    const { studentID, courseID } = req.body;
    const newEnrollment = await pool.query(
      "INSERT INTO enrollment (student_id, course_id) VALUES($1, $2) RETURNING *",
      [studentID, courseID]
    );

    res.json(newEnrollment.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Get all courses a student is enrolled in
app.get("/enrollment/:id", async (req, res) => {
  try {
    const { studentID } = req.params;
    const enrolledCourses = await pool.query(
      "SELECT course_id FROM enrollment WHERE student_id = $1",
      [studentID]
    );
    res.json(enrolledCourses.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// Drop a course
app.delete("/enrollment/:id", async (req, res) => {
  try {
    const { enrollmentID } = req.params;
    dropCourse = await pool.query(
      "DELETE FROM enrollment WHERE enrollment_id = $1",
      [enrollmentID]
    );
    res.json("Course was dropped!");
  } catch (error) {
    console.error(error.message);
  }
});

// Routes regarding the lectures
// Create a lecture
app.post("/lectures", async (req, res) => {
  try {
    const { courseID, lectureContent, lectureTitle } = req.body;
    const newLecture = await pool.query(
      "INSERT INTO lectures (course_id, content, title) VALUES($1, $2, $3) RETURNING *",
      [courseID, lectureContent, lectureTitle]
    );

    res.json(newLecture.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Get all lectures from a course
app.get("/lectures/:id", async (req, res) => {
  try {
    const { courseID } = req.params;
    const lectures = await pool.query(
      "SELECT title FROM lectures WHERE course_id = $1",
      [courseID]
    );
    res.json(lectures.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// Update a lecture
app.put("/lectures/:id", async (req, res) => {
  try {
    const { lectureID } = req.params;
    const { lectureContent, lectureTitle } = req.body;
    await pool.query(
      "UPDATE lectures SET content = $1, title = $2 WHERE lecture_id = $3",
      [lectureContent, lectureTitle, lectureID]
    );

    res.json("Lecture was updated!");
  } catch (error) {
    console.error(error.message);
  }
});

// Delete a lecture
app.delete("/lectures/:id", async (req, res) => {
  try {
    const { lectureID } = req.params;
    await pool.query("DELETE FROM lectures WHERE lecture_id = $1", [lectureID]);
    res.json("Lecture was deleted!");
  } catch (error) {
    console.error(error.message);
  }
});

// Routes regarding the quizzes
// Create a quiz
app.post("/quizzes", async (req, res) => {
  try {
    const { lectureID, quizName } = req.body;
    const newQuiz = await pool.query(
      "INSERT INTO quizzes (lecture_id, quiz_name) VALUES($1, $2) RETURNING *",
      [lectureID, quizName]
    );

    res.json(newQuiz.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Update a quiz
app.put("/quizzes/:id", async (req, res) => {
  try {
    const { quizID } = req.params;
    const { quizName } = req.body;
    await pool.query("UPDATE quizzes SET quiz_name = $1 WHERE quiz_id = $2", [
      quizName,
      quizID,
    ]);

    res.json("Quiz was updated!");
  } catch (error) {
    console.error(error.message);
  }
});

// Delete a quiz
app.delete("/quizzes/:id", async (req, res) => {
  try {
    const { quizID } = req.params;
    await pool.query("DELETE FROM quizzes WHERE quiz_id = $1", [quizID]);
    res.json("Quiz was deleted!");
  } catch (error) {
    console.error(error.message);
  }
});

// Routes regarding the quiz questions
// Create a question
app.post("/questions", async (req, res) => {
  try {
    const { quizID, question, options, correctAnswer } = req.body;
    const newQuestion = await pool.query(
      "INSERT INTO questions (quiz_id, question, options, correct_answer) VALUES($1, $2, $3, $4) RETURNING *",
      [quizID, question, options, correctAnswer]
    );

    res.json(newQuestion.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Get all questions from a quiz
app.get("/questions/:id", async (req, res) => {
  try {
    const { quizID } = req.params;
    const questions = await pool.query(
      "SELECT question, options FROM questions WHERE quiz_id = $1",
      [quizID]
    );
    res.json(questions.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// Update a question
app.put("/questions/:id", async (req, res) => {
  try {
    const { questionID } = req.params;
    const { question, options, correctAnswer } = req.body;
    await pool.query(
      "UPDATE questions SET question = $1, options = $2, correct_answer = $3 WHERE question_id = $4",
      [question, options, correctAnswer, questionID]
    );

    res.json("Question was updated!");
  } catch (error) {
    console.error(error.message);
  }
});

// Delete a question
app.delete("/questions/:id", async (req, res) => {
  try {
    const { questionID } = req.params;
    await pool.query("DELETE FROM questions WHERE question_id = $1", [
      questionID,
    ]);
    res.json("Question was deleted!");
  } catch (error) {
    console.error(error.message);
  }
});

// Routes regarding the student's quiz scores
// Submit a quiz
app.post("/student_quizzes", async (req, res) => {
  try {
    const { studentID, quizID, score } = req.body;
    const newScore = await pool.query(
      "INSERT INTO scores (student_id, quiz_id, score) VALUES($1, $2, $3) RETURNING *",
      [studentID, quizID, score]
    );

    res.json(newScore.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Get the student's quiz score for a quiz
app.get("/student_quizzes/:id", async (req, res) => {
  try {
    const { studentID } = req.params;
    const quizScores = await pool.query(
      "SELECT score FROM scores WHERE student_id = $1",
      [studentID]
    );
    res.json(quizScores.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// Get all scores from a quiz
app.get("/quiz_scores/:id", async (req, res) => {
  try {
    const { quizID } = req.params;
    const scores = await pool.query(
      "SELECT score FROM scores WHERE quiz_id = $1",
      [quizID]
    );
    res.json(scores.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// Connect to server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
