import React from "react";
import { Timetable } from "../components/Timetable";
import { StravaProvider } from "../components/StravaProvider";

const Home = props => {
  return (
    <div>
      <header className="xenomorph">
        <StravaProvider />
        <Timetable />
      </header>
    </div>
  );
};

export { Home };
