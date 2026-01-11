import dotenv from "dotenv";
import { startServer } from "./src/index";

dotenv.config();

const PORT = process.env.PORT || 4000;

startServer().then((app) => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
});
