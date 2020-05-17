export function getStreamBy (type, streams) {
    const data = streams.filter(d => d.type === type)[0];
    if (data) {
        return data.data;
    }
}