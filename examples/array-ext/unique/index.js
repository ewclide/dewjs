let arr = [1, 2, 3, 2, 4, 5, 3, 6, 7, 2];

log.time();
DEW.array.unique(arr);
log.timeEnd();

log(arr);