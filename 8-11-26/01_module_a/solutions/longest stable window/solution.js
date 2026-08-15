/**
 * Returns the longest contiguous window where max - min <= limit.
 * Time: O(n). Space: O(n) worst case.
 */
function longestStableWindow(readings, limit) {
    if (!Array.isArray(readings) || readings.length === 0) return 0;
    if (!Number.isFinite(limit) || limit < 0) return 0;

    const maxDeque = [];
    const minDeque = [];
    let maxHead = 0;
    let minHead = 0;
    let left = 0;
    let best = 0;

    for (let right = 0; right < readings.length; right += 1) {
        const value = readings[right];

        while (maxDeque.length > maxHead && readings[maxDeque.at(-1)] < value) {
            maxDeque.pop();
        }
        maxDeque.push(right);

        while (minDeque.length > minHead && readings[minDeque.at(-1)] > value) {
            minDeque.pop();
        }
        minDeque.push(right);

        while (readings[maxDeque[maxHead]] - readings[minDeque[minHead]] > limit) {
            if (maxDeque[maxHead] === left) maxHead += 1;
            if (minDeque[minHead] === left) minHead += 1;
            left += 1;
        }

        best = Math.max(best, right - left + 1);
    }

    return best;
}
