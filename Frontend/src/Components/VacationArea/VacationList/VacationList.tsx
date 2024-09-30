import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../Redux/store";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationActions } from "../../../Redux/store";
import { vacationsService } from "../../../Services/VacationsService";
import { VacationCards } from "../VacationCards/VacationCards";
import { Role } from "../../../Models/enums";
import { Link } from "react-router-dom";
import "./VacationList.css";

export function VacationList(): JSX.Element {
  const [vacations, setVacations] = useState<VacationModel[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showLiked, setShowLiked] = useState<boolean>(false);
  const [filterActive, setFilterActive] = useState<boolean>(false);
  const [filterUpcoming, setFilterUpcoming] = useState<boolean>(false);
  const itemsPerPage = 9;
  const dispatch = useDispatch();

  // The token is used for authentication, and roleId helps in identifying the user's role
  const token = useSelector((state: AppState) => state.auth.token);
  const roleId = useSelector((state: AppState) => state.user.roleId); // Select roleId from state

  // This checks if the user's roleId corresponds to an admin role
  const isAdmin = Number(roleId) === Role.Admin;

  const userId = useSelector<AppState, number>((state) => state.user.id); // Select userId from state

  // This effect runs when the token, dispatch, or userId changes
  useEffect(() => {
    // If there's no token, warn that the user is not logged in and exit the function
    if (!token) {
      console.warn("User is not logged in.");
      return;
    }

    // Fetch the user's vacations from the API using their userId
    vacationsService
      .getAllVacationsByUserId(userId)
      .then((vacations) => {
        // If vacations were successfully fetched, update the state and dispatch an action
        if (vacations.length > 0) {
          setVacations(vacations); // Update the vacations state with the fetched data
          const action = vacationActions.initVacations(vacations); // Prepare the action to initialize vacations in the Redux store
          dispatch(action); // Dispatch the action to store the vacations in the Redux state
        } else {
          // Log a warning if no vacations were fetched
          console.warn("No vacations were fetched from the API.");
        }
      })
      .catch((err) => {
        // If there's an error during the API call, show an alert with the error message
        alert(err.message);
      });
  }, [token, dispatch, userId]); // Dependencies: the effect runs when token, dispatch, or userId changes

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Function to filter vacations based on filter state
  const filterVacations = (vacation: VacationModel) => {
    const now = new Date().getTime();
    const startDate = new Date(vacation.startDate).getTime();
    const endDate = new Date(vacation.endDate).getTime();

    const likedFilter = !showLiked || vacation.isLiked === 1;
    const activeFilter = !filterActive || (startDate <= now && endDate >= now);
    const upcomingFilter = !filterUpcoming || startDate > now;

    return likedFilter && activeFilter && upcomingFilter;
  };

  const currentVacations = vacations
    .filter(filterVacations)
    .slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle vacation deletion
  const handleDeleteVacation = async (vacationId: number) => {
    try {
      await vacationsService.deleteVacation(vacationId);
      setVacations((prevVacations) =>
        prevVacations.filter((vacation) => vacation.id !== vacationId)
      );
    } catch (error) {
      console.error("Failed to delete vacation:", error);
    }
  };

  // Go to the next page
  const nextPage = () => {
    if (currentPage < Math.ceil(vacations.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Toggle show liked vacations
  const toggleShowLiked = () => {
    setShowLiked((prevShowLiked) => !prevShowLiked);
    setCurrentPage(1); // Reset pagination to the first page
  };

  // Toggle filter for active vacations
  const toggleFilterActive = () => {
    setFilterActive((prev) => !prev);
    setFilterUpcoming(false); // Disable the upcoming filter if active filter is selected
    setCurrentPage(1); // Reset pagination to the first page
  };

  // Toggle filter for upcoming vacations
  const toggleFilterUpcoming = () => {
    setFilterUpcoming((prev) => !prev);
    setFilterActive(false); // Disable the active filter if upcoming filter is selected
    setCurrentPage(1); // Reset pagination to the first page
  };

  return (
    <div className="VacationList">
      <div className="header d-flex">
        {isAdmin && (
          <Link to="/vacations/report" className="bn632-hover bn26">
            View Vacation Report
          </Link>
        )}
        {!isAdmin && (
          <>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckLiked"
                checked={showLiked}
                onChange={toggleShowLiked}
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckLiked"
              >
                {showLiked ? "Show All Vacations" : "Show Liked Vacations"}
              </label>
            </div>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckActive"
                checked={filterActive}
                onChange={toggleFilterActive}
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckActive"
              >
                {filterActive ? "Show All Vacations" : "Show Active Vacations"}
              </label>
            </div>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckUpcoming"
                checked={filterUpcoming}
                onChange={toggleFilterUpcoming}
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckUpcoming"
              >
                {filterUpcoming
                  ? "Show All Vacations"
                  : "Show Upcoming Vacations"}
              </label>
            </div>
          </>
        )}
      </div>

      <div className="vacation-cards-container">
        {currentVacations.length > 0 ? (
          currentVacations.map((vacation) => (
            <VacationCards
              key={vacation.id}
              vacation={vacation}
              isAdmin={isAdmin} // Pass isAdmin based on roleId
              onToggleLike={() => {
                console.log("Like toggle function called");
              }}
              onDeleteVacation={handleDeleteVacation} // Pass the delete function
            />
          ))
        ) : (
          <p>No vacations available</p>
        )}
      </div>

      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={nextPage}
          disabled={currentPage === Math.ceil(vacations.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
