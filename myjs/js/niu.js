// 三数取中
/*
function selectMed(arr, l, m, r) {
    var a = arr[l];
    var b = arr[m];
    var c = arr[r];

    if((a-b)*(b-c)>0) {
        arr[m] = a;
        a = b;
    }
    if ((b-c)*(c-a)>0) {
        arr[r] = a;
        a = c;
    }

    return a;
}
*/


// 希尔排序
// 基本思想：将数组根据某一增量分为若干子序列，对子序列进行插入排序，然后逐渐减小增量，重复之前步骤
// 我理解的：其实就是对插入排序的优化
/*
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
*/


// 堆排序
// 基本思想：首先构建大顶堆，接着交换第一项和最后一项（需要再次调整一下堆，使它满足大顶堆结构），然后忽略最后一项重复之前的步骤 
/*
function swap(arr, x, y) {
    var aux = arr[x];
    arr[x] = arr[y];
    arr[y] = aux;
}

function heapify(arr, n, i) {
    var j = 2*i+1;

    if (j+1 < n && arr[j] < arr[j+1]) {
        j++;
    }

    if (arr[i] < arr[j]) {
        swap(arr, i, j);

        if (j <= Math.floor(n/2)-1) {
            heapify(arr, n, j);
        }
    }
}

function heapSort(arr) {
    var lng = arr.length;
    if (lng <= 1) {
        return arr;
    }

    for (var i = Math.floor(lng/2)-1; i >= 0; i--) {
        heapify(arr, lng, i);
    }

    while (lng > 2) {
        lng--;
        swap(arr, 0, lng);
        heapify(arr, lng, 0);
    }
    swap(arr, 0, 1);

    return arr;
}

var test = [5, 9, 3, 1, 4, 8, 2];
console.log(heapSort(test));
*/


// 快速排序
// 基本思想：将中间项设为基准数；接着把比基准数小的数放左边，大于或等于它的数放右边；然后对左右两个小数组重复之前的操作，直到小数组只有1个数
// 我理解的：预先执行arr[mid] = arr[i]操作就可以用链式赋值来替代交换操作了（本来基准数就没必要再参与了）
// 优化点：arr[i++] = arr[j]链式赋值的时候可以预先移动一步指针位置
/*
function quick(arr, left, right) {
    var i = left;
    var j = right;
    var mid = Math.floor((i+j) / 2);
    var pivot = arr[mid];

    arr[mid] = arr[i];
    while (i < j) {
        while (arr[j] >= pivot && i < j) {
            j--;
        }
        if (i < j) {
            arr[i++] = arr[j];
        }
        while (arr[i] < pivot && i < j) {
            i++;
        }
        if (i < j) {
            arr[j--] = arr[i];
        }
    }
    arr[i] = pivot;

    if (left < i - 1) {
        quick(arr, left, i - 1);
    }
    if (i+1 < right) {
        quick(arr, i+1, right);
    }
}

function quickSort(arr) {
    if (arr.length > 1) {
        quick(arr, 0, arr.length-1);
    }

    return arr;
}

// var test = [5, 9, 3, 1, 4, 8];
var test = [6, 5, 4, 3, 2, 1];
console.log(quickSort(test));
*/

// 归并排序
// 基本思想：将原始数组切分成较小的数组，直到每个小数组只有一个位置，接着将小数组归并成较大的数组，直到最后只有一个排序完毕的大数组
//迭代实现
// 我的理解：自下而上分析，将原始数组每一项都看作一个有序数组进行两两归并，接着以之前为基础再两两归并，以此类推直到归并成原始规模（直接开始归并）
/*
function mergeSort(arr) {
    var lng = arr.length;
    var t = 1;
    var il = 0;
    var ir = il + t;
    var aux = [];
    var j = 0;
    var lng_l = 0;
    var lng_r = 0;

    while (t < lng) {
        while (ir < lng) {
            lng_l = il + t;
            lng_r = ir + t;
            if (lng_r > lng) {
                lng_r = lng;
            }

            while ((il < lng_l) && (ir < lng_r)) {
                if (arr[il] < arr[ir]) {
                    aux[j++] = arr[il++];
                } else {
                    aux[j++] = arr[ir++];
                }
            }

            while (il < lng_l) {
                aux[j++] = arr[il++];
            }

            while (j > 0) {
                arr[--ir] = aux[--j];
            }

            il = lng_r;
            ir = il + t;
            j = 0;
        }

        t *= 2;
        il = 0;
        ir = il + t;
    }

    return arr;
}

var test = [5, 9, 3, 1, 4, 8];
console.log(mergeSort(test));
*/
// 递归实现
// 我的理解：自上而下分析，将原始数组一分为二，接着将分割后的两个数组再次平分，以此类推直到分割成一项，然后将分割的结果进行两两归并，接着以之前为基础再两两归并，以此类推直到归并成原始规模（拆分好之后才开始归并）
/*
function merge(left, right) {
    var res = [];
    var il = 0;
    var ir = 0;

    while ((il < left.length) && (ir < right.length)) {
        if (left[il] < right[ir]) {
            res.push(left[il++]);
        } else {
            res.push(right[ir++]);
        }
    }

    while (il < left.length) {
        res.push(left[il++]);
    }

    while (ir < right.length) {
        res.push(right[ir++]);
    }

    return res;
}

function mergeSort(arr) {
    var lng = arr.length;
    if (lng <= 1) {
        return arr;
    }
    var mid = Math.floor(lng/2);
    var left = arr.slice(0, mid);
    var right = arr.slice(mid, lng);

    return merge(mergeSort(left), mergeSort(right));
}

var test = [5, 9, 3, 1, 4, 8];
console.log(mergeSort(test));
*/

