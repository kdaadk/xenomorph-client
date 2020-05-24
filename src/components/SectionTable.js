import React from "react";
import "../shared/stringExtensions";
import { getAverageVelocity } from "../shared/getAverageVelocity";

const SectionTable = props => {
  return (
    <table className={props.className}>
      <tbody>
        <tr>
          <th>№</th>
          <th>Meters</th>
          <th>Time</th>
          <th>Temp</th>
        </tr>
        {props.sections.map((s, idx) => (
          <tr className={s.temp} key={s.time.from}>
            <td>{idx + 1}</td>
            <td>{s.distance.total.toFixed(0)}</td>
            <td>{s.time.total.toString().toHHMMSS()}</td>
            <td>{getAverageVelocity(s.distance.total, s.time.total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { SectionTable };
