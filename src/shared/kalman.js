import KalmanFilter from "kalmanjs";

export function kalman(velocity) {
    let result = [];
    const kf = new KalmanFilter({R: 0.1, Q: 3});
    velocity.forEach(v => result.push(kf.filter(v)));
    return result;
}