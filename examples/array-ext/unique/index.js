const { unique } = Dew.array;

const arr = [1, 2, 3, 2, 4, 5, 3, 6, 7, 2];

log.time('new array');
const newArray = unique(arr);
log.timeEnd('new array');
log(arr, newArray);

// more faster
log.time('change original array');
unique(arr, true);
log.timeEnd('change original array');
log(arr);