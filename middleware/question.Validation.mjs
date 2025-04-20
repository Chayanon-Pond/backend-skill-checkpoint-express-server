export  const validateCreateQuestion = (req, res, next) => {

     // เป็นข้อมูลที่ Client จำเป็นต้องแนบมาให้
    if (!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
    }
    const { title, description, category} = req.body;

    // Check if title, description, and category are provided
     // เป็นข้อมูลที่ Client จำเป็นต้องแนบมาให้

    if (!title || !description || !category) {
        return res.status(400).json({ message: "Title, description, and category are required." });
    }
    // Check if title, description, and category are strings
    if (typeof title !== "string" || typeof description !== "string" || typeof category !== "string") {
        return res.status(400).json({ message: "Title, description, and category must be strings." });
    }

    next();

}