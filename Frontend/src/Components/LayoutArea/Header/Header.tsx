import { UserMenu } from "../../UserArea/UserMenu/UserMenu";
import airplaneImage from "../../../Assets/Images/airplane_.png";

import "./Header.css";

function Header(): JSX.Element {
  return (
    <div className="Header">
      <img src={airplaneImage} alt="Airplane" className="header-img" />
      <h2 className="header-title">Vacations Project</h2>
      <UserMenu />
    </div>
  );
}

export default Header;
