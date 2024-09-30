import Joi from "joi";

export class LikesModel {
  public id: number;
  public userId: number;
  public vacationId: number;

  public constructor(like: LikesModel) {
    this.id = like.id;
    this.userId = like.userId;
    this.vacationId = like.vacationId;
  }

  public static validate(like: LikesModel) {
    const schema = Joi.object({
      id: Joi.number().required(),
      userId: Joi.number().required(),
      vacationId: Joi.number().required(),
    });

    return schema.validate(like, { abortEarly: false });
  }
}
