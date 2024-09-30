import { UploadedFile } from "express-fileupload";
import Joi from "joi";

export class VacationModel {
  public id: number;
  public destination: string;
  public description: string;
  public startDate: Date;
  public endDate: Date;
  public price: number;
  public imageName: UploadedFile;

  private static schema = Joi.object({
    id: Joi.number().integer(),
    destination: Joi.string().required().min(3).max(50),
    description: Joi.string().required().min(5).max(500),
    startDate: Joi.date().required().iso().greater("now"),
    endDate: Joi.date().required().iso().greater(Joi.ref("startDate")),
    price: Joi.number().required().positive().max(10000),
    imageName: Joi.string().allow(null),
  });

  public constructor(vacation: VacationModel) {
    this.id = vacation.id;
    this.destination = vacation.destination;
    this.description = vacation.description;
    this.startDate = vacation.startDate;
    this.endDate = vacation.endDate;
    this.price = vacation.price;
    this.imageName = vacation.imageName;
  }

  public validate(): Joi.ValidationResult {
    return VacationModel.schema.validate(this, { abortEarly: false });
  }
}
