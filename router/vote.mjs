import { Router } from "express";
import connectionPool from "../utils/db.mjs";


const voteRouter = Router();

voteRouter.post("/questions/:id/votes", async (req, res) => {
    const questionId = req.params.id;
    const { vote } = req.body; // Assuming the request body contains the vote value

    try {
        // Check if the question exists
        const questionResult = await connectionPool.query("SELECT * FROM questions WHERE id = $1", [questionId]);
        if (questionResult.rowCount === 0) {
            return res.status(404).json({error: "Question not found." });
        }

        // Insert the vote into the votes table
        const result = await connectionPool.query(
            "INSERT INTO votes (question_id, vote) VALUES ($1, $2) RETURNING *",
            [questionId, vote]
        );

        return res.status(201).json({ data: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Unable to cast vote." });
    }
  
});

voteRouter.post("/answers/:id/votes", async (req, res) => {
    const answerId = req.params.id;
    const { vote } = req.body; // Assuming the request body contains the vote value

    try {
        // Check if the answer exists
        const answerResult = await connectionPool.query("SELECT * FROM answers WHERE id = $1", [answerId]);
        if (answerResult.rowCount === 0) {
            return res.status(404).json({ error: "Answer not found." });
        }

        // Insert the vote into the votes table
        const result = await connectionPool.query(
            "INSERT INTO votes (answer_id, vote) VALUES ($1, $2) RETURNING *",
            [answerId, vote]
        );

        return res.status(201).json({ data: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Unable to cast vote." });
    }

});