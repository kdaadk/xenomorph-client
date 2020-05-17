import React, {Component} from "react";
import runner from "../images/runner.png";
import cycle from "../images/cycle.png";
import ski from "../images/ski.png";
import {DetailsModal} from "./DetailsModal";

class Activity extends Component {
    state = {
        openDetailsModal: false
    }

    setDetailsModalState = (value) => this.setState({openDetailsModal: value})

    render() {
        let { activity, style } = this.props;
        const { openDetailsModal } = this.state;
        
        if (activity.score > 20 && activity.type === "Run")
            style = style.concat(" hard-work");

        return (
            <div>
                <button className={style} role="cell" onClick={() => this.setDetailsModalState(true)}>
                    {activity.type === "Run" && (
                        <span>
                            <img src={runner} alt="Run" width="32" height="32"/>
                            {`${(activity.distance / 1000).toFixed(0)} km ${activity.score} score`}
                        </span>
                    )}
                    {this.renderActivity("Ride", cycle, activity)}
                    {this.renderActivity("Ski", ski, activity)}
                </button>
                {openDetailsModal && (
                    <DetailsModal openModal={openDetailsModal} setOpenModal={this.setDetailsModalState} activity={activity}/>
                )}
            </div>
        )
    }

    renderActivity(type, imgSrc, activity) {
        return activity.type === type && (
            <span>
                <img src={imgSrc} alt={type} width="32" height="32"/>
                <span> {this.getDescription(activity)}</span>
            </span>
        );
    }

    getDescription(activity) {
        return `${(activity.distance / 1000).toFixed(0)} km ${(activity.time / 60).toFixed(0)} min`;
    }
}

export { Activity };