import "../shared/stringExtensions";

export function getAverageVelocity(distance, time) {
    return Math.round(time / (distance / 1000)).toString().toHHMMSS()
}