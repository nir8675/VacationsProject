import cors from "cors";
import express from "express";
import expressFileUpload from "express-fileupload";
import path from "path";
import { appConfig } from "./2-utils/app-config";
import { userController } from "./5-controllers/user-controller";
import { vacationController } from "./5-controllers/vacation-controller";
import { errorsMiddleware } from "./6-middleware/errors-middleware";
import { loggerMiddleware } from "./6-middleware/logger-middleware";

// Main application class:
class App {
  // Express server:
  private server = express();

  // Start app:
  public start(): void {
    // Enable CORS requests:
    this.server.use(cors()); // Enable CORS for any frontend website.

    // Create a request.body containing the given json from the front:
    this.server.use(express.json());

    // Create request.files containing uploaded files:
    this.server.use(expressFileUpload());

    // Configure images folder:

    this.server.use(
      "/1-assets/images",
      express.static(path.join(__dirname, "1-assets", "images"))
    );

    // Register middleware:
    this.server.use(loggerMiddleware.logToConsole);

    // Connect any controller route to the server:
    this.server.use("/api", vacationController.router, userController.router);

    // Route not found middleware:
    this.server.use("*", errorsMiddleware.routeNotFound);

    // Catch all middleware:
    this.server.use(errorsMiddleware.catchAll);

    // Run server:
    this.server.listen(appConfig.port, () =>
      console.log("Listening on http://localhost:" + appConfig.port)
    );
  }
}

const app = new App();
app.start();
