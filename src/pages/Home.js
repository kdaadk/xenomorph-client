import React, { useState } from "react";
import { Timetable } from "../components/Timetable";
import { UserMenu } from "../components/UserMenu";
import "../styles/Home.scss";

const Home = () => {
  const [from, setFrom] = useState('2020-01-01');
  const [to, setTo] = useState('2020-07-12');
    
  return (
      <div className="xenomorph">
          <div>
              <UserMenu from={from} to={to} changeFrom={setFrom}/>
          </div>
          <Timetable from={from} to={to}/>
      </div>
  );
};

export { Home };
