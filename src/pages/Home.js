import React, { Component } from "react";
import {Timetable} from "../components/Timetable";
import {StravaProvider} from "../components/StravaProvider";

export class Home extends Component {
    static displayName = Home.name;

    render() {
        return (
            <div>
                <header className="Xenomorph">
                    <StravaProvider />
                    <Timetable />
                </header>
            </div>
        );
    }
}

export default Home; 
