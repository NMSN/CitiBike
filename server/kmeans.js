var Kmeans = {
    kmeansGroup: function (arrOrgin,groupNumber) {
        var arrOrgin = arrOrgin;
        // console.log(arrOrgin);
        var arrGroup = new Array(groupNumber);
        var ave = [];
        const HOUR = arrOrgin[0].arr.length;

        // console.log(HOUR);
        for (var i = 0; i < groupNumber; i++) {
            var index = Math.floor(Math.random() * arrOrgin.length);
            arrGroup[i] = [];
            arrGroup[i].push(arrOrgin[index]);
            // console.log(arrOrgin[index]);
        }

        for (var i = 0; i < arrOrgin.length; i++) {
            var mark = 0;
            var minSimilarity = 999999;
            for (var j = 0; j < arrGroup.length; j++) {
                var theSimilarity = this.kmeansSimilarity(arrGroup[j][0].arr, arrOrgin[i].arr);
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
            for (var k = 0; k < HOUR; k++) {
                sum[k] = 0;
            }
            for (var j = 0; j < arrGroup[i].length; j++) {
                for (var k = 0; k < HOUR; k++) {
                    sum[k] += arrGroup[i][j].arr[k];
                }
            }
            // arrGroup[i].ave = [];
            ave[i] = [];
            for (var k = 0; k < HOUR; k++) {
                ave[i][k] = (sum[k] / arrGroup[i].length).toFixed(2);
            }
        }
        // 初代kmeans聚类

        var n = 0;
        do {
            // 清空数组
            for (var i = 0; i < arrGroup.length; i++) {
                arrGroup[i].splice(0, arrGroup[i].length);
            }
            // console.log('length',ave[0].length);
            for (var i = 0; i < arrOrgin.length; i++) {
                var mark = 0;
                var minSimilarity = 999999;
                for (var j = 0; j < arrGroup.length; j++) {
                    var theSimilarity = this.kmeansSimilarity(ave[j], arrOrgin[i].arr);
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
                for (var k = 0; k < HOUR; k++) {
                    sum[k] = 0;
                }
                for (var j = 0; j < arrGroup[i].length; j++) {
                    for (var k = 0; k < HOUR; k++) {
                        sum[k] += arrGroup[i][j].arr[k];
                    }
                }
                // arrGroup[i].ave = [];
                ave[i] = [];
                for (var k = 0; k < HOUR; k++) {
                    // arrGroup[i].ave[k] = (sum[k] / arrGroup[i].length).toFixed(2);
                    ave[i][k] = (sum[k] / arrGroup[i].length).toFixed(2);
                }
            }
            n++;
            //console.log('arrGroup', arrGroup);
        } while (n < 100);
        // console.log('arrGroup',arrGroup);
        return {
            arrGroup: arrGroup,
            ave: ave
        }
        ;

    },

    kmeansSimilarity: function (arr1, arr2) {
        var ratio = null;
        var sum = null;
        for (var i = 0; i < arr1.length; i++) {
            sum += Math.pow(arr1[i] - arr2[i], 2);
        }
        ratio = Math.sqrt(sum);
        return ratio;
    }
};

module.exports = Kmeans;