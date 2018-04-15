function hier(clustersH,layer){
    var queue = [];//遍历的队列
    var nodes = [];//结果集
    var cache = [];//暂存数组
    var index = 1;//索引值
    var sum = [];

    queue.push(clustersH);

    //第二版 追求类似kmeans的效果，没有层级
    while(index < layer){
        while(queue.length > 0) {
            var node = queue.shift();//node为遍历节点
            // console.log(node);

            if (node.size == 1) {
                nodes.push(node);
            } else{
                if (node.left) {
                    cache.push(node.left);
                }
                if (node.right) {
                    cache.push(node.right);
                }
            }
        }
        queue = JSON.parse(JSON.stringify(cache));
        cache.length = 0;
        index++;
    }

    queue.forEach(function(index){
        nodes.push(index);
    });
    // console.log(nodes);
    var aveHierLength = nodes.map(function(item){
       return item.size;
    });
    var aveHier = nodes.map(function(item){
        return average(item);
    });

    console.log(aveHier);
    return {
        aveHier: aveHier,
        length: nodes.length,
        aveHierLength: aveHierLength
    }


    function average(node){
        sum = [];
        // console.log(node);
        sumUp(node);
        var ave = sum.map(function(index){
            return (index/node.size).toFixed(2);
        })
        // console.log(sum);
        // console.log(ave);
        return ave;
    }


    function sumUp(node){
        if(node.size == 1){
            for(var i=0; i < node.value.length; i++){
                sum[i] = ( sum[i] || 0 ) + node.value[i];//不用初始化数组为0
            }
        }else{
            if(node.left){
                arguments.callee(node.left);
            }
            if(node.right){
                arguments.callee(node.right);
            }
        }
    }

}
exports.analyzeHier = hier;