var Time = {
    arrTime: function () {//时间以真实时间来转化
        var starttime = document.getElementById('starttime').value;
        var endtime = document.getElementById('endtime').value;
        var arrtime = [];

        console.log(starttime);
        console.log(endtime);

        var start = starttime.replace(/-/g, "/");
        var end = endtime.replace(/-/g, "/");
        console.log(start);
        console.log(end);

        start = new Date(start);
        end = new Date(end);

        console.log(start);
        console.log(end);

        var num = Math.ceil((end - start) / (1000 * 3600 * 24)) + 1;

        console.log(num);

        var index = start;

        for (var i = 0; i < num; i++) {
            for (var j = 0; j < 24; j++) {
                var time = {
                    data: '',
                    hour: '',
                    week: ''
                };
                if (j < 10) {
                    time.data = index.getFullYear() + '-' + (index.getMonth() + 1) + '-' + index.getDate() + ' ' + index.getHours();
                    time.hour = index.getHours();
                } else {
                    time.data = index.getFullYear() + '-' + (index.getMonth() + 1) + '-' + index.getDate() + ' ' + index.getHours();
                    time.hour = index.getHours();
                }
                time.week = index.toString().slice(0, 3);
                arrtime.push(time);
                index.setHours(index.getHours() + 1);
            }
            index.setDate(index.getDate());
        }
        console.log(index);
        console.log(arrtime);
    }
};

$("#timePost").bind("click", function () {
    Time.arrTime();
});