import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.get("/questions", async (req, res) => {
  let result
  try {
     result = await connectionPool.query("SELECT * FROM questions");
    return res.json({
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({"message": "Unable to fetch questions."});
  }
  return res.status(201).json({
    message: "Questions fetched successfully!",
  }); 
});

app.post("/questions", async (req, res) => {
  const newQuestion = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
  }

  if (!title || !description || !category) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    
    await connectionPool.query (`
      INSERT INTO questions (title, description, category)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [title, description, category]); 
  }catch (error) {

  }
   
});


app.get("/questions/:questionId", async (req, res) => {
  const { questionId } = req.params;
  let ans
  try {
    ans = await connectionPool.query("SELECT * FROM questions WHERE id = $1", [questionId]);
    if (ans.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    return res.json({ data: ans.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to fetch question." });
  }
    return res.status(200).json({ data: result.rows[0] || null });
  
});

app.put("/questions/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  try {
    await connectionPool.query(`
      UPDATE questions SET title = $1, description = $2, category = $3, updated_at = NOW()
      WHERE id = $4
    `, [title, description, category, questionId]);

    return res.json({ message: "Question updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to update question." });
  }
});

app.delete("/questions/:questionId", async (req, res) => {
  const { questionId } = req.params;

  try {
    await connectionPool.query("DELETE FROM questions WHERE id = $1", [questionId]);
    return res.json({ message: "Question post has been deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to delete question." });
  }
});

app.get("/questions/search", async (req, res) => {
  const { title, category } = req.query;

  if (!title && !category) {
    return res.status(400).json({ message: "Invalid search parameters." });
  }

  try {
    const result = await connectionPool.query(`
      SELECT * FROM questions
      WHERE title ILIKE $1 OR category ILIKE $2
    `, [`%${title || ''}%`, `%${category || ''}%`]);

    return res.json({ data: result.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to fetch questions." });
  }
});


app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
