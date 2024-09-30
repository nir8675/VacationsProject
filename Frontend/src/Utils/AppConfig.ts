class AppConfig {
  // Backend urls:
  public readonly vacationsUrl = "http://localhost:4000/api/vacations/";
  public readonly registerUrl = "http://localhost:4000/api/register/";
  public readonly loginUrl = "http://localhost:4000/api/login/";
  public readonly editVacationUrl = "http://localhost:4000/api/edit-vacation/";
  public readonly vacationDeleteUrl = "http://localhost:4000/api/vacation/";
}

export const appConfig = new AppConfig();
