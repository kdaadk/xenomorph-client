import {scoreDict} from "./scores"

export function getVDOT(distance, timeInMinutes) {
    const velocity = distance / timeInMinutes
    const oxygenCost = getOxygenCost(velocity)
    const intensity = getIntensity(timeInMinutes)
    return oxygenCost / intensity
}

export function getVelocity(percentVDOT, VDOT = 61) {
    const oxygenCost = VDOT * (percentVDOT / 100)
    const result = quadraticEquation(0.000104, 0.182258, -4.6 - oxygenCost)
    const velocity = result.quadratic_roots[0] / 60
    return velocity.toFixed(4)
}

export function getScore(velocity, timeInSeconds, VDOT = 61) {
    const oxygenCost = getOxygenCost(velocity)
    const percentVDOT = (oxygenCost * 100) / VDOT

    if (percentVDOT < 60)
        return scoreDict[59] * (timeInSeconds / 60)
    if (percentVDOT >= 120)
        return scoreDict[120] * (timeInSeconds / 60)
    
    const scorePercents = Object.keys(scoreDict)
    for (let i = 0; i < scorePercents.length; i++) {
        if (scorePercents[i] > percentVDOT && scorePercents[i - 1] <= percentVDOT) {
            return scoreDict[scorePercents[i]] * (timeInSeconds / 60)
        }
    }
}

function getOxygenCost(velocity) {
    return 0.182258 * (velocity * 60) + 0.000104 * Math.pow((velocity * 60), 2) - 4.60
}

function getIntensity(timeInMinutes) {
    return 0.2989558 * Math.pow(2.7182, -0.1932605 * timeInMinutes) +
        0.1894393 * Math.pow(2.7182, -0.012778 * timeInMinutes) + 0.8
}

function quadraticEquation(a, b, c) {
    if(a === 0)
        return false
    let res = {}
    let D = b * b - 4 * a * c

    if(D < 0)
        return false
    res['discriminant'] = D
    if(D === 0)
        res["quadratic_roots"] = (-b + Math.sqrt(D)) / (2 * a)
    else if(D > 0){
        let tmp = []
        tmp.push((-b + Math.sqrt(D)) / (2 * a))
        tmp.push((-b - Math.sqrt(D)) / (2 * a))
        res["quadratic_roots"] = tmp
    }
    return res
}