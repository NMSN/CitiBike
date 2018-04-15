var Diana = {
    dianaGroup: function (arrOrgin,groupNumber) {
        var arrOrgin = arrOrgin;
        // console.log(arrOrgin);
        // var arrGroup = new Array(groupNumber);
        var ave = [];
        var allArr =[];
        const HOUR = arrOrgin[0].arr.length;

        allArr.push(arrOrgin);
        //判断
        // console.log(arrOrgin.length);
        while(allArr.length < groupNumber){
            var indexArr = allArr.shift();
            var marki = 0;
            var markj = 0;
            var maxSimilarity = 0;
            for (var i = 0; i < indexArr.length; i++) {
                for (var j = i; j < indexArr.length; j++) {
                    var theSimilarity = this.dianaSimilarity(indexArr[j].arr, indexArr[i].arr);
                    if (theSimilarity > maxSimilarity) {
                        maxSimilarity = theSimilarity;
                        marki = i;
                        markj = j;
                        // console.log(i,j);
                    }
                }
            }
            var arr1 = [];
            arr1.push(indexArr[marki]);
            var arr2 = [];
            arr2.push(indexArr[markj]);
            // console.log('indexArr.length',indexArr.length);
            indexArr = indexArr.filter(function(item){
                return item != indexArr[marki] && item != indexArr[markj];
            }) ;
            // console.log('indexArr.length',indexArr.length);
            for(var i = 0; i < indexArr.length; i++){
                var index1 = this.dianaSimilarity(indexArr[i].arr,arr1[0].arr);
                var index2 = this.dianaSimilarity(indexArr[i].arr,arr2[0].arr);
                // console.log('index1',index1);
                // console.log('index2',index2);
                if(index1 < index2){
                    arr1.push(indexArr[i]);
                    // console.log(1);
                }else{
                    arr2.push(indexArr[i]);
                    // console.log(2);
                }
            }
            // console.log('arr1.length',arr1.length);
            // console.log('arr2.length',arr2.length);
            allArr.push(arr1,arr2);
            allArr.sort(function(a,b){
               return b.length - a.length;
            });

        }

        for (var i = 0; i < allArr.length; i++) {
            var sum = [];
            // 初始化sum数组
            for (var k = 0; k < HOUR; k++) {
                sum[k] = 0;
            }
            for (var j = 0; j < allArr[i].length; j++) {
                for (var k = 0; k < HOUR; k++) {
                    sum[k] += allArr[i][j].arr[k];
                }
            }
            // arrGroup[i].ave = [];
            ave[i] = [];
            for (var k = 0; k < HOUR; k++) {
                // arrGroup[i].ave[k] = (sum[k] / arrGroup[i].length).toFixed(2);
                ave[i][k] = (sum[k] / allArr[i].length).toFixed(2);
            }
        }

        return {
            arrGroup: allArr,
            ave: ave
        }
        ;

    },

    dianaSimilarity: function (arr1, arr2) {
        var ratio = null;
        var sum = null;
        for (var i = 0; i < arr1.length; i++) {
            sum += Math.pow(arr1[i] - arr2[i], 2);
        }
        ratio = Math.sqrt(sum);
        return ratio;
    }
};
module.exports = Diana;