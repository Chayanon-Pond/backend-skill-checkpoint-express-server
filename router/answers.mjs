import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateCreateAnswer } from "../middleware/answer.Validation.mjs";

const answerRouter = Router();

answerRouter.get("/", async (req, res) => {
    let result

   try { 

    const {questionId} = req.query;
    let query = `SELECT * FROM answers`;
    let values = [];
    // pagination
    if(questionId) {
        query += ` WHERE question_id = $1`;
        values = [`${questionId}`];
    }
    result = await connectionPool.query(query, values);
    return res.json({
        data: result.rows,
      });

    }catch (e){
     console.error(e);
     return res.status(500).json({"message": "Unable to fetch questions."});
   } 
     
});

answerRouter.get("/:id/answers", async (req, res) => {
    const answerId = req.params.id;
    let ans
    try {
        ans = await connectionPool.query("SELECT * FROM answers WHERE id = $1", [answerId]);
        if (!ans.rows[0]) {
            return res.status(404).json({ message: "Answers not found for this question." });
        }
        return res.status(200).json({ data: ans.rows[0] || null });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Unable to fetch answer." });
    }
});

answerRouter.post("/:id/answers", [validateCreateAnswer],async (req, res) => {
  const newAnswer = {...req.body};
  const question_id = {...req.params.id};

  try {
    const result = await connectionPool.query(
      "INSERT INTO answers (content, question_id) VALUES ($1, $2) RETURNING *",
      [newAnswer.content, question_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Question not found." });
    }

    return res.status(201).json({
      message: "Answer created successfully!",
      data: result.rows[0],
    });

    
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error or Question not found" });
  }
});







export default answerRouter;