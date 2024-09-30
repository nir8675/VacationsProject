import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../../HomeArea/Home/Home";
import { Login } from "../../UserArea/Login/Login";
import { Register } from "../../UserArea/Register/Register";
import { AddVacation } from "../../VacationArea/AddVacation/AddVacation";
import { EditVacation } from "../../VacationArea/VacationEdit/VacationEdit";
import { VacationList } from "../../VacationArea/VacationList/VacationList";
import { VacationReport } from "../../VacationArea/VacationReport/VacationReport";
import Page404 from "../page404/page404";
import ProtectedRoute from "./ProtectedRoute";
import "./Routing.css";

function Routing(): JSX.Element {
  return (
    <div className="Routing">
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/vacations" element={<VacationList />} />
          <Route path="/add-vacation" element={<AddVacation />} />
          <Route path="/edit-vacation/:id" element={<EditVacation />} />
          <Route path="/vacations/report" element={<VacationReport />} />
        </Route>
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default Routing;
