const r = [6.0606, 5.1282]
const i = [5.1282, 4.6512]
const t = [4.6512, 4.3478]
const m = [4.3478, 3.9216]
const e = [3.9216, 0] //2.7778

export function getSections(velocity, distance, time) {
    if (!velocity || ! distance || ! time)
        return []
    
    const upTrends = getUpTrends(velocity, distance, time)
    const downTrends = getDownTrends(velocity, distance, time)
    const trends = [...upTrends, ...downTrends].sort((a, b) => a.time.from - b.time.from)
    let sections = []

    for (let j = 0; j < trends.length; j++) {
        const prevStartSectionDist = j === 0 ? 0 : trends[j - 1].distance.from
        const prevStartSectionTime = j === 0 ? 0 : trends[j - 1].time.from
        const avgV = (trends[j].distance.from - prevStartSectionDist) / (trends[j].time.from - prevStartSectionTime)
        processByTemp(avgV, sections, trends[j], prevStartSectionDist, prevStartSectionTime, e, "e")
        processByTemp(avgV, sections, trends[j], prevStartSectionDist, prevStartSectionTime, m, "m")
        processByTemp(avgV, sections, trends[j], prevStartSectionDist, prevStartSectionTime, t, "t")
        processByTemp(avgV, sections, trends[j], prevStartSectionDist, prevStartSectionTime, i, "i")
        processByTemp(avgV, sections, trends[j], prevStartSectionDist, prevStartSectionTime, r, "r")
    }

    if (sections.length === 0)
        return []
    
    let lastSection = sections[sections.length - 1]
    let lastDistance = distance[distance.length - 1]
    let lastTime = time[time.length - 1]
    
    sections.push({
        temp: "e",
        distance: {from: lastSection.distance.to, to: lastDistance, total: lastDistance - lastSection.distance.to},
        time: {from: lastSection.time.to, to: lastTime, total: lastTime - lastSection.time.to},
        avgV: getAvgVelocity(lastSection.distance.to, lastDistance, lastSection.time.to, lastTime)
    })


    for (let j = 0; j < trends.length; j++) {
        sections[j].distance.total = sections[j].distance.to - sections[j].distance.from
        sections[j].time.total = sections[j].time.to - sections[j].time.from

        if (sections[j].temp !== "e") {
            sections[j].distance.round = Math.round(sections[j].distance.total / 200) * 200
            const percent =  (sections[j].distance.total * 100) / sections[j].distance.round
            sections[j].time.round = ((sections[j].time.total * 100) / percent).toFixed(2)
        }

    }

    /*const divideSection = {easy:[], tempo:[]}
    sections.forEach(s => s.temp === "e" ? divideSection.easy.push(s) : divideSection.tempo.push(s))
    console.log(divideSection)
    
    let grouped = groupBy(divideSection.tempo, s => s.distance.round)
    console.log(grouped)*/

    console.log(sections)
    return sections
}

function getTrend(currentTrend) {
    return {
        len: currentTrend.length,
        distance: {from: currentTrend[0].d, to: currentTrend[currentTrend.length - 1].d},
        velocity: {from: currentTrend[0].v, to: currentTrend[currentTrend.length - 1].v},
        time: {
            from: currentTrend[0].t,
            to: currentTrend[currentTrend.length - 1].t,
            avg: (currentTrend[0].t + currentTrend[currentTrend.length - 1].t) / 2
        }
    }
}

function getUpTrends (velocity, distance, time) {
    let minValue = 0
    let currentTrend = []
    let trends = []
    for (let i = 0; i < velocity.length; i++) {
        const avg = velocity.slice(i - 10, i).reduce((a, b) => a + b, 0) / 10
        if (velocity[i] > minValue || (i > 10 && velocity[i] > avg)) {
            currentTrend.push({v: velocity[i], d: distance[i], t: time[i]})
            minValue = velocity[i]
        }
        else {
            if (currentTrend.length === 0) continue
            trends.push(getTrend(currentTrend))
            currentTrend = []
        }
    }
    return trends.filter(
        t => t.len > 10 &&
            t.velocity.to - t.velocity.from > 1 &&
            t.velocity.to > e[0]
    )
}

function getDownTrends (velocity, distance, time) {
    let maxValue = 10
    let currentTrend = []
    let trends = []
    for (let i = 0; i < velocity.length; i++) {
        const avg = velocity.slice(i - 10, i).reduce((a, b) => a + b, 0) / 10
        if (velocity[i] < maxValue || (i > 10 && velocity[i] < avg)) {
            currentTrend.push({v: velocity[i], d: distance[i], t: time[i]})
            maxValue = velocity[i]
        }
        else {
            if (currentTrend.length === 0) continue
            trends.push({
                len: currentTrend.length,
                distance: {from: currentTrend[0].d, to: currentTrend[currentTrend.length - 1].d},
                velocity: {from: currentTrend[0].v, to: currentTrend[currentTrend.length - 1].v},
                time: {
                    from: currentTrend[0].t,
                    to: currentTrend[currentTrend.length - 1].t,
                    avg: (currentTrend[0].t + currentTrend[currentTrend.length - 1].t) / 2
                }
            })
            currentTrend = []
        }
    }
    return trends.filter(
        t => t.len > 10 &&
            t.velocity.from - t.velocity.to > 1 &&
            t.velocity.from > e[0]
    )
}

function getAvgVelocity (d1, d2, t1, t2) { return (d2 - d1) / (t2 - t1) }

function processByTemp (avgV, sections, trend, prevStartSectionDist, prevStartSectionTime, tempBorder, temp) {
    let last = sections[sections.length - 1]
    if (avgV < tempBorder[0] && avgV >= tempBorder[1]) {
        if (sections.length !== 0 && last.temp === temp) {
            last.distance.to = trend.distance.from
            last.time.to = trend.time.from
            last.avgV = getAvgVelocity(last.distance.from, last.distance.to, last.time.from, last.time.to)
        }
        else {
            sections.push({
                temp: temp,
                distance: {from: prevStartSectionDist, to: trend.distance.from, total: trend.distance.from - prevStartSectionDist},
                time: {from: prevStartSectionTime, to: trend.time.from, total: trend.time.from - prevStartSectionTime},
                avgV: avgV
            })
        }
    }
}