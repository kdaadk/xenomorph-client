import React from "react";
import Timetable from "../components/Timetable";
import { StravaProvider } from "../components/StravaProvider";

const Home = props => {
  return (
    <div>
      <header className="Xenomorph">
        <StravaProvider />
        <Timetable />
      </header>
    </div>
  );
};

export default Home;
