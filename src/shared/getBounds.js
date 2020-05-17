export function getBounds(points) {
    let s = 0, n = 0, w = 0, e = 0;
    points.forEach(p => {
        if (s === 0 || s > p[0])
            s = p[0];
        if (n === 0 || n < p[0])
            n = p[0];
        if (w === 0 || w > p[1])
            w = p[1];
        if (e === 0 || e < p[1])
            e = p[1];
    });
    return [
        [n, e],
        [s, w]
    ]
}