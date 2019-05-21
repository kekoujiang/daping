/**
 * @desc  需要jQuery layui 框架支持
 * @param null
 * @return
 * @author biyue
 * @date 2018/5/2 15:36
 */
function biYue() {
}
biYue.prototype = {
    ajax: function (obj) {  //封装好的带加载的ajax
        var index = layer.load(), _self = this;
        var timestamp = (new Date()).getTime();
        var status = obj.status || 1; //默认1为成功
        var ajaxObj = {
            url: (obj.url) || "",
            data: obj.data || "",
            type: obj.type || "post",
            dataType: 'json',
            complete: function (e) {
                layer.close(index);
                if (obj.complete) {
                    obj.complete();
                }
            },
            success: function (data) {
                if (data.status == status) {
                    if (obj.fun) {
                        obj.fun(data)
                    }
                } else {
                    layer.msg(data.msg, {icon: 2, anim: 6, time: 1500});
                }
            },
            error: function (data, status, e) {
                console.error('ε=(´ο｀*)))唉!请求错误:' + e);
            }
        };
        if (obj.contentType) {
            ajaxObj.contentType = obj.contentType
        }
        if (obj.form && obj.ele) {
            var form = $(obj.ele);
            form.ajaxSubmit(ajaxObj);
        } else {
            $.ajax(ajaxObj);
        }
    }
    , urlSearch: function () {  //提取路径后所带参数
        var search = window.location.search.replace("?", "").split("&");
        var searchObj = {};
        for (var i in search) {
            searchObj[search[i].split("=")[0]] = search[i].split("=")[1];
        }
        return searchObj;
    }
    , stopDefault: function (e) {  //阻止浏览器的默认行为
        if (e && e.preventDefault)
            e.preventDefault();
        //IE中阻止函数器默认动作的方式
        else
            window.event.returnValue = false;
        return false;
    }
    , stopBubble: function (e) {  //阻止事件冒泡,使成为捕获型事件触发机制.

        //如果提供了事件对象，则这是一个非IE浏览器
        if (e && e.stopPropagation)
        //因此它支持W3C的stopPropagation()方法
            e.stopPropagation();
        else
        //否则，我们需要使用IE的方式来取消事件冒泡
            window.event.cancelBubble = true;
    }
    , laypage: function (obj) {  //layui 分页
        if (layui) {
            var laypage = layui.laypage;
            laypage.render({
                elem: obj.elem || 'laypage'
                , curr: obj.curr || 1
                , limit: obj.limit || 10
                , count: obj.num || 0
                , theme: obj.color || '#20b8fd'
                , layout: ['count', 'prev', 'page', 'next', 'skip']
                , jump: function (data, first) {
                    if (obj.fun) {
                        obj.fun(data, first)
                    }
                }
            });
        }
    }
    , tableList: function (obj) {
        //导入模块
        var table = layui.table, _self = this;

        //设置表格高度
        function setTableH() {
            var cellH = 38;
            var tableH = $(".pop").height();
            var limit = Math.floor((tableH) / cellH - 3);
            return {
                tableH: tableH
                , limit: limit
            }
        }

        //渲染表格
        function loadTable(obj) {
            var timestamp = (new Date()).getTime();
            if (!obj.upData) {
                obj.upData = {}
            }
            table.render({
                id: obj.id || 'id'
                , elem: '#newsList'
                , url: (obj.url) || ""
                , method: obj.type || 'post'
                , where: obj.where
                , loading: true
                , page: { //详细参数可参考 laypage 组件文档
                    curr: 1
                    , limit: obj.limit || setTableH().limit
                    , groups: 10
                    , layout: ['prev', 'page', 'next', 'count', 'skip'] //自定义分页布局
                }
                , request: {
                    limitName: 'rowNum'
                }
                , response: {
                    statusCode: 1
                    , dataName: 'value'
                    , statusName: 'status'
                }
                , done: function (res, curr, count) {
                    obj.done&&obj.done(res, curr, count);
                }
                , height: obj.height || 'full-135'
                , cellMinWidth: 80
                , cols: obj.cols
            });
        }

        //搜搜
        function search(obj) {
            if (!obj) {
                obj = {}
            }
            //用于兼容ie
            if (obj.where) {
                obj.where.nowDate = new Date();
            } else {
                obj.where = {
                    nowDate: new Date()
                }
            }
            var pageNum;
            if (obj.pageBool === undefined) {
                obj.pageBool = false;
            }
            if (obj.pageBool) { //true则保持原有页面吗，false则回到1页；
                pageNum = parseInt($('#table-data .layui-laypage-curr em').eq(1).html());
            } else {
                pageNum = 1;
            }
            table.reload((obj.id||'id'), {
                where: obj.where
                , page: {
                    curr: pageNum //重新从第 1 页开始
                }
            });
        }

        var tableList = {
            loadTable: loadTable
            , search: search
        };
        return tableList;
    }
    , open: function (obj) {
        var title = obj.title,
            url = obj.url,
            area = obj.area;
        if (!title) {
            title = false;
        }
        if (!url) {
            url = "404.html";
        }
        var w, h;
        if (!area) {
            w = '780px';
            h = '500px';
        } else {
            w = area.w || '780px';
            h = area.h || '500px';
        }
        var index = layer.open({
            area: [w, h],
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            content:obj.content,
            success:obj.success,
            cancel:obj.cancel
        });
        return index
    }
    , verify: function () {
        var form = layui.form;
        form.verify({
            textarea: [
                /^.{0,500}$/m
                , '输入文字过长,请限制在500字以内!'
            ]
        });

        $("[lay-verify='required']").each(function () {
            $(this).parent().parent().find(".layui-form-label").prepend('<i class="req">*</i>');
        });
        $("[readonly]").click(function () {
            layer.msg('该项禁止修改！', {time: 1000, icon: 0})
        });
    }
    , photos: function (data, index) {
        //图片浏览
        layer.photos({
            /*"data": [   //相册包含的图片，数组格式
                {
                    "alt": "图片名",
                    "pid": 666, //图片id
                    "src": "", //原图地址
                    "thumb": "" //缩略图地址
                }
            ]*/
            photos: {
                "title": "集体照", //相册标题
                "id": "photos", //相册id
                "start": index, //初始显示的图片序号，默认0
                "data": data
            },
            closeBtn: 2,
            shift: "",
            anim: "",
            shade: [0.6, '#393D49'],
            maxHeight: 200
        });
    }
    , scroll: function (el) {
        $(el || "html").niceScroll({
            styler: "fb",
            cursorcolor: "rgba(115, 115, 115, 0.49)",
            cursorwidth: '5',
            cursorborderradius: '5px',
            iframeautoresize: true,
            background: '',
            autohidemode: false,
            spacebarenabled: false,
            cursorborder: '0',
            zindex: '1000'
        });
    }
};
window.biyue = new biYue();
biyue.urlData = biyue.urlSearch(); //由于使用路径参数比较多,所以在此,公有化
