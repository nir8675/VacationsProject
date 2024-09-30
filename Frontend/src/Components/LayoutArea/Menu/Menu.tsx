import { NavLink } from "react-router-dom";
import "./Menu.css";

function Menu(): JSX.Element {
    return (
        <div className="Menu">

            <NavLink to="/home">Home</NavLink>
            <NavLink to="/vacations">Vacations</NavLink>
            <NavLink to="/add-vacation">Add Vacation</NavLink>


        </div>
    );
}

export default Menu;
