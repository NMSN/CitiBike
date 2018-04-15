function aveKmeans(clustersK){
    var sum = [];//三维数组求最外层每组平均值
    var sumLength = [];//分组后每组数量
    for(var i = 0;i < clustersK.length; i++){
        var index = [];//每组总和
        for(var j=0;j<clustersK[i].length;j++){
            for(var k=0;k<clustersK[i][j].length;k++){
                if(index[k] != undefined) {
                    index[k] += clustersK[i][j][k];
                }else{
                    index[k] = 0;
                }
            }
        }
        index.forEach(function(element, index, array){
            array[index] = (element/clustersK[i].length).toFixed(2);
        })
        sum.push(index);
        sumLength.push(clustersK[i].length);
    }
    return {
        sum: sum,
        sumLength: sumLength
    };
}
exports.aveKmeans = aveKmeans;

// console.log(sum);