const validateCreateAnswer = (req, res, next) => {

    
  // Check if request body is provided
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing." });
  }

  const { content } = req.body;
    
  if (!content) {
    return res.status(400).json({ message: "Content is required." });
  }
  
  if (content.length > 300) {
    return res.status(400).json({
        message: "content must not exceed 300 characters."
    });
}


  

  next();
}