import React, { useState, useEffect } from "react";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationsService } from "../../../Services/VacationsService";
import { Link } from "react-router-dom";
import "./VacationCards.css";

interface VacationCardProps {
  vacation: VacationModel;
  onToggleLike: () => void;
  isAdmin: boolean; // Prop to indicate if the user is an admin
  onDeleteVacation: (vacationId: number) => void; // Callback for delete action
}

export function VacationCards(props: VacationCardProps): JSX.Element {
  const { vacation, onToggleLike, isAdmin, onDeleteVacation } = props;

  // Initialize likes count and like state from the vacation props
  const initialLikesCount = Number(vacation.likesCount) || 0;
  const initialIsLiked = vacation.isLiked === 1;

  const [likesCount, setLikesCount] = useState<number>(initialLikesCount);
  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked);

  // Function to handle like button click
  const handleToggleLike = async () => {
    try {
      const updatedVacation = await vacationsService.toggleLike(vacation.id);

      // Update the state with the new likes count and isLiked status
      setLikesCount(updatedVacation.likesCount);
      setIsLiked(!isLiked); // Convert 1 to true

      // Optionally notify the parent component of the change (if needed)
      if (onToggleLike) {
        onToggleLike();
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  // Function to handle delete button click
  const handleDelete = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this vacation?"
    );
    if (isConfirmed) {
      onDeleteVacation(vacation.id); // Notify the parent component to delete the vacation
    }
  };

  // Function to format date to display in Israeli format
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("he-IL");
  };

  // useEffect to update state when vacation details change
  useEffect(() => {
    setLikesCount(Number(vacation.likesCount) || 0);
    setIsLiked(vacation.isLiked === 1);
  }, [vacation.likesCount, vacation.isLiked]);

  return (
    <div className="VacationCards">
      <div className="card">
        <img className="card-img-top" src={vacation.imageUrl} alt="vacation" />
        <div className="card-body">
          <h5 className="card-title">{vacation.destination}</h5>
          <span className="date-range">
            {formatDate(vacation.startDate)} - {formatDate(vacation.endDate)}
          </span>
          <p className="card-text">{vacation.description}</p>
          <div className="price-box">${vacation.price}</div>

          {!isAdmin && (
            <div className="like-container">
              <button
                className={`like-button ${isLiked ? "liked" : ""}`}
                onClick={handleToggleLike}
              >
                <span>❤️</span> {likesCount}
              </button>
            </div>
          )}

          {isAdmin && (
            <>
              <Link
                to={`/edit-vacation/${vacation.id}`}
                className="btn-primary"
              >
                Edit Vacation
              </Link>
              <button onClick={handleDelete} className="btn-danger">
                Delete Vacation
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
