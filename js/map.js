var mapData = {
    getData:function () {
        var _self = this;
        biyue.ajax({
            url:'/user/getUserInfo',
            fun:function (data) {
                if (data.value) {
                    var dataV = data.value.projectList;
                    _self.setMap(dataV);
                }
            }
        })
    },
    setMap:function (data) {
        var data_info = data;
        var opts = {
            width: 450,     // 信息窗口宽度
            height: 250,     // 信息窗口高度
            enableMessage: true//设置允许信息窗发送短息
        };
        // 定义自定义覆盖物的构造函数
        function SquareOverlay(center, length, color){
            this._center = center;
            this._length = length;
            this._color = color;
        }
        // 继承API的BMap.Overlay
        SquareOverlay.prototype = new BMap.Overlay();
        // 实现初始化方法
        SquareOverlay.prototype.initialize = function(map){
            // 保存map对象实例
            this._map = map;
            // 创建div元素，作为自定义覆盖物的容器
            var div = document.createElement("div");
            div.style.position = "absolute";
            // 可以根据参数设置元素外观
            div.style.width = this._length + "px";
            div.style.height = this._length + "px";
            console.log($(div).html('<div class="round r1"></div>\n' +
                '        <div class="round r2"></div>\n' +
                '        <div class="round r3"></div>')[0]);
            // 将div添加到覆盖物容器中
            map.getPanes().markerPane.appendChild(div);
            // 保存div实例
            this._div = div;
            // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
            // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
            return div;
        }
        // 实现绘制方法
        SquareOverlay.prototype.draw = function(){
            // 根据地理坐标转换为像素坐标，并设置给容器
            var position = this._map.pointToOverlayPixel(this._center);
            this._div.style.left = position.x - this._length / 2 + "px";
            this._div.style.top = position.y - this._length / 2 + "px";
        }
        alert(1);
        map = new BMap.Map("map", {
            enableMapClick : false
        });   //创建一个地图实例，HTML容器包含地图
        var point = new BMap.Point(top.biyueDataA.lng? top.biyueDataA.lng : 114.28569, top.biyueDataA.lat ? top.biyueDataA.lat : 30.60738);
        map.centerAndZoom(point, 12);
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
        markInit(data_info);

        // 添加标注
        function addMarker(point, img_path) {
            if (img_path != null) {
                var myIcon = new BMap.Icon(img_path,
                    new BMap.Size(31, 35), {
                        offset: new BMap.Size(15, 25)
                    });
                var marker = new BMap.Marker(point, {icon: myIcon});
            } else {
                var marker = new BMap.Marker(point);
            }
            var mySquare = new SquareOverlay(point, 100, "red");
            console.log(mySquare)
            map.addOverlay(mySquare);
          //  map.addOverlay(marker);
            return mySquare;
        }

        function customOverlay(point) {
            this.point = point
        }



        function markInit(data_info) {
            for (var i = 0; i < data_info.length; i++) {
                data_info[i].projectName = my_filter(data_info[i].projectName);
                data_info[i].constructionPeriod = my_filter(data_info[i].constructionPeriod);
                data_info[i].startTime = my_filter(data_info[i].startTime);
                data_info[i].endTime = my_filter(data_info[i].endTime);
                data_info[i].owner = my_filter(data_info[i].owner);
                data_info[i].supplier = my_filter(data_info[i].supplier);
                data_info[i].subcontractor = my_filter(data_info[i].subcontractor);

                var $mes = '<ul id="marker" data-projectId="'+data_info[i].projectId+'" data-projectName="'+data_info[i].projectName+'" data-lng="'+data_info[i].lng+'" data-lat="'+data_info[i].lat+'">\n' +
                    '        <li><label>项目名称:</label><span>' + data_info[i].name + '</span></li>\n'
                    '    </ul>';
                data_info[i].iconPath = data_info[i].iconPath || null;
                var marker = addMarker(new BMap.Point(data_info[i].lng, data_info[i].lat), data_info[i].iconPath);  // 创建标注

                var content = $mes;
                addClickHandler(content, marker);
            }
        }


        function my_filter(t) {
            if (t == null || t == undefined) {
                return ""
            } else {
                return t
            }
        }

        function addClickHandler(content, marker) {

        }
    }
};