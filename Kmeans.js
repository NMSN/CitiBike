function kmeansGroup(groupNumber, arrOrgin) {
    var arrOrgin = arrOrgin;
    var arrGroup = new Array(groupNumber);

    const HOUR = 17;

    for (var i = 0; i < groupNumber; i++) {
        var index = Math.floor(Math.random() * arrOrgin.length);
        arrGroup[i] = [];
        arrGroup[i].push(arrOrgin[index]);
    }

    for (var i = 0; i < arrOrgin.length; i++) {
        var mark = 0;
        var minSimilarity = 1;
        for (var j = 0; j < arrGroup.length; j++) {
            var theSimilarity = kmeansSimilarity(arrGroup[j][0].arr, arrOrgin[i].arr);
            if (theSimilarity < minSimilarity) {
                minSimilarity = theSimilarity;
                mark = j;
            }
        }
        arrGroup[mark].push(arrOrgin[i]);
    }
    console.log('arrGroup',arrGroup);

    for (var i = 0; i < arrGroup.length; i++) {
        var sum = [];
        // 初始化sum数组
        for(var k=0;k<HOUR;k++){
            sum[k] = 0;
        }
        for (var j = 0; j < arrGroup[i].length; j++) {
            for(var k=0;k<HOUR;k++){
                sum[k] += arrGroup[i][j].arr[k];
            }
        }
        // console.log('sum',sum);
        arrGroup[i].ave = [];
        for(var k=0;k<HOUR;k++){
            arrGroup[i].ave[k] = (sum[k] / arrGroup[i].length).toFixed(8);
        }
        // console.log('arrGroup',arrGroup[i]);
    }
    // console.log('arrGroup',arrGroup);
    // 初代kmeans聚类

    var n = 0;
    do {
        // 清空数组
        for (var i = 0; i < arrGroup.length; i++) {
            arrGroup[i].splice(0, arrGroup[i].length);
        }
        for (var i = 0; i < arrOrgin.length; i++) {
            var mark = 0;
            var minSimilarity = 1;
            for (var j = 0; j < arrGroup.length; j++) {
                var theSimilarity = kmeansSimilarity(arrGroup[j].ave, arrOrgin[i].arr);
                if (theSimilarity < minSimilarity) {
                    minSimilarity = theSimilarity;
                    mark = j;
                }
            }
            arrGroup[mark].push(arrOrgin[i]);
        }
        for (var i = 0; i < arrGroup.length; i++) {
            var sum = [];
            // 初始化sum数组
            for(var k=0;k<HOUR;k++){
                sum[k] = 0;
            }
            for (var j = 0; j < arrGroup[i].length; j++) {
                for(var k=0;k<HOUR;k++){
                    sum[k] += arrGroup[i][j].arr[k];
                }
            }
            // console.log('sum',sum);
            arrGroup[i].ave = [];
            for(var k=0;k<HOUR;k++){
                arrGroup[i].ave[k] = (sum[k] / arrGroup[i].length).toFixed(8);
            }
            // console.log('arrGroup',arrGroup[i]);
        }
        n++;
        console.log('arrGroup',arrGroup);
    }while(n<10);

    return arrGroup;

}

function kmeansSimilarity(arr1, arr2) {
    var ratio = null;
    var sum = null;
    for (var i = 0; i < arr1.length; i++) {
        sum += Math.pow(arr1[i] - arr2[i], 2);
    }
    ratio = Math.sqrt(sum);
    return ratio;
}


// $(document).ready(function () {
//     $.ajax({//hangzhou
//         type: 'GET',
//         url: 'http://127.0.0.1:8082/',
//         data: 'HangZhou',
//         dataType: 'json',
//         error: function () {
//             alert("Request failed.");
//         },
//         success: function (data) {
//             //alert("Request succeed.");
//             //data = JSON.parse(data);
//             // console.log(data);
//             var arr = [];
//             for (var i = 0; i < data.length; i++) {
//                 arr[i] = {};
//                 arr[i].arr = [];
//                 for (var x in data[i]) {
//                     if (x != 'CARDNO') {
//                         // console.log(data[x]);
//                         arr[i].arr.push(data[i][x]);
//                     } else {
//                         arr[i].cardno = data[i][x];
//                     }
//                 }
//             }
//             console.log(arr);
//             var result = kmeansGroup(5,arr);
//             console.log(result);
//         }
//
//     });
// });
