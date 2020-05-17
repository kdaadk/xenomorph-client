import React, {Component} from "react";
import groupBy from "lodash/groupBy";
import moment from "moment";
import {Day} from "./Day";

class Week extends Component {
    render() {
        const { activities, week, year } = this.props;
        if (!activities) {
            return (
                <div className="flex-table row week" role="rowgroup">
                    {Array.from(Array(7).keys()).map(dayOfWeek => {
                        const momentDate = this._getMomentDate(year, week, dayOfWeek);
                        return <Day momentDate={momentDate} key={dayOfWeek}/>;
                    })}
                    <div className="flex-row total" />
                </div>
            )
        }
        const activitiesOfWeekModel = this._getEventsOfWeekModel(activities, week, year);
        const total = this._getTotal(activities);
        return (
            <div className="flex-table row week" role="rowgroup">
                {activitiesOfWeekModel.map(model => {
                    if (model.activities.length === 0)
                        return <Day momentDate={model.momentDate} key={model.momentDate}/>;
                    return <Day momentDate={model.momentDate} activities={model.activities} key={model.momentDate}/>
                })}
                <div className="flex-row total">
                    <div>{`${total.min} min ${total.km} km`}</div>
                    <div>{`${total.score} score`}</div>    
                </div>
            </div>
        );
    }

    _getEventsOfWeekModel(activitiesOfWeek, week, year) {
        const activitiesGroupByDayObj = groupBy(activitiesOfWeek, (e) => moment(e.startDate).day());
        const activitiesGroupByDay = Object.keys(activitiesGroupByDayObj).map(key => ({
            momentDate: moment(activitiesGroupByDayObj[key][0].startDate),
            activities: activitiesGroupByDayObj[key]
        }));

        return moment.weekdays().map(weekDay => {
            const momentDate = this._getMomentDate(year, week, weekDay);
            if (!activitiesGroupByDay.map(e => e.momentDate.date()).includes(momentDate.date()))
                return ({momentDate: momentDate, activities: []});
            return activitiesGroupByDay.find(x => x.momentDate.date() === momentDate.date());
        });
    }

    _getTotal(activitiesOfWeek) {
        const totalMin = (activitiesOfWeek.map((a) => a.time)
            .reduce((a, b) => a + b, 0) / 60).toFixed(0);
        const totalKm = (activitiesOfWeek.map((a) => (a.type === "Run") ? a.distance : 0)
            .reduce((a, b) => a + b, 0) / 1000).toFixed(2);
        const totalScore = activitiesOfWeek.map((a) => (a.type === "Run") ? a.score : 0)
            .reduce((a, b) => a + b, 0).toFixed(2);
        return {min: totalMin, km: totalKm, score: totalScore};
    }

    _getMomentDate(year, week, dayOfWeek = "Sunday") {
        return moment().day(dayOfWeek).year(year).week(week);
    }
}

export {Week};