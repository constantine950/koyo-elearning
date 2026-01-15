import dotenv from "dotenv";
dotenv.config();
import { startServer } from "./src/index";

const PORT = process.env.PORT || 4000;

startServer().then((app) => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
});
