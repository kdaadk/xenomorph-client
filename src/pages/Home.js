import React from "react";
import { Timetable } from "../components/Timetable";
import { UserMenu } from "../components/UserMenu";
import "../styles/Home.scss";

const Home = props => {
  return (
      <div className="xenomorph">
          <div>
              <UserMenu />
          </div>
          <Timetable />
      </div>
  );
};

export { Home };
