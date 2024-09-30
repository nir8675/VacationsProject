import express, { NextFunction, Request, Response } from "express";
import { ResourceNotFoundError } from "../3-models/client-errors";
import { StatusCode } from "../3-models/enums";
import { VacationModel } from "../3-models/vacation-model";
import { vacationsService } from "../4-services/vacation-service";
import { securityMiddleware } from "../6-middleware/security-middleware";
import { fileSaver } from "uploaded-file-saver";
import { UploadedFile } from "express-fileupload";
import path from "path";
const imagePath = path.join(__dirname, "..", "1-assets", "images");

// Data controller:
class VacationController {
  // Create a router object for listening to HTTP requests:
  public readonly router = express.Router();

  // Register routes once:
  public constructor() {
    this.registerRoutes();
  }

  // Register routes:
  private registerRoutes(): void {
    this.router.get(
      "/vacations",
      securityMiddleware.validateLogin,
      this.getAllVacations
    );
    this.router.get(
      "/vacations/:userId([0-9]+)",
      securityMiddleware.validateLogin,
      this.getAllVacationsByUserId
    );
    this.router.get("/vacations/images/:imageName", this.getVacationImage);
    this.router.get(
      "/vacations-valid",
      securityMiddleware.validateLogin,
      this.getVacationsValid
    );
    this.router.get(
      "/vacations-not-started",
      securityMiddleware.validateLogin,
      this.getVacationsNotStarted
    );
    this.router.post(
      "/vacations",
      securityMiddleware.validateAdmin,
      this.addVacation
    );
    this.router.put(
      "/edit-vacation/:id([0-9]+)",
      securityMiddleware.validateAdmin,
      this.editVacation
    );
    this.router.delete(
      "/vacation/:id([0-9]+)",
      securityMiddleware.validateAdmin,
      this.removeVacation
    );
    this.router.patch(
      "/vacations/toggle-like/:id",
      securityMiddleware.validateLogin,
      this.toggleLikeVacation
    );
    this.router.get("/vacation/:id([0-9]+)", this.getVacationById);
    this.router.get(
      "/vacations/report",
      securityMiddleware.validateAdmin,
      this.getVacationLikesReport
    );
  }
  // Fetches all vacations and returns them in the response.
  private async getAllVacations(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const vacations = await vacationsService.getAllVacations();
      response.json(vacations);
    } catch (err: any) {
      next(err);
    }
  }

  // Fetches all vacations for a specific user by their userId and returns them.
  private async getAllVacationsByUserId(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      console.log("Getting all vacations from the DataBase");
      const userId = +request.params.userId;
      const vacations = await vacationsService.getAllVacationsByUserId(userId);
      response.json(vacations);
    } catch (err: any) {
      next(err);
    }
  }

  // Fetches and returns all vacations that are currently valid (ongoing).
  private async getVacationsValid(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const vacation = await vacationsService.getVacationsValid();
      response.json(vacation);
    } catch (err: any) {
      next(err);
    }
  }

  // Fetches and returns all vacations that have not yet started.
  private async getVacationsNotStarted(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const vacation = await vacationsService.getVacationsNotStarted();
      response.json(vacation);
    } catch (err: any) {
      next(err);
    }
  }

  // Adds a new vacation and returns the created vacation in the response.
  private async addVacation(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      request.body.imageName = request.files?.imageName;
      const vacation = new VacationModel(request.body);
      const addedVacation = await vacationsService.addVacation(vacation);
      response.status(StatusCode.Created).json(addedVacation);
    } catch (err: any) {
      next(err);
    }
  }

  // Updates an existing vacation and returns the updated vacation.
  public async editVacation(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const vacationId = +request.params.id;
      let image = request.files?.imageName;

      // Check if image is an array or a single file
      let imageName: string | null = null;

      if (Array.isArray(image)) {
        image = image[0]; // Take the first image if it's an array
      }

      // Check if image exists and save it if necessary
      if (image) {
        imageName = await fileSaver.add(image as UploadedFile, imagePath); // Save with hashed name
      }

      const vacationData = {
        ...request.body,
        id: vacationId,
        imageName: imageName || request.body.imageName, // Use new imageName if provided, otherwise keep the old one
      };

      const vacation = new VacationModel(vacationData);
      const updatedVacation = await vacationsService.editVacation(vacation);
      response.json(updatedVacation);
    } catch (err: any) {
      next(err);
    }
  }

  // Removes a vacation by its ID and returns a No Content status.
  public async removeVacation(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const vacationId = +request.params.id;
      await vacationsService.removeVacation(vacationId);
      response.sendStatus(StatusCode.NoContent);
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        response.sendStatus(StatusCode.NotFound);
      } else {
        response.sendStatus(StatusCode.InternalServerError);
      }
    }
  }

  // Sends the image file for a vacation.
  private async getVacationImage(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const imageName = request.params.imageName;
      const imagePath = fileSaver.getFilePath(imageName, true);
      response.sendFile(imagePath);
    } catch (err: any) {
      next(err);
    }
  }

  // Toggles the like status of a vacation for the current user.
  private async toggleLikeVacation(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const vacationId = +request.params.id;
      const userId = (request as any).user?.id;

      if (!userId) {
        return response.status(401).json({ message: "User not authenticated" });
      }

      const updatedVacation = await vacationsService.toggleLike(
        vacationId,
        userId
      );
      response.json(updatedVacation);
    } catch (err: any) {
      next(err);
    }
  }

  // Fetches and returns a vacation by its ID.
  private async getVacationById(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const vacationId = +request.params.id;
      const vacation = await vacationsService.getVacationById(vacationId);

      if (!vacation) {
        throw new ResourceNotFoundError(vacationId);
      }

      response.json(vacation);
    } catch (err: any) {
      next(err);
    }
  }

  // Fetches and returns a report of vacation likes.
  public async getVacationLikesReport(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const vacationsReport = await vacationsService.getVacationLikesReport();
      response.json(vacationsReport);
    } catch (err: any) {
      next(err);
    }
  }
}

export const vacationController = new VacationController();
export const dataRouter = vacationController.router;