// 插入排序
// 基本思想：假定第一项已经排序了，接着分析第二项是应该待在原位还是插入到第一项的位置呢？接着分析第三项是该待在原位还是插入到第一、第二的位置呢？），以此类推
// 我的理解：外层循环设定当前项为这一圈的基准数，内层循环从基准数开始往前逐个分析，如果当前项的前一项比基准数大就复制前一项的值给当前项，否则就将基准数插入到该项
// 优化点：arr[i-1] > arr[i] 既然之前是已经排好序的，如果前一项比当前项小，那么当前项就是插在这里的
/*
function insertionSort(arr) {
    var base = 0;
    var j = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i-1] > arr[i]) {
            base = arr[i];
            for (j = i; arr[j-1] > base; j--) {     // 第一次发现for循环中间判断条件不是只能使用什么j这个变量来做比较的
                arr[j] = arr[j-1];
            }
            arr[j] = base;
        }
    }

    return arr;
}

var test = [5, 9, 3, 1, 4, 8];
console.log(insertionSort(test));
*/

// 选择排序
// 基本思想：找出最小值并将其放置在第一位，接着找到第二小的值并将其放在第二位，以此类推
// 我理解的：外层循环假定当前项为这一圈的最小数，内层循环从后面的数中选择最小的一个数并且比假定的要小的数出来交换
// 优化点：内部变量mini的作用是先找出这一圈最小数的索引然后再做交换
/*
function swap(arr, x, y) {
    var aux = arr[x];
    arr[x] = arr[y];
    arr[y] = aux;
}

function selectionSort(arr) {
    var mini = 0;

    for (var i = 0; i < arr.length-1; i++) {
        mini = i;
        for (var j = i+1; j < arr.length; j++) {
            if (arr[mini] > arr[j]) {
                mini = j;
            }
        }
        if (mini != i) {
            swap(arr, i, mini);
        }
    }

    return arr;
}

var test = [5, 9, 3, 1, 4, 8];
console.log(selectionSort(test));
*/

// 冒泡排序
// 基本思想：比较任何两个相邻的项，如果第一个比第二个大，则交换它们
// 我理解的：外层循环表示排序圈数，内层循环每相邻两个数作一次比较，小的放前面，大的放后面
// 优化点：1、i < arr.length-1的意思是忽略最后只剩下一个数的情况        2、由于每一圈排序直接把最大的数给挪到了最后，所以下一圈的排序可以忽略掉上一圈得出的最大数，故j < arr.length-1-i的意思是通过减去已经进行过的圈数来缩小循环的右临界值
/*
function swap(arr, x, y) {
    var aux = arr[x];
    arr[x] = arr[y];
    arr[y] = aux;
}

function bubbleSort(arr) {
    for (var i = 0; i < arr.length-1; i++) {
        for (var j = 0; j < arr.length-1-i; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr, j, j+1);
            }
        }
    }

    return arr;
}

var test = [5, 9, 3, 1, 4, 8];
console.log(bubbleSort(test));
*/

// 数组去重
/*
function uniqueInOrder(iterable) {
    var res = [iterable[0]];

    for (var i = 1; i < iterable.length; i++) {
        if (res.indexOf(iterable[i]) == -1) {
            res.push(iterable[i]);
        }
    }

    return res;
}

var test = "AAAABBBCCDAABBB";
console.log(uniqueInOrder(test));
*/

// 首字母大写
/*
String.prototype.toJadenCase = function () {
    return this.replace(/\s.?/g, function(s) {
        return s.toUpperCase();
    });
}

var test = "Most trees are blue";
console.log(test);
test = test.toJadenCase();
console.log(test);
*/


// 输入一个人整数，如果是素数则返回该数是素数，否则返回该数除本身和1之外的所有因子
/*
function divisors(integer) {
    var ret = [];
    var root = Math.floor(Math.sqrt(integer));

    if (root > 1) {
        for (var i = root; i > 1; i--) {
            var j = integer/i;
            if (j%1 == 0) {
                ret.unshift(i);
                ret.push(j);
            }
        }
    }

    return (ret.length) ? ret : integer+" is prime";
};
*/


// 简易加密，每个字母用字母表中下一个字母替换
/*
function encry(str) {
    var tarStr = "";
    for (var i = 0; i < str.length; i++) {
        var curStr = str[i];
        if (/^[a-zA-Z]*$/.test(curStr)) {
            var as = curStr.charCodeAt(0);
            if (as == 90) {
                as = 65;
            } else if (as == 122) {
                as = 97;
            } else {
                as++;
            }
            tarStr = tarStr.concat(String.fromCharCode(as));
        } else {
            tarStr = tarStr.concat(curStr);
        }
    }
    console.log(tarStr);
}

encry("Hello! How are you!");
*/