import app from "./app";

const PORT: string = process.env.PORT;

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  });