
mainApp.controller("deviceListCtrl",["$scope","$resource",function ($scope,$resource) {
    $scope.deviceInfo;//用于记录当前选中的设备
    var parentName;//用于记录父设备名称
    var preDeviceIdArr = [];//用于记录设备列表展示时向前翻页
    var preDeviceNameArr = [];//用于设备列表展示时向前翻页
    var preDeviceId;//用于设备列表展示时向前翻页
    var preDeviceName;//用于设备列表展示时向前翻页
    var nextDeviceId;//用于设备列表展示时向后翻页
    var nextDeviceName;//用于设备列表展示时向后翻页
    var pageNum = 1;//用于记录当前页号
    /*设备列表信息获取与展示*/

    /*返回值为所有设备信息*/
    var obj = $resource("/api/device/alldevices?limit=1000");
    $scope.deviceListAll = obj.query();

   /*返回值为限制个数的所有设备信息*/
    $.ajax({
        url:"/api/device/alldevices?limit=9",
        contentType: "application/json; charset=utf-8",
        async: false,
        type:"GET",
        success:function(msg) {
            $scope.deviceList = msg;
            var last = $scope.deviceList.length - 1;
            console.log($scope.deviceList);
            console.log($scope.deviceList.length);
            nextDeviceId = $scope.deviceList[last].id;
            nextDeviceName = $scope.deviceList[last].name;
            preDeviceIdArr.push($scope.deviceList[last].id);
            preDeviceNameArr.push($scope.deviceList[last].name);
        }
    });

    /*鼠标移入动画效果*/
    $scope.fadeSiblings = function () {
        $(".chooseBtn").mouseover(function () {
            $(this).siblings().stop().fadeTo(300, 0.3);
        });
    };
    /*鼠标移出动画效果*/
    $scope.reSiblings = function () {
        $(".chooseBtn").mouseout(function () {
            $(this).siblings().stop().fadeTo(300, 1);
        });
    };
    /*在右侧表格中显示各个设备的信息*/
    $scope.show = function (data) {
        /*除点击元素外其他元素均无特殊样式*/
        var offset = $('#deviceListChart').offset().top-190;
        console.log(offset);
        $('html, body').animate({scrollTop:offset}, 1000);
        $scope.deviceList.forEach(function (items) {
            if(data != items) items.style = {}
        });
        /*给点击元素加上特定样式*/
        data.style = {"border": "2px solid #305680"};

        //如果父设备ID为undefined，直接显示null
        if(data.parentDeviceId == null || data.parentDeviceId =="undefined" || data.parentDeviceId == ""){
            parentName = "";
        }
        else{
            //通过父设备ID获取父设备名称
            $.ajax({
                url:"/api/device/name/"+data.parentDeviceId,
                contentType: "application/json; charset=utf-8",
                async: false,
                type:"GET",
                success:function(msg) {
                    parentName = msg;
                },
                error:function (err) {
                    parentName = "";
                }
            });
        }
        /*
       //angularjs会将string类型变量解析成object
       var parentNameObj = $resource("/api/device/name/:parentId");
        $scope.parentName = parentNameObj.get({parentId:data.parentDeviceId});
        */
        $scope.deviceInfo = data;
        console.log(data);
        $scope.ID = data.id;
        $scope.deviceName = data.name;
        $scope.deviceType = data.deviceType;
        $scope.location = data.location;
        $scope.manufacture = data.manufacture;
        $scope.status = data.status;
        $scope.parentName = parentName;//父设备名
        $scope.model = data.model;
    };

    var showNum = 9;//用于记录每次显示多少个设备
    /*选择每页显示多少设备*/
    $scope.deviceListNumChoose = function () {
        if($("#deviceListNum").val() == ""){
            showNum = 9;
        }else{
            showNum = $("#deviceListNum").val();
        }
        // console.log(showNum);
        $.ajax({
            url:"/api/device/alldevices?limit="+showNum,
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(msg) {
                $scope.deviceList = msg;
                var last = $scope.deviceList.length - 1;
                console.log($scope.deviceList);
                console.log($scope.deviceList.length);
                nextDeviceId = $scope.deviceList[last].id;
                nextDeviceName = $scope.deviceList[last].name;
                preDeviceIdArr.push($scope.deviceList[last].id);
                preDeviceNameArr.push($scope.deviceList[last].name);
            }
        });
    };

    /*查看下一页设备*/
    $scope.nextDeviceInfo = function () {
        console.log(nextDeviceId);
        console.log(nextDeviceName);
        $.ajax({
            url:"/api/device/alldevices?limit="+showNum+"&idOffset="+nextDeviceId+"&textOffset="+nextDeviceName,
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(msg) {


                if(msg == ""){
                    toastr.warning("当前已是最后一页！");
                }
                else{
                    pageNum++;
                    $scope.deviceList = msg;
                    var last = $scope.deviceList.length - 1;
                    console.log($scope.deviceList);
                    nextDeviceId = $scope.deviceList[last].id;
                    nextDeviceName = $scope.deviceList[last].name;
                    preDeviceIdArr.push($scope.deviceList[last].id);
                    preDeviceNameArr.push($scope.deviceList[last].name);
                }


            },
            error:function (err) {
                toastr.warning("当前已是最后一页！");
            }
         });
    };

    /*查看上一页设备*/
    $scope.preDeviceInfo = function () {
        var url;
        if(pageNum == 1){/*pageNum == 1的时候不发送ajax请求*/
            toastr.warning("当前已是第一页！");
        }
        else{
            if(pageNum == 2){
                url = "/api/device/alldevices?limit="+showNum;
            }else{
                preDeviceId = preDeviceIdArr[pageNum-3];
                preDeviceName = preDeviceNameArr[pageNum - 3];
                url = "/api/device/alldevices?limit="+showNum+"&idOffset="+preDeviceId+"&textOffset="+preDeviceName;
            }
            $.ajax({
                url:url,
                contentType: "application/json; charset=utf-8",
                async: false,
                type:"GET",
                success:function(msg) {
                    pageNum--;
                    $scope.deviceList = msg;
                    var last = $scope.deviceList.length - 1;
                    console.log($scope.deviceList);
                    nextDeviceId = $scope.deviceList[last].id;
                    nextDeviceName = $scope.deviceList[last].name;
                }
            });
        }
    };






    /*删除设备*/
    var deleteDeviceObj = $resource("/api/device/delete/:deviceId");
    $scope.delete = function(){
        //console.log($scope.deviceInfo);
        //console.log($scope.deviceInfo.id);
        $scope.deleteDevice = deleteDeviceObj.delete({deviceId:$scope.deviceInfo.id},{},function (resp) {
            toastr.success("删除设备成功！");
            setTimeout(function () {
                window.location.reload();
            },1000);

        },function (error) {
            toastr.error("删除设备失败！");
        });
    };

    /*查看令牌*/

    var tokenObj = $resource("/api/device/token/:deviceId");
    $scope.showToken = function (){
        $scope.tokenJson = tokenObj.get({deviceId:$scope.deviceInfo.id})
            .$promise.then(function (value) {
                $scope.token = value.deviceToken;
                //console.log($scope.token);
            });
    };



    /*分配设备*/
    var deviceGroupObj = $resource("/api/group/allgroups?limit=300");
    var deviceGroupAssignObj = $resource("/api/group/assign/:deviceId/:groupId");
    $scope.deviceGroup = deviceGroupObj.query();
    $scope.assignDeviceGroup = function(){
        var groupId = $("#deviceGroupSelect option:selected").attr("id");
        //console.log("groupId:"+groupId);
        //console.log("deviceInfo:"+$scope.deviceInfo.id);
        $scope.deviceGroupAssign = deviceGroupAssignObj.get({deviceId:$scope.deviceInfo.id,groupId:groupId},
            function (resp) {
            toastr.success("设备分配成功！");
            },function (err) {
            toastr.error("设备分配失败！");
        });
    };








    /*所有厂商*/
    var manufacturerObj = $resource("/api/v1/abilityGroup/manufacturers");
    $scope.manufacturerInfo = manufacturerObj.query();

    var manufacturerId;//用于记录厂商id
    var deviceTypeId;//用于记录设备类型id
    var deviceModelId;//用于记录设备型号id



    /* =============================================================
       更新设备
     ============================================================ */
    /*获取厂商*/

    /*设置初始信息*/
    $scope.setValue = function (){
        //设置父类设备初始信息
        //console.log("父类设备名称："+parentName);
        $("#reParentId option").each(function () {
            if($(this).val() == parentName){
                $(this).attr("selected",true);
            }
        });


        /*设置厂商初始信息*/
        $("#reManufacture option").each(function () {
            if($(this).val() == $scope.deviceInfo.manufacture){
                $(this).attr("selected",true);
            }
        });


        /*设置设备类型初始信息*/
        $("#reDeviceType").prepend("<option class='select'>"+$scope.deviceInfo.deviceType+"</option>");
        $("#reDeviceType .select").attr("selected",true);

        /*设置型号初始信息*/
        $("#reModel").prepend("<option class='select'>"+$scope.deviceInfo.model+"</option>");
        $("#reModel .select").attr("selected",true);

        /*设置位置初始信息*/
        $("#reLocation").val($scope.deviceInfo.location);
        /*设置状态初始信息*/
        $("#reStatus").val($scope.deviceInfo.status);

    };









    $scope.getManufacture = function () {
        manufacturerId = $("#reManufacture option:selected").attr("class");
        //console.log("厂商："+manufacturerId);
        $("#reDeviceType option").remove();
        $("#reModel option").remove();
          /*根据厂商查询设备类型*/
        //console.log("/api/v1/abilityGroup/deviceTypes?manufacturerId="+manufacturerId);
        var deviceTypeObj = $resource("/api/v1/abilityGroup/deviceTypes?manufacturerId="+manufacturerId);
        $scope.deviceTypeInfo = deviceTypeObj.query();


        $scope.getDeviceType = function () {
            deviceTypeId = $("#reDeviceType option:selected").attr("class");
            console.log("设备类型："+deviceTypeId);


            /*根据厂商和设备类型查询设备型号*/
            console.log("/api/v1/abilityGroup/models?manufacturerId="+manufacturerId+"&deviceTypeId="+deviceTypeId);
            var deviceModelObj = $resource("/api/v1/abilityGroup/models?manufacturerId="+manufacturerId+"&deviceTypeId="+deviceTypeId);
            $scope.deviceModelInfo = deviceModelObj.query();

            $scope.getDeviceModel = function () {
                deviceModelId = $("#reModel option:selected").attr("class");
                console.log("设备型号:"+deviceModelId);
            };
        };
    };


    /*更新设备*/
    // var refreshDeviceObj = $resource("/api/device/updatedevice");
    $scope.refreshDevice = function () {
        $scope.reName = $("#reName").val();
        $scope.reParent = $("#reParentId option:selected").attr("class");
        $scope.reDeviceType = $("#reDeviceType").val();
        $scope.reManufacture = $("#reManufacture").val();
        $scope.reModel = $("#reModel").val();
        $scope.reLocation = $("#reLocation").val();
        $scope.reStatus = $("#reStatus").val();
        $scope.refreshDeviceInfo = '{"name":'+'"'+$scope.reName+'"'+',"Id":'+'"'+$scope.deviceInfo.id+'"'+',"parentDeviceId":'+'"'+$scope.reParent+'"'+',"deviceType":'+'"'+$scope.reDeviceType+'"'+',"manufacture":'+'"'+$scope.reManufacture+'"'+',"model":'+'"'+$scope.reModel+'"'+',"location":'+'"'+$scope.reLocation+'"'+',"status":'+'"'+$scope.reStatus+'"'+'}';
        //字符串类型的数据发送给后台是会自动加上引号
        //console.log($scope.refreshDeviceInfo);
        /*$scope.refreshDeviceInformation = refreshDeviceObj.save({},$scope.refreshDeviceInfo,function (resp) {
            toastr.success("更新设备成功！");
            setTimeout(function () {
                window.location.reload();
            },1000);
        },function (error) {
            toastr.error("更新设备失败！");
        });*/
        $.ajax({
            url:"/api/device/updatedevice",
            data:$scope.refreshDeviceInfo,
            contentType: "application/json; charset=utf-8",//post请求必须
            dataType:"text",
            type:"POST",
            success:function(msg){
                toastr.success("更新设备成功！");
                setTimeout(function () {
                    window.location.reload();
                },1000);
            },
            error:function (err) {
                toastr.error("更新设备失败！");
            }
        });
    };
    /* =============================================================
             更新设备End
        ============================================================ */






    /* =============================================================
          创建设备
        ============================================================ */
    $scope.getCreateManufacture = function () {
        manufacturerId = $("#manufacture option:selected").attr("class");
        console.log("厂商："+manufacturerId);


        /*根据厂商查询设备类型*/
        console.log("/api/v1/abilityGroup/deviceTypes?manufacturerId="+manufacturerId);
        var deviceTypeObj = $resource("/api/v1/abilityGroup/deviceTypes?manufacturerId="+manufacturerId);
        $scope.deviceTypeInfo = deviceTypeObj.query();


        $scope.getCreateDeviceType = function () {
            deviceTypeId = $("#deviceType option:selected").attr("class");
            console.log("设备类型："+deviceTypeId);


            /*根据厂商和设备类型查询设备型号*/
            console.log("/api/v1/abilityGroup/models?manufacturerId="+manufacturerId+"&deviceTypeId="+deviceTypeId);
            var deviceModelObj = $resource("/api/v1/abilityGroup/models?manufacturerId="+manufacturerId+"&deviceTypeId="+deviceTypeId);
            $scope.deviceModelInfo = deviceModelObj.query();

            $scope.getCreateDeviceModel = function () {
                deviceModelId = $("#model option:selected").attr("class");
                console.log("设备型号:"+deviceModelId);
            };
        };
    };

    /*创建设备*/
    // var createDeviceObj =  $resource("/api/device/create");
    $scope.createDevice = function(){
        if($("#name").val()){
            $scope.name = $("#name").val();
            $scope.parent = $("#parentId option:selected").attr("class");
            if($("#manufacture").val() == "? undefined:undefined ?"){
                $scope.manufacture = "";
            }else{
                $scope.manufacture = $("#manufacture").val();
            }
            if($("#deviceType").val() == "? undefined:undefined ?"){
                $scope.deviceType = "";
            }else{
                $scope.deviceType = $("#deviceType").val();
            }
            if($("#model").val() == "? undefined:undefined ?"){
                $scope.model = "";
            }else{
                $scope.model = $("#model").val();
            }
            $scope.location = $("#location").val();
            $scope.status = $("#status").val();
            $scope.createDeviceInfo = '{"name":'+'"'+$scope.name+'"'+',"parentDeviceId":'+'"'+$scope.parent+'"'+',"deviceType":'+'"'+$scope.deviceType+'"'+',"manufacture":'+'"'+$scope.manufacture+'"'+',"model":'+'"'+$scope.model+'"'+',"location":'+'"'+$scope.location+'"'+',"status":'+'"'+$scope.status+'"'+'}';
            //字符串类型的数据发送给后台是会自动加上引号
            console.log($scope.createDeviceInfo);
            /*$scope.deviceInformation = createDeviceObj.save({},$scope.createDeviceInfo,function (resp) {
                window.location.reload();
            },function (error) {
                toastr.error("新增设备失败！");
            });*/
            $.ajax({
                url:"/api/device/create",
                data:$scope.createDeviceInfo,
                contentType: "application/json; charset=utf-8",//post请求必须
                dataType:"text",
                type:"POST",
                success:function(msg){
                   // console.log(msg);
                   var msgJson = JSON.parse(msg);
                   // console.log(msgJson.id);
                   if(msgJson.id == ""){
                       toastr.warning("不允许创建同名设备！");
                   }else{
                       window.location.reload();
                   }

                },
                error:function (err) {
                    toastr.error("新增设备失败！");
                }
            });
        }
        else{
            /*增加提示效果*/
            $("#name").addClass("input-err");
            $("#modalConfirm").removeAttr("data-dismiss");
            $('#name').on('focus', function() {
                $(this).removeClass('input-err');
            });
        }

    };
    /* =============================================================
         创建设备End
       ============================================================ */



/*搜索设备*/
$scope.searchDevice = function () {
    var textSearch = $("#searchDeviceText").val();
    var searchDeviceObj = $resource("/api/device/alldevices?limit=20&textSearch="+textSearch);
    $scope.searchDeviceInfo = searchDeviceObj.query();
    console.log($scope.searchDeviceInfo);
    console.log($scope.searchDeviceInfo.length);
    /*if($scope.searchDeviceInfo.$promise.then(function (value) {

        })){
        toastr.warning("设备名称输入有误，无此设备！");
    }*/
    $scope.searchDeviceInfo.$promise.then(function (value) {
        if(value == false){
            toastr.warning("设备名称输入有误，无此设备！");
            setTimeout(function () {
                window.location.reload();
            },1000);
        }
        else{
            $scope.deviceList = $scope.searchDeviceInfo;
            $("#searchDeviceText").on("focus",function () {
                $(this).val("");
            })
        }
    });
};






    /*--------显示遥测数据-------------*/
/*时间格式化*/
    function formatDate(now) {
        var year=now.getFullYear();
        var month=now.getMonth()+1;
        var date=now.getDate();
        var hour=now.getHours();
        var minute=now.getMinutes();
        var second=now.getSeconds();
        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
    }
    // 判断元素是否在数组中
    function inArray(value, array) {
        var i = array.length;
        while (i--) {
            if (array[i] === value) {
                return true;
            }
        }
        return false;
    }


    /*    webSocket start  */
    var ws;
    function realtimeDevice(deviceId) {
        var url = 'ws://39.104.84.131:8100/websocket';
        var keys = [];
        listenWs(url);


        function listenWs(url) {
            if(ws instanceof WebSocket){
                ws.close();
            }

            ws = new WebSocket(url);

            ws.onopen = function (e) {
                log("Connected");
                sendMessage('{"deviceId":"' + deviceId + '"}');
            };

            ws.onclose = function (e) {
                log("Disconnected: ");
            };
            // Listen for connection errors
            ws.onerror = function (e) {
                log("Error ");
            };
            // Listen for new messages arriving at the client
            //var time0 = formatDate(time);
            ws.onmessage = function (e) {
                //e是返回体
                log("Message received: " + e.data);
                var message = JSON.parse(e.data);

                for(var i in message.data) {
                    console.log(message.data[i].ts);
                    console.log(message.data[i].key);
                    console.log(message.data[i].value);
                    var telemetryDate = formatDate(new Date(message.data[i].ts));
                    var telemetryKey = message.data[i].key;
                    var telemetryValue = message.data[i].value;
                    var key = telemetryKey;
                    // 是之前出现过的key，则刷新原来的行
                    if (inArray(key, keys)) {
                        // 遍历table
                        $('#realtime_data_table tr').each(function(trindex) {
                            var tableKey = $(this).children('td').eq(1).text();
                                if (tableKey === key){
                                $(this).children('td').eq(0).text(telemetryDate);
                                $(this).children('td').eq(2).text(telemetryValue);
                            }
                        });
                    }
                    // 是之前未出现过的key，则新加一行显示
                    else {
                        // console.log(keys);
                        keys.push(key);
                        $('#realtime_data_table').append('<tr><td>' + telemetryDate + '</td><td>' + key + '</td><td>' + telemetryValue + '</td></tr>');
                    }
                }

            }
        }


        function log(s) {
            // Also log information on the javascript console
            console.log(s);
        }

        function sendMessage(msg) {
            ws.send(msg);
            log("Message sent");
        }
    }
    /*    webSocket end   */
    /*--------显示遥测数据end-------------*/

    /*显示详情*/
    var num;//页数
    var size;//每页显示的数据个数，如果不设置，则最后一页少于pageSize后,再往前翻就只显示最后一页的数据个数
$scope.showDetail = function () {
    $("#searchKey").val("");//清空搜索框
    $(".pagination li,#attrDisplay tr").remove();//清空属性展示列表和分页按钮
    $("#attrSelectInfo option:first").prop("selected","selected");
    var attrDetailObj = $resource("/api/data/getKeyAttribute/:deviceId");
    var attrDetailInfo = attrDetailObj.query({deviceId:$scope.deviceInfo.id},function (resp) {
        console.log(resp);
        if(attrDetailInfo.length != 0){
            num = Math.ceil(attrDetailInfo.length / 5);
            size = 5;
            initUI(1,5);
        }else{
            num = 0;
            size = 0;
            initUI(0,0);
        }

    });


    /*按键值搜索*/
    $scope.findKey = function () {
        // console.log(attrDetailInfo[0].key);
        $("#attrDisplay tr").remove();
        var txt=$("#searchKey").val();
        var tag = 0;
        if(txt == ""){
            initUI(1,5);
        }else{
            for(var i = 0;i<attrDetailInfo.length;i++){
                if(attrDetailInfo[i].key == txt){
                    var latestTs = formatDate(new Date(attrDetailInfo[i].lastUpdateTs));
                    $("#attrDisplay").append('<tr>'+'<td class="list-item">'+latestTs+'</td>'+'<td class="list-item">'+attrDetailInfo[i].key+'</td>'+'<td class="list-item">'+attrDetailInfo[i].value+'</td>'+'</tr>')
                    tag++;
                }
            }
            if(tag == 0){
                $("#attrDisplay").append('<tr>'+'<td class="list-item">'+'</td>'+'<td class="list-item">'+'无此键值！'+'</td>'+'<td class="list-item">'+'</td>'+'</tr>')
            }

        }

    };

    // console.log(attrDetailInfo);//获取的所有数据，格式为[{},{}]

    /*==========显示属性==========*/
    //分页功能实现
    function initUI(pageNo, pageSize) {
        console.log(pageNo);
        console.log(pageSize);
        //pageNo 当前页号
        //pageSize 页面展示数据个数
        var html = '';
        for(var i=(pageNo-1)*size; i<((pageNo-1)*size+pageSize); i++) {
            // console.log(i+"|"+Number((pageNo-1)*size+pageSize));
            var item = attrDetailInfo[i];
            console.log(attrDetailInfo[i]);
            var latestTs = formatDate(new Date(attrDetailInfo[i].lastUpdateTs));
            html += '<tr>'+'<td class="list-item">'+latestTs+'</td>'+'<td class="list-item">'+item.key+'</td>'+'<td class="list-item">'+item.value+'</td>'+'</tr>';
        }
        document.getElementsByClassName('data-list')[0].innerHTML = html;
        pagination({
            cur: pageNo,
            total: num,//总共多少页
            len: 5,//显示出来的点击按钮个数
            targetId: 'pagination',
            callback: function() {
                var me = this;
                var oPages = document.getElementsByClassName('page-index');
                for(var i = 0; i < oPages.length; i++) {
                    oPages[i].onclick=function() {
                        if(this.getAttribute('data-index')*pageSize>attrDetailInfo.length){
                            initUI(this.getAttribute('data-index'),pageSize-this.getAttribute('data-index')*pageSize+attrDetailInfo.length);
                        }else{
                            initUI(this.getAttribute('data-index'), size);
                        }
                    }
                }
                var goPage = document.getElementById('go-search');
                goPage.onclick = function() {
                    var index = document.getElementById('yeshu').value;
                    if(!index || (+index > me.total) || (+index < 1)) {
                        return;
                    }
                    //若不加此判断，pageSize仍为传进来的原值，若最后一页数值不够，则会产生undefined错误
                    if(pageSize*index > attrDetailInfo.length){
                        pageSize = attrDetailInfo.length-pageSize*(index-1);
                        initUI(index, pageSize);
                    }else{
                        initUI(index, size);
                    }

                }
            }
        });
    };
    //每次显示数据数量发生变化都重新分页
    $scope.showNum = function () {
        $(".pagination li,#attrDisplay tr").remove();//每次清空属性展示列表和分页按钮
        var limit = Number($("#attrSelectInfo option:selected").text());
        //使用.text()取出的数据是字符型！！！！
        num = Math.ceil(attrDetailInfo.length / limit);
        size = limit;
        initUI(1,limit);
    };
    /*===================================================================*/






    /*调用函数，显示遥测数据*/
    $('#realtime_data_table tr td').remove();//在显示遥测数据之前清空遥测数据表
    realtimeDevice($scope.deviceInfo.id);//建立websocket连接
    $("#modalCloseDetail,#modalConfirmDetail,#modalCloseTagDetail").click(function () {
        ws.close();
    });


    /*显示历史数据*/
    //获取起止时间
    $scope.subTime = function () {
        if($("#startTime").val()=="" || $("#endTime").val()==""){
            toastr.warning("起始时间无效！");
        }else{
            var start = $("#startTime").val();
            var end = $("#endTime").val();
            var startStamp = new Date(start).getTime()/1000;
            var endStamp = new Date(end).getTime()/1000;
            if(startStamp > endStamp){
                toastr.warning("起始时间无效！");
            }else{
                console.log(start);
                console.log(startStamp);
                console.log(end);
                console.log(endStamp);
            }
        }

    };


    /*控制面板*/

    var abilityDesArr = new Array();//用于记录所有aibilityDes转换成json后的数据[{},{},...]
    var serviceName = new Array();//用于记录所有的serviceName
    var methodName = new Array();//用于记录所有的methodName
    $('#control_panel').empty();//每次将控制面板清空再渲染
    var controlObject = $resource("/api/v1/ability/:manufacturerName/:deviceTypeName/:modelName");
    $scope.controlInfo = controlObject.query({manufacturerName:$scope.deviceInfo.manufacture,deviceTypeName:$scope.deviceInfo.deviceType,modelName:$scope.deviceInfo.model});
    $scope.controlInfo.$promise.then(function (value) {



        console.log(value);

        for(var i = 0;i<value.length;i++){
            var abilityDesJson = JSON.parse(value[i].abilityDes);//将所有abilityDes（string）转成JSON
            abilityDesArr.push(abilityDesJson);//把abilityDesJson存进数组
            serviceName.push(abilityDesJson.serviceName);//用于记录所有的服务名（有多少个小控制面板）
            methodName.push(abilityDesJson.serviceBody.methodName);//用于记录所有的方法名，用于传回数据
            //注意：小控制面板、serviceName、methodName以及各控制按钮的id编号都是一一对应的（用i循环即可），这样方便取值


            //每个小控制面板的id为ctrlDiv{{i}}
            $('#control_panel').append('<div class="col-xs-10 col-sm-6 col-md-4 service-panel"><form><fieldset id="ctrlDiv' + i + '"><legend class="service-control-legend">' + serviceName[i] + '</legend></fieldset></form></div>');
            console.log("serviceName:"+serviceName[i]);
            var params = abilityDesJson.serviceBody.params;//用于记录每一个小控制面板下有多少个控制选项,随i的取值变化而变化
            console.log("params"+params);
            console.log("params.length"+params.length);
            for(var j = 0;j < params.length;j++){
                console.log(params[j]);
                console.log(params[j].value);

                var type = params[j].type;//控制类型
                var key = params[j].key;//控制名称
                var valueInfo = params[j].value;//控制默认值或范围


                //每个小控制面板下的控制按钮id为parma
                if(type == 1){
                    $('#ctrlDiv' + i).append('<div class="form-group"><label class="col-sm-3 control-label" style="text-align: left;">' + key + '</label><div class="col-sm-9"><input type="text" class="form-control" id="param'+ i + j +'"  value="' + valueInfo +'"/></div></div>');
                }
                else if(type == 2){
                    /*函数：split()
                    功能：使用一个指定的分隔符把一个字符串分割存储到数组*/
                    /* var temp = params[j].value.split(" ");
                    var leftStatus = temp[0];
                     var rightStatus = temp[1];
                     var curStatus = rightStatus;
                     console.log("0:"+temp[0]);
                     console.log("1:"+temp[1]);*/
                    /*var leftStatus = true;
                    var rightStatus = false;*/
                    $('#ctrlDiv' + i).append('<div class="form-group"><label class="col-sm-3 control-label" style="text-align: left;">' + key +  '</label><div class="col-sm-9"><image src="static/thingsManage/assets/img/off.png" id="param'+i+j+ '" style="cursor: pointer; width: 80px; height: 30px; margin: 0 10px;"></image></div></div>');
                   /* var img = document.getElementById("param"+i+j);
                    img.setAttribute('on', true);
                    img.setAttribute('off', false);*/
                    $("#param"+i+j).click(function () {
                        if($(this).attr("src") == "static/thingsManage/assets/img/off.png"){
                            console.log("off->on");
                           /* $(this).removeClass();
                            $(this).addClass("true");*/
                            $(this).attr("src","static/thingsManage/assets/img/on.png");

                        }else{
                            console.log("on->off");
                          /*  $(this).removeClass();
                            $(this).addClass("false");*/
                            $(this).attr("src","static/thingsManage/assets/img/off.png");
                        }

                    });
                }
                else if(type == 3){

                    var temp = params[j].value.split(" ");
                    var lowerBound = temp[0];
                    var upperBound = temp[1];
                   /* var lowerBound = 10;
                    var upperBound = 20;*/
                    console.log(lowerBound);
                    console.log(upperBound);
                    //html5标签 <input type="number" min="" max="" step="" value=""/>
                    $('#ctrlDiv' + i).append('<div class="form-group"><label class="col-sm-3 control-label" style="text-align: left;">' + key + '</label><div class="col-sm-9"><input type="number" class="form-control" id="param'+ i + j +'" name="rangeInput" min="' + lowerBound + '" max="' + upperBound + '" value="' + lowerBound +'" step="1"/><span>(' + lowerBound + '-' + upperBound + ')</span></div></div>');
                    console.log("number:"+$("#param"+i+j).val());
                }
            }
            $('#ctrlDiv' + i).append('<button class="btn btn-primary ctrlDivBtn" id="'+i+ '" type="button">应用</button>');

        }


        $(".ctrlDivBtn").on("click",function () {
            //注意二维数组的定义方式！！一定要定义在对应循环的上一层
            var valueArr = new Array();
            var keyArr = new Array();
            for(var i = 0;i<value.length;i++) {
                /*console.log("serviceName:" + serviceName[i]);
                console.log("methodName:" + methodName[i]);
                console.log("maxi:"+value.length);*/
                //console.log(abilityDesArr[i].serviceBody.params);
                var params = abilityDesArr[i].serviceBody.params;//用于记录每个serviceBody的params（随i变化而变化！！）
                /*console.log(params);*/
                //console.log(params.length+"----"+i);
                //console.log(abilityDesArr[i].serviceBody.params.length);
                valueArr[i] = new Array();
                keyArr[i] = new Array();

                for(var j = 0;j<params.length;j++){
                    console.log(params[j].key);
                    console.log(params[j].type);

                    if(params[j].type == 2){

                        if($("#param"+i+j).attr("src") == "static/thingsManage/assets/img/off.png"){
                            valueArr[i][j] = false;
                        }
                        else if($("#param"+i+j).attr("src") == "static/thingsManage/assets/img/on.png"){
                            valueArr[i][j] = true;
                        }
                    }
                    else{
                        valueArr[i][j] = $("#param"+i+j).val();
                    }
                    keyArr[i][j] = params[j].key;
                    console.log("=========="+i+j+"=============");
                    console.log("valueInfo:"+ valueArr[i][j]);
                    console.log("key:"+ keyArr[i][j]);
                    console.log("==========="+i+j+"============");

                }
                // console.log(abilityDesArr[i].serviceBody.params.length);
            }


            console.log(this.id);
            var index = this.id;
            console.log(serviceName[index]);
            console.log(methodName[index]);
            // var jsonObj = {};
            var keys = [];
            var values = [];
            keys.push("serviceName");
            values.push(serviceName[index]);
            keys.push("methodName");
            values.push(methodName[index]);
            for(var i = 0;i < abilityDesArr[index].serviceBody.params.length;i++){
                var type = document.getElementById("param"+index+i).tagName;
                if(type == "IMG"){
                    var tag = $("#param"+index+i).attr("src");
                    if(tag == "static/thingsManage/assets/img/off.png"){
                        valueArr[index][i] = false;
                    }else if(tag == "static/thingsManage/assets/img/on.png"){
                        valueArr[index][i] = true;
                    }
                }

                keys.push(keyArr[index][i]);
                values.push(valueArr[index][i]);
                console.log("value"+index+i+":"+valueArr[index][i]);
                console.log("key"+index+i+":"+keyArr[index][i]);
                var json = '{';
                for (var j = 0; j < keys.length; j++) {
                    json += '"' + keys[j] +'":"' + values[j] + '",';
                }
                json = json.slice(0,json.length-1);
                json += '}';
            }
            console.log("json:"+json);
            console.log( $scope.deviceInfo.id);
           /* var subObj = $resource("/api/shadow/control/:deviceId");
            var subInfo = subObj.save({deviceId:$scope.deviceInfo.id},json);
            console.log(subInfo);*/
            $.ajax({
                url:"/api/shadow/control/"+$scope.deviceInfo.id,
                data:json,
                contentType: "application/json; charset=utf-8",//post请求必须
                dataType:"text",
                type:"POST",
                success:function(msg){
                    toastr.success("应用成功！");
                },
                error:function (err) {
                    toastr.error("应用失败！");
                }
            });
        });
    });

};


    /* =============================================================
         jquery动画效果
       ============================================================ */

/* HIGHLIGHT效果*/
    $(document).ready(function () {
        $(".highlight").mouseover(function () {
            $(this).css("color","#337ab7");
        });
        $(".highlight").mouseout(function () {
            $(this).css("color","#305680");
        });
        $("#preDevice,#nextDevice").mouseover(function () {
            $(this).css("opacity","1");
        });
        $("#preDevice,#nextDevice").mouseout(function () {
            $(this).css("opacity","0.3");
        });
        $("#showHistory").mouseover(function () {
            $(this).css("color","#337ab7");
        });
        $("#showHistory").mouseout(function () {
            $(this).css("color","#305680");
        });
    });

}]);


