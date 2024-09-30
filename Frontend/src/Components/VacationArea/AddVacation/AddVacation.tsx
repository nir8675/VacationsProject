import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { VacationModel } from "../../../Models/VacationModel";
import { errorHandler } from "../../../Services/errorHandler";
import { vacationsService } from "../../../Services/VacationsService";
import { notify } from "../../../Utils/Notify";
import { AppState } from "../../../Redux/store";
import { Role } from "../../../Models/enums";
import "./AddVacation.css";

export function AddVacation(): JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VacationModel>();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetching the roleId from the Redux store:
  const roleId = useSelector((state: AppState) => state.user.roleId);

  // Redirect to home if user is not an admin
  useEffect(() => {
    if (Number(roleId) !== Role.Admin) {
      notify.error("Access denied. Admins only.");
      navigate("/");
    }
  }, [roleId, navigate]);

  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");

  async function send(vacation: VacationModel) {
    try {
      if (
        watchStartDate &&
        watchEndDate &&
        new Date(watchEndDate) < new Date(watchStartDate)
      ) {
        notify.error("End Date cannot be before Start Date.");
        return;
      }

      vacation.imageName = (vacation.imageName as unknown as FileList)[0];

      await vacationsService.addVacation(vacation);
      notify.success("Vacation has been added.");
      navigate("/vacations");
    } catch (err: any) {
      notify.error(errorHandler.getError(err));
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }

  return (
    <div className="addVacation">
      <form onSubmit={handleSubmit(send)}>
        <div className="input-wrapper">
          <label>Destination: </label>
          <input
            type="text"
            {...register("destination", {
              required: "Destination is required",
              minLength: {
                value: 3,
                message: "Destination must be at least 3 characters",
              },
            })}
          />
          {errors.destination && (
            <p className="error">{errors.destination.message}</p>
          )}
        </div>

        <div className="input-wrapper">
          <label>Description: </label>
          <textarea
            rows={10}
            cols={38}
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 5,
                message: "Description must be at least 5 characters",
              },
              maxLength: {
                value: 500,
                message: "Description cannot exceed 500 characters",
              },
            })}
          />
          {errors.description && (
            <p className="error">{errors.description.message}</p>
          )}
        </div>

        <div className="input-wrapper">
          <label>Start Date: </label>
          <input
            type="date"
            {...register("startDate", { required: "Start date is required" })}
          />
          {errors.startDate && (
            <p className="error">{errors.startDate.message}</p>
          )}
        </div>

        <div className="input-wrapper">
          <label>End Date: </label>
          <input
            type="date"
            {...register("endDate", { required: "End date is required" })}
          />
          {errors.endDate && <p className="error">{errors.endDate.message}</p>}
        </div>

        <div className="input-wrapper">
          <label>Price: </label>
          <input
            type="number"
            {...register("price", {
              required: "Price is required",
              min: {
                value: 1,
                message: "Price cannot be negative",
              },
              max: {
                value: 10000,
                message: "Price cannot exceed 10000",
              },
            })}
            placeholder="$$$"
          />
          {errors.price && <p className="error">{errors.price.message}</p>}
        </div>

        <div className="input-wrapper">
          <label>Image: </label>
          <input
            type="file"
            {...register("imageName", {
              required: "Image is required",
              onChange: handleImageChange,
            })}
            accept="image/*"
          />
          {errors.imageName && (
            <p className="error">{errors.imageName.message}</p>
          )}
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          )}
        </div>

        <button type="submit">Add Vacation</button>
      </form>
    </div>
  );
}
