var indexPage={
    //地图点位数据
    getMapData:function () {
        var _self = this;
        biyue.ajax({
            url:'./json/map.json',
            fun:function (data) {
                if (data.value) {
                    var dataV = data.value;
                    _self.setMap(dataV);
                }
            }
        })
    },
    //地图配置
    setMap:function (data) {
        var data_info = data;
        // 定义自定义覆盖物的构造函数
        function SquareOverlay(center, length, id){
            this._center = center;
            this._length = length;
            this._id = id;
        }
        // 继承API的BMap.Overlay
        SquareOverlay.prototype = new BMap.Overlay();
        // 实现初始化方法
        SquareOverlay.prototype.initialize = function(map){
            // 保存map对象实例
            this._map = map;
            // 创建div元素，作为自定义覆盖物的容器
            var div = document.createElement("div"),id=this._id;
            div.style.position = "absolute";
            // 可以根据参数设置元素外观
            div.style.width = this._length + "px";
            div.style.height = this._length + "px";

            map.getPanes().markerPane.appendChild($(div).addClass("mapMarker").html('<i class="vr" data-id="'+id+'"></i>\n' +
                '    <div class="vr_wrap"></div>\n' +
                '    <div class="vr_wrap2"></div>')[0]);
            this._div = div;
            return div;
        };
        // 实现绘制方法
        SquareOverlay.prototype.draw = function(){
            // 根据地理坐标转换为像素坐标，并设置给容器
            var position = this._map.pointToOverlayPixel(this._center);
            this._div.style.left = position.x - this._length / 2 + "px";
            this._div.style.top = position.y - this._length / 2 + "px";
        }
        //初始化map元素
        map = new BMap.Map("map", {
            enableMapClick : false
        });
        //定义地图中心点
        var point = new BMap.Point(112.232871,30.340344);
        map.centerAndZoom(point, 14);
        map.enableScrollWheelZoom();
        map.setMapStyle({
            styleJson:[
                {
                    "featureType": "land",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#212121"
                    }
                },
                {
                    "featureType": "building",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#2b2b2b"
                    }
                },
                {
                    "featureType": "highway",
                    "elementType": "all",
                    "stylers": {
                        "lightness": -42,
                        "saturation": -91
                    }
                },
                {
                    "featureType": "arterial",
                    "elementType": "geometry",
                    "stylers": {
                        "lightness": -77,
                        "saturation": -94
                    }
                },
                {
                    "featureType": "green",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#1b1b1b"
                    }
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#181818"
                    }
                },
                {
                    "featureType": "subway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#181818"
                    }
                },
                {
                    "featureType": "railway",
                    "elementType": "geometry",
                    "stylers": {
                        "lightness": -52
                    }
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#313131"
                    }
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#8b8787"
                    }
                },
                {
                    "featureType": "manmade",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#1b1b1b"
                    }
                },
                {
                    "featureType": "local",
                    "elementType": "geometry",
                    "stylers": {
                        "lightness": -75,
                        "saturation": -91
                    }
                },
                {
                    "featureType": "subway",
                    "elementType": "geometry",
                    "stylers": {
                        "lightness": -65
                    }
                },
                {
                    "featureType": "railway",
                    "elementType": "all",
                    "stylers": {
                        "lightness": -40
                    }
                },
                {
                    "featureType": "city",
                    "elementType": "labels.icon",
                    "stylers": {
                        "color": "#000000ff",
                        "hue": "#000000",
                        "weight": "1",
                        "lightness": 32
                    }
                }
            ]
        });
        //循环加载标注
        ;(function (){
            for (var i = 0; i < data_info.length; i++) {
                var marker = addMarker(new BMap.Point(data_info[i].lng, data_info[i].lat), data_info[i].id);  // 创建标注
            }
        })();
        // 添加标注
        function addMarker(point, id) {
            var mySquare = new SquareOverlay(point, 100, id);
            map.addOverlay(mySquare);
            return mySquare;
        }
    },
    //时间定时器
    time:function () {
        function getCurrentDate() {
            var now = new Date();
            var year = now.getFullYear(); //得到年份
            var month = now.getMonth();//得到月份
            var date = now.getDate();//得到日期
            var day = now.getDay();//得到周几
            var hour = now.getHours();//得到小时
            var minu = now.getMinutes();//得到分钟
            var sec = now.getSeconds();//得到秒
            var tmpArr = new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
            month = month + 1;
            if (month < 10) month = "0" + month;
            if (date < 10) date = "0" + date;
            if (hour < 10) hour = "0" + hour;
            if (minu < 10) minu = "0" + minu;
            if (sec < 10) sec = "0" + sec;
            var time = "";
            day= tmpArr[day];
            time = year + "-" + month + "-" + date+ " " + hour + ":" + minu + ":" + sec+' <label>'+day+'</label>';
            $(".time span").html(time);
        }
        getCurrentDate();
        setInterval(function () {
            getCurrentDate();
        },1000)
    },
    //右边弹窗相关操作
    rightPop:function () {
        $(".rightPopBox").on("click",".open",function () {
            $(".rightPopBox").css("right",0);
            $(this).removeClass("open").addClass("close");
        }).on("click",".close",function () {
            $(".rightPopBox").css("right","-400px");
            $(this).removeClass("close").addClass("open");
        })
    },
    //点击地图弹出的新闻列表
    pop:function () {
        var table = biyue.tableList();
        var height = $(".pop").height() - 56;
        //第一个实例
        table.loadTable({
            url: './json/list.json'
            ,cols: [[
                {type:'numbers', title: '序号', width:80}
                ,{field: 'title', title: '标题',align:'center', width:370 }
                ,{field: 'time', title: '时间', width:160 ,align:'center'}
                ,{field: 'site', title: '地点',align:'center'}
                ,{field: 'person', title: '采访人', width: 200,align:'center'}
                ,{field: 'status', title: '状态', width: 120 ,align:'center', templet: '#status'}
            ]]
            ,height:height+"px"
            ,limit:11
        });
    },
    //获取详请信息
    getView:function (id) {
        var _self = this;
        biyue.ajax({
            url:'./json/view.json',
            data:{
                id:id
            },
            fun:function (data) {
                if (data.value) {
                    var dataV = data.value;
                    if(dataV){
                        $(".title h2").html(dataV.title);
                        $(".viewTime label").html(dataV.time);
                        $(".viewPerson label").html(dataV.person);
                        $(".viewLocation label").html(dataV.site);
                        $(".viewBox .content img").attr("src",dataV.img);
                        $(".viewBox .content p").html(dataV.content);
                    }
                }
            }
        })
    },
    //echarts地图
    echarts:function(){
        $.get('js/common/421000.json', function (map){//   resource/
            echarts.registerMap('jingzhou',map);
            var chart = echarts.init(document.getElementById('echartsMap'));
            var option={
                tooltip:{
                    textStyle:{
                        color:'#fff',
                        fontSize:25
                    }
                },
                visualMap: {
                    min: 0,
                    max: 200,
                    text:['High','Low'],
                    realtime: false,
                    calculable: true,
                    show:false,
                    inRange: {
                        color: ['lightskyblue','yellow', 'orangered']
                    }
                },
                series: [{
                    name:"荆州",
                    type: 'map',
                    map: 'jingzhou',
                    zoom:1.2,
                    label:{
                        normal:{
                            show:true,
                            textStyle:{color:"#434343", fontSize:20}
                        },
                        emphasis:{textStyle:{color:"#434343",fontSize:20}}
                    },
                    itemStyle:{
                        normal:{
                            label:{
                                show:true,
                                textStyle:{fontSize:20}
                            }
                        },
                        emphasis:{label:{show:true,textStyle:{fontSize:20}}}
                    },
                    data: [
                        {name: '松滋市', value:99.95,id:1},
                        {name: '荆州区', value:29.95,id:2},
                        {name: '沙市区', value:92.95,id:3},
                        {name: '公安县', value:39.95,id:4},
                        {name: '江陵县', value:49.95,id:5},
                        {name: '石首市', value:59.95,id:6},
                        {name: '监利县', value:92.95,id:7},
                        {name: '洪湖市', value:39.95,id:8}
                    ]
                }]
            };
            chart.setOption(option);
            window.onresize = chart.resize;
            var pieOne = echarts.init(document.getElementById('pieOne'));
            pieOne.setOption({
                color: ['#3c13a8', '#4d59e6', '#5c63c5', '#0472d9', '#42947f', '#4eb2d4', '#ff47a2', '#d44dba'],
                series: [
                    {
                        type:'pie',
                        selectedMode: 'single',
                        selectedOffset: 20,
                        radius: ['35%', '55%'],
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize:18,
                                    color: '#ade3ff'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {name: '松滋市', value:99.95,id:1},
                            {name: '荆州区', value:29.95,id:2},
                            {name: '沙市区', value:92.95,id:3},
                            {name: '公安县', value:39.95,id:4},
                            {name: '江陵县', value:49.95,id:5},
                            {name: '石首市', value:59.95,id:6},
                            {name: '监利县', value:92.95,id:7},
                            {name: '洪湖市', value:39.95,id:8}
                        ]
                    }
                ]
            });
            var pieTwo = echarts.init(document.getElementById('pieTwo'));
            pieTwo.setOption({
                color: ['#ffa800', '#97e600', '#00a6ff', '#0087ff', '#97e600', '#4eb2d4', '#6a82ff', '#451741'],
                series: [
                    {
                        type:'pie',
                        selectedMode: 'single',
                        selectedOffset: 20,
                        radius: ['35%', '55%'],
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize:18,
                                    color: '#ade3ff'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {name: '松滋市', value:99.95,id:1},
                            {name: '荆州区', value:29.95,id:2},
                            {name: '沙市区', value:92.95,id:3},
                            {name: '公安县', value:39.95,id:4},
                            {name: '江陵县', value:49.95,id:5},
                            {name: '石首市', value:59.95,id:6},
                            {name: '监利县', value:92.95,id:7},
                            {name: '洪湖市', value:39.95,id:8}
                        ]
                    }
                ]
            });
            //统计图联动
            echarts.connect([chart, pieOne, pieTwo]);
            chart.on('click', function (params) {
                pieOne.dispatchAction({
                    type: 'pieSelect',
                    name: params.name
                })
            });
        });
    },
    //默认执行时间
    init:function () {
        var _self = this;
        //点击地图,弹出新闻列表
        $(".body-box").on("click",".vr",function () {
            var id = $(this).attr("data-id");
            var index = biyue.open({
                content:$(".popBox"),
                area:{
                    w:"1200px",
                    h:"700px"
                },
                success:function () {
                    _self.pop();
                }
                ,cancel:function () {
                    $(".popBox").hide();
                }
            })
            $(".popBox .close").click(function () {
                layer.close(index);
            })
        })
        //双击列表弹出详请
        layui.table.on('row(test)', function(obj){
            var id = obj.data.id;
            var index = biyue.open({
                content:$(".viewBox"),
                area:{
                    w:"1200px",
                    h:"700px"
                },
                success:function () {
                    _self.getView(id);
                }
                ,cancel:function () {

                }
            })
            $(".viewBox .close").click(function () {
                layer.close(index);
                $(".title h2").html("--");
                $(".viewTime label").html("0000-00-00 00:00:00");
                $(".viewPerson label").html("--");
                $(".viewLocation label").html("--");
                $(".viewBox .content img").attr("src","");
                $(".viewBox .content p").html("");
                $(".viewBox").hide();
            })
        });

    }
};