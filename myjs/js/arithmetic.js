function shellSort(arr) {
    var base = 0;
    var j = 0;

    for (var temp = Math.floor(arr.length/2); temp > 0; temp = Math.floor(temp/2)) {
        for (var i = temp; i < arr.length; i++) {
            if (arr[i-temp] > arr[i]) {
                base = arr[i];
                for (j = i; arr[j-temp] > base; j = j-temp) {
                    arr[j] = arr[j-temp];
                }
                arr[j] = base;
            }
        }
    }

    return arr;
}

var test = [5, 9, 3, 1, 4, 8, 2];
console.log(shellSort(test));