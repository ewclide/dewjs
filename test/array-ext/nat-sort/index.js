/**
1) a single value is greater than the value range if it is greater than the minimum value
2) work correctly when the accuracy of values is 0.00001
3) supports characters ".,-" and not sensitive to spaces.
*/

let arr = [ "4-5 kg", "4-7 kg", "4-5", "3-7.5 kg", "3 kg", 4.1, "4", "7-8.5 kg", "7-8,05 kg", 2.5 ];

DEW.array.natSort(arr);
log(arr)