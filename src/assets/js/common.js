var Ponitor = {
    hideCon: function() {
        $('#nv-content').hide();
        $('#navbar').css({
            background: '#F5F5F5'
        });
    },
    showCon: function() {
        $('#nv-content').show();
        $('#navbar').css({ background: 'white' });
    },
    fadeOut: function(selector, time) {
        if (!selector) return;
        if (time === undefined) time = 0;
        setTimeout(function() {
            $(selector).fadeOut();
        }, time);
    },
    //统计图
    createEchartsLine: function(echartsDiv, options) {
        if (!options) return;
        var data=options.data;
        if(data.length===0){
            data.push([]);
            options.series=data;
        }else{
            for (var i = 0; i < data.length; i++) {
                if(data[i][0]){
                    data[i][0]=new Date(data[i][0]);
                }else{
                    continue;
                }
            }
            options.series=[
                {
                    name: 'price',
                    type: 'line',
                    showAllSymbol: true,
                    data: data
                }
            ];
        }
        option = {
            title: {
                text: '价格浮动统计图',
                subtext: options.goodName
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    var date = new Date(params.value[0]);
                    data = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                    return data + '<br/>' + params.value[1];
                }
            },
            dataZoom: {
                show: true,
                start: 70
            },
            legend: {
                data: ['price']
            },
            grid: {
                y2: 80
            },
            xAxis: [{
                type: 'time',
                splitNumber: 10
            }],
            yAxis: [{
                type: 'value'
            }],
            series: options.series
        };

        var myChart = echarts.init($('#' + echartsDiv).get(0));
        myChart.setOption(option);

    }

};
