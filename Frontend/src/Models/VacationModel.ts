export class VacationModel {
  public id: number;
  public destination: string;
  public description: string;
  public startDate: string;
  public endDate: string;
  public price: number;
  public imageUrl: string;
  public imageName: File | null;
  public isLiked: number;
  public likesCount: number;
}
