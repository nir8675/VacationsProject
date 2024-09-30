import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationsService } from "../../../Services/VacationsService";
import "./VacationEdit.css";

export function EditVacation(): JSX.Element {
  // Extract the 'id' parameter from the URL using react-router's useParams
  // The 'id' represents the ID of the vacation being edited
  const { id } = useParams<{ id: string }>();

  // Use the useNavigate hook from react-router to navigate programmatically
  const navigate = useNavigate();

  // Using react-hook-form for form validation and state management
  // 'register' is used to register form inputs, 'handleSubmit' handles form submission,
  // 'setValue' sets form field values, 'getValues' retrieves form field values,
  // and 'errors' captures validation errors
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<VacationModel>();

  // State to manage the selected image file, which is either a File or null
  const [image, setImage] = useState<File | null>(null);

  // useEffect runs when the component mounts or when 'id' or 'setValue' changes
  // It fetches the vacation data based on the vacation ID from the API
  useEffect(() => {
    const fetchVacation = async () => {
      try {
        // Call the service to fetch the vacation details by ID
        const vacationData = await vacationsService.getVacationById(Number(id));
        console.log("Vacation Data:", vacationData); // Log the data

        // Populate the form with the existing vacation data using setValue
        setValue("destination", vacationData.destination || ""); // Set the destination field
        setValue("description", vacationData.description || ""); // Set the description field
        setValue("startDate", vacationData.startDate || ""); // Set the start date
        setValue("endDate", vacationData.endDate || ""); // Set the end date
        setValue("price", vacationData.price || 0); // Set the price
      } catch (error) {
        console.error("Failed to fetch vacation:", error);
      }
    };

    fetchVacation(); // Fetch the vacation data when the component loads
  }, [id, setValue]); // Dependencies: 'id' and 'setValue'

  // It updates the 'image' state with the selected file or sets it to null if no file is selected
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first file from the input
    setImage(file || null); // Set the 'image' state or null if no file is selected
  };

  // Function called when the form is submitted
  const onSubmit = async (formData: VacationModel) => {
    try {
      // Create a FormData object to hold the form values and image file
      const updatedVacation = new FormData();
      updatedVacation.append("destination", formData.destination); // Append destination to the FormData
      updatedVacation.append("description", formData.description); // Append description to the FormData
      updatedVacation.append("startDate", formData.startDate); // Append start date to the FormData
      updatedVacation.append("endDate", formData.endDate); // Append end date to the FormData
      updatedVacation.append("price", formData.price.toString()); // Append price to the FormData

      // If an image file was selected, append it to the FormData
      if (image) {
        updatedVacation.append("imageName", image);
      }

      // Send the updated vacation data to the API using the editVacation service method
      await vacationsService.editVacation(Number(id), updatedVacation);

      // Navigate to the vacations page after successful submission
      navigate("/vacations");
    } catch (error) {
      console.error("Failed to update vacation:", error);
    }
  };

  return (
    <div className="EditVacation">
      <h2>Edit Vacation</h2>

      <form className="edit-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-wrapper">
          <label htmlFor="destination">Destination:</label>
          <input
            id="destination"
            type="text"
            {...register("destination", {
              required: "Destination is required",
              minLength: {
                value: 3,
                message: "Destination must be at least 3 characters long",
              },
            })}
          />
          {errors.destination && (
            <span className="error">{errors.destination.message}</span>
          )}
        </div>

        <div className="input-wrapper">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            {...register("description", {
              required: "Description is required",
              maxLength: {
                value: 500,
                message: "Description cannot exceed 500 characters",
              },
            })}
          />
          {errors.description && (
            <span className="error">{errors.description.message}</span>
          )}
        </div>

        <div className="input-wrapper">
          <label htmlFor="startDate">Start Date:</label>
          <input
            id="startDate"
            type="date"
            {...register("startDate", {
              required: "Start date is required",
            })}
          />
          {errors.startDate && (
            <span className="error">{errors.startDate.message}</span>
          )}
        </div>

        <div className="input-wrapper">
          <label htmlFor="endDate">End Date:</label>
          <input
            id="endDate"
            type="date"
            {...register("endDate", {
              required: "End date is required",
              validate: (value) =>
                new Date(value) >= new Date(getValues("startDate")) ||
                "End date cannot be before start date",
            })}
          />
          {errors.endDate && (
            <span className="error">{errors.endDate.message}</span>
          )}
        </div>

        <div className="input-wrapper">
          <label htmlFor="price">Price:</label>
          <input
            id="price"
            type="number"
            {...register("price", {
              required: "Price is required",
              min: { value: 1, message: "Price must be positive" },
              max: { value: 10000, message: "Price cannot exceed 10,000" },
            })}
          />
          {errors.price && (
            <span className="error">{errors.price.message}</span>
          )}
        </div>

        <div className="input-wrapper">
          <label htmlFor="image">Image (optional):</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button className="submit-btn" type="submit">
          Update Vacation
        </button>
      </form>
    </div>
  );
}
