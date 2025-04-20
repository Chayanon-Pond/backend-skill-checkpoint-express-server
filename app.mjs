import express from "express";
import questionRouter from "./router/questions.mjs";
import answerRouter from "./router/answers.mjs";
import voteRouter from "./router/vote.mjs";

const app = express();
const port = 4000;

app.use(express.json());
app.use('/questions', questionRouter);
app.use('/answers', answerRouter);
app.use('/', voteRouter);

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});