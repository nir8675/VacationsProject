import { OkPacketParams } from "mysql2";
import path from "path";
import { fileSaver } from "uploaded-file-saver";
import { dal } from "../2-utils/dal";
import { ResourceNotFoundError } from "../3-models/client-errors";
import { VacationModel } from "../3-models/vacation-model";
import { UploadedFile } from "express-fileupload";
const imagePath = path.join(__dirname, "..", "1-assets", "images");

class VacationService {
  // Retrieves all vacations from the database, including the image URL, and orders them by the start date.
  public async getAllVacations(): Promise<VacationModel[]> {
    const sql =
      "SELECT *, CONCAT('http://localhost:4000/api/vacations/images/', imageName) AS imageUrl FROM vacations ORDER BY startDate;";
    const allVacations = await dal.execute(sql);
    return allVacations;
  }

  // Retrieves all vacations for a specific user based on the userId.
  // Includes the vacation details, likes count, and whether the user has liked each vacation.
  public async getAllVacationsByUserId(
    userId: number
  ): Promise<VacationModel[]> {
    const sql = `
  SELECT V.*,
         CONCAT('${process.env.BASE_IMAGE_URL}', imageName) AS imageUrl,
         EXISTS(SELECT * FROM likes WHERE vacationId = L.vacationId AND userId = ?) AS isLiked,
         COUNT(L.userId) AS likesCount
  FROM vacations as V
  LEFT JOIN likes as L ON V.id = L.vacationId
  GROUP BY V.id ORDER BY V.startDate`;

    const vacations = await dal.execute(sql, [userId]);

    return vacations;
  }

  // Fetches vacations that are currently valid, i.e., where the current date falls between the start and end dates.
  public async getVacationsValid(): Promise<VacationModel[]> {
    const sql = `SELECT * 
  FROM vacations
  WHERE current_date() BETWEEN startDate AND endDate`;
    const validVacations = await dal.execute(sql);
    return validVacations;
  }

  // Fetches vacations that have not yet started, i.e., where the start date is after the current date.
  public async getVacationsNotStarted(): Promise<VacationModel[]> {
    const sql = `SELECT * FROM vacations WHERE startDate > current_date()`;
    const notStartedVacations = await dal.execute(sql);
    return notStartedVacations;
  }

  // Adds a new vacation to the database. Handles image file saving and inserts vacation details.
  public async addVacation(vacation: VacationModel) {
    vacation.validate();

    // Handle image file:
    const imageName =
      typeof vacation.imageName === "string"
        ? vacation.imageName // If already a string, use it
        : vacation.imageName
        ? await fileSaver.add(vacation.imageName, imagePath) // If UploadedFile, save it
        : null;

    // SQL Query to insert new vacation data
    const sql =
      "INSERT INTO vacations(destination, description, startDate, endDate, price, imageName) VALUES(?, ?, ?, ?, ?, ?)";
    const values = [
      vacation.destination,
      vacation.description,
      vacation.startDate,
      vacation.endDate,
      vacation.price,
      imageName,
    ];

    const info: OkPacketParams = await dal.execute(sql, values);

    vacation.id = info.insertId; // Set the new ID for the vacation

    return vacation;
  }

  // Updates an existing vacation in the database. If no new image is provided, it retains the old one.
  public async editVacation(vacation: VacationModel) {
    vacation.validate();

    let imageName = vacation.imageName;

    // If no new image is provided, fetch the existing image from the database
    if (!imageName) {
      const existingVacation = await dal.execute(
        "SELECT imageName FROM vacations WHERE id = ?",
        [vacation.id]
      );
      if (existingVacation.length > 0) {
        imageName = existingVacation[0].imageName;
      } else {
        throw new Error("Vacation not found");
      }
    }

    // SQL Query to update vacation in the database
    const sql =
      "UPDATE vacations SET destination = ?, description = ?, startDate = ?, endDate = ?, price = ?, imageName = ? WHERE id = ?";
    const values = [
      vacation.destination,
      vacation.description,
      vacation.startDate,
      vacation.endDate,
      vacation.price,
      imageName,
      vacation.id,
    ];

    const info: OkPacketParams = await dal.execute(sql, values);
    if (info.affectedRows === 0) throw new ResourceNotFoundError(vacation.id);
    return vacation;
  }

  // Deletes a vacation from the database. Also deletes all associated likes before deleting the vacation itself.
  public async removeVacation(id: number) {
    await dal.execute("DELETE FROM likes WHERE vacationId = ?", [id]);
    const sql = `DELETE FROM vacations WHERE id = ?`;
    const info: OkPacketParams = await dal.execute(sql, [id]);
    if (info.affectedRows === 0) throw new ResourceNotFoundError(id);
  }

  // Toggles the like status of a vacation for a specific user. If a like exists, it is removed, otherwise it is added.
  public async toggleLike(
    vacationId: number,
    userId: number
  ): Promise<VacationModel> {
    const existingLike = await dal.execute(
      "SELECT * FROM likes WHERE vacationId = ? AND userId = ?",
      [vacationId, userId]
    );

    if (existingLike.length > 0) {
      // If the user has already liked the vacation, remove the like
      await dal.execute(
        "DELETE FROM likes WHERE vacationId = ? AND userId = ?",
        [vacationId, userId]
      );
    } else {
      // Otherwise, add a new like
      await dal.execute(
        "INSERT INTO likes (vacationId, userId) VALUES (?, ?)",
        [vacationId, userId]
      );
    }

    // Retrieve the updated vacation data with the new likes count
    const updatedVacation = await dal.execute(
      `SELECT V.*, 
       (SELECT COUNT(*) FROM likes WHERE vacationId = V.id) AS likesCount,
       CONCAT('${process.env.BASE_IMAGE_URL}', imageName) AS imageUrl
       FROM vacations AS V
       WHERE V.id = ?`,
      [vacationId]
    );

    return updatedVacation[0];
  }

  // Retrieves vacation details by its unique ID.
  public async getVacationById(id: number): Promise<VacationModel> {
    const sql = `SELECT * FROM vacations WHERE id = ?`;
    const vacations = await dal.execute(sql, [id]);
    return vacations[0]; // Return the first vacation found
  }

  // Generates a report on the number of likes for each vacation, grouping the results by destination.
  public async getVacationLikesReport(): Promise<any[]> {
    const sql = `SELECT destination, COUNT(likes.vacationId) AS likesCount FROM vacations 
    LEFT JOIN likes ON vacations.id = likes.vacationId 
    GROUP BY vacations.destination;
  `;
    const vacationsReport = await dal.execute(sql);
    return vacationsReport;
  }
}

export const vacationsService = new VacationService();
