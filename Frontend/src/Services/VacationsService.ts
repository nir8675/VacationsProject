import axios, { AxiosRequestConfig } from "axios";
import { VacationModel } from "../Models/VacationModel";
import { store, vacationActions } from "../Redux/store";
import { appConfig } from "../Utils/AppConfig";

class VacationsService {
  // Fetch vacations by user ID
  public async getAllVacationsByUserId(userId: number) {
    try {
      const response = await axios.get<VacationModel[]>(
        `${appConfig.vacationsUrl}${userId}`
      );
      const vacations = response.data;
      const action = vacationActions.initVacations(vacations);
      store.dispatch(action);
      return vacations;
    } catch (error) {
      console.error("Failed to fetch vacations:", error);
      throw error;
    }
  }

  // Fetch vacation by ID
  public async getVacationById(id: number): Promise<VacationModel> {
    try {
      const response = await axios.get<VacationModel>(
        `${appConfig.vacationsUrl}${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch vacation by ID:", error);
      throw error;
    }
  }

  // Add a new vacation
  public async addVacation(vacation: VacationModel) {
    const token = store.getState().auth?.token;
    if (!token) {
      throw new Error("Unauthorized access. Please log in.");
    }

    const options: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const formData = new FormData();
    formData.append("destination", vacation.destination);
    formData.append("description", vacation.description);
    formData.append("startDate", vacation.startDate);
    formData.append("endDate", vacation.endDate);
    formData.append("price", vacation.price.toString());
    if (vacation.imageName) {
      formData.append("imageName", vacation.imageName);
    }

    try {
      const response = await axios.post<VacationModel>(
        appConfig.vacationsUrl,
        formData,
        options
      );
      const addedVacation = response.data;

      // Dispatch the added vacation to the Redux store
      const action = vacationActions.addVacation(addedVacation);
      store.dispatch(action);
    } catch (error) {
      console.error("Failed to add vacation:", error);
      throw error;
    }
  }
  public async editVacation(id: number, formData: FormData): Promise<void> {
    const token = store.getState().auth?.token;
    if (!token) {
      throw new Error("Unauthorized access. Please log in.");
    }

    const options: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.put<VacationModel>(
        `${appConfig.editVacationUrl}${id}`,
        formData,
        options
      );
      const updatedVacation = response.data;

      const action = vacationActions.updateVacation(updatedVacation);
      store.dispatch(action);
    } catch (error) {
      console.error("Failed to update vacation:", error);
      throw error;
    }
  }

  public async deleteVacation(vacationId: number): Promise<void> {
    const token = store.getState().auth?.token;
    if (!token) {
      throw new Error("Unauthorized access. Please log in.");
    }

    try {
      await axios.delete(`${appConfig.vacationDeleteUrl}${vacationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Failed to delete vacation:", error);
      throw error;
    }
  }

  public async toggleLike(vacationId: number) {
    const token = store.getState().auth?.token;
    if (!token) {
      throw new Error("Unauthorized access. Please log in.");
    }

    try {
      const response = await axios.patch<VacationModel>(
        `${appConfig.vacationsUrl}toggle-like/${vacationId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedVacation = response.data;
      store.dispatch(vacationActions.updateVacation(updatedVacation));
      return updatedVacation;
    } catch (error) {
      console.error("Failed to toggle like:", error);
      throw error;
    }
  }
  public async getVacationLikesReport(): Promise<any> {
    const token = store.getState().auth?.token;
    const response = await axios.get(`${appConfig.vacationsUrl}report`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
}

export const vacationsService = new VacationsService();
