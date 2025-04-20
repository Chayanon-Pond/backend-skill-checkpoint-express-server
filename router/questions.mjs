import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const questionRouter = Router();

questionRouter.get("/", async (req, res) => {
    let result
    try {

      const {title,category} = req.query;
      

      let query = `SELECT * FROM questions`;
      let values = [];


      // pagination

      if(title && category) {
        query += ` WHERE title ILIKE $1 AND category ILIKE $2`;
        values = [`%${title}%`, `%${category}%`];
      }
      else if(title) {
        query += ` WHERE title ILIKE $1`;
        values = [`%${title}%`]; 
      }
      else if(category) {
        query += ` WHERE category ILIKE $1`;
        values = [`%${category}%`];
      }

       result = await connectionPool.query(query, values);
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

questionRouter.get("/:id", async (req, res) => {
  const questionId = req.params.id;

  let ans
  try {
    ans = await connectionPool.query("SELECT * FROM questions WHERE id = $1", [questionId]);
    if (!ans.rows[0]) {
      return res.status(404).json({ message: "Question not found." });
    }
    return res.status(200).json({ data: ans.rows[0] || null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to fetch question." });
  }
   
});

questionRouter.post("/",  async (req, res) => {
  const newQuestion = {...req.body}

  try {
    const result = await connectionPool.query(
      `INSERT INTO questions (title, description, category) VALUES ($1, $2, $3) RETURNING *`,
      [newQuestion.title, newQuestion.description, newQuestion.category]
    );

    return res.status(201).json({
      message: "Question create successfully",
      data: result.rows[0],
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


questionRouter.put("/:id", async (req, res) => {
  
  try{
    const questionId = req.params.id;
    const updatedQuestion = { ...req.body };

    if (!questionId) {
      return res.status(400).json({ message: "Question not found." });
    }

    const result = await connectionPool.query(
      `UPDATE questions SET title = $1, description = $2, category = $3 WHERE id = $4 RETURNING *`,
      [updatedQuestion.title, updatedQuestion.description, updatedQuestion.category, questionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    return res.status(200).json({
      message: "Question updated successfully.",
      data: result.rows[0],
    });

  }catch(e){
    console.error(e);
    return res.status(500).json({ message: "Unable to fetch questions." });
  }
});

questionRouter.delete("/:id", async (req, res) => {
  
  try {
    const questionId = req.params.id;

    if (!questionId) {
      return res.status(400).json({ error: "Question not found." });
    }
    const ans = await connectionPool.query("DELETE FROM questions WHERE id = $1", [questionId]);
    return res.status(200).json({ message: "Question post has been deleted successfully." });

  }catch(e){
    console.error(e);
    return res.status(500).json({ error: "Unable to delete question." });
  }
});



export default questionRouter;