import logo from "../images/logo.png";
import { useDates } from "../hooks/useDates";
import { format } from "date-fns";

export const Header = () => {
  const { current } = useDates();
  return (
    <header className="App-header">
      <div className="img-wrapper">
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          height="80"
          width="200"
        />
      </div>
      <p id="date">{format(current, "MMM d, Y")}</p>
    </header>
  );
};
