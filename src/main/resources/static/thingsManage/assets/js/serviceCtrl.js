mainApp.controller("abilityCtrl", function ($scope, $resource) {
   var modelId;
   var abilityId = [];
   $scope.result = new Array();


    /*能力组信息获取与展示*/
    var abilityGroup = $resource('/api/v1/abilityGroup');
    $scope.abilityGroups = abilityGroup.query();
    //console.log($scope.abilityGroups);


    /*右侧信息显示*/
    $scope.show = function(AG){
        $scope.result = [];//初始化数组；
        modelId = AG.model.modelId;
        var abilitiesObj = $resource("/api/v1/ability/:modelId");
        $scope.abilitiesInfo = abilitiesObj.query({modelId:modelId})
            .$promise.then(function (value) {
                //console.log(value);
                for(var i=0;i<value.length;i++) {
                    abilityId[i] = value[i].abilityId;
                    var jsonData = JSON.parse(value[i].abilityDes);
                    //console.log(jsonData);
                    jsonData.abilityId = value[i].abilityId;
                    $scope.result.push(jsonData);//获取到的result是一个数组，有abilityId
                }
            });
    };


    /*创建能力组*/
    $scope.addAM = function(){
        $scope.manufacturerName = $("#manufacturerName").val();
        $scope.deviceType = $("#deviceType").val();
        $scope.model = $("#model").val();
        $scope.createAbilityInfo = '{"manufacturerName":'+'"'+$scope.manufacturerName+'"'+',"deviceType":'+'"'+$scope.deviceType+'"'+',"model":'+'"'+$scope.model+'"'+'}';
        console.log($scope.createAbilityInfo);

        var createAbilityGroupObj =  $resource("/api/v1/abilityGroup");
        $scope.abilityInformation = createAbilityGroupObj.save({},$scope.createAbilityInfo,function (resp) {
            toastr.success("新增设备成功！");
            setTimeout(function () {
                window.location.reload();
            },500);
        },function (error) {
            toastr.error("新增设备失败！");
        });
    };


    /*创建能力*/
    var params = [];
    $scope.addAbility = function(){
        $scope.serviceName = $("#serviceName").val();
        $scope.serviceDescription = $("#serviceDescription").val();
        $scope.serviceType = $("#serviceType").val();
        $scope.protocol = $("#protocol").val();
        $scope.url = $("#url").val();
        $scope.requireResponce = $("#requireResponce").val();
        $scope.methodName = $("#methodName").val();

        for (var i = 0; i < $scope.fchat.replies.length; i++) {
            params.push({key:$scope.fchat.replies[i].key,
                "type":new Number($scope.fchat.replies[i].type),
                "value":$scope.fchat.replies[i].value});
        }


        $scope.createAbilityGroup = {
            modelId: modelId,
            abilityDes: {
                serviceName: $scope.serviceName,
                serviceDescription: $scope.serviceDescription,
                serviceType: $scope.serviceType,
                protocol: $scope.protocol,
                url: $scope.url,
                requireResponce: $scope.requireResponce,
                serviceBody: {
                    methodName: $scope.methodName,
                    params: params
                }
            }
        }


        console.log($scope.requireResponce);
        $scope.createAbility = JSON.stringify(
            {
                modelId: modelId,
                abilityDes: {
                    serviceName: $scope.serviceName,
                    serviceDescription: $scope.serviceDescription,
                    serviceType: $scope.serviceType,
                    protocol: $scope.protocol,
                    url: $scope.url,
                    requireResponce: new Boolean($scope.requireResponce),
                    serviceBody: {
                        methodName: $scope.methodName,
                        params: params
                    }
                }
            }
        )

        var createAbilityObj =  $resource("/api/v1/ability");
        $scope.ability = createAbilityObj.save({},$scope.createAbility,function (resp) {
            toastr.success("新增成功！");
            console.log($scope.ability);
            setTimeout(function () {
                $("#createSM").modal("hide");
                location.reload();
            },500);
        },function (error) {
            toastr.error("新增失败！");
        });
    };


    /*+加号增加的代码*/
    $scope.fchat = new Object();
    $scope.fchat.replies = [{key: "",type:1,value: ""}];
    // 初始化时由于只有1条参数，所以不允许删除
    $scope.fchat.canDescReply = false;
    // 增加参数
    $scope.fchat.incrReply = function($index) {
        $scope.fchat.replies.splice($index + 1, 0,
            {key: "",type:1,value: ""}); // 用时间戳作为每个item的key
        // 增加新的参数后允许删除
        $scope.fchat.canDescReply = true;
        console.log("增加一行");
        console.log($scope.fchat.replies);
    }
    // 减少参数
    $scope.fchat.decrReply = function($index) {
        // 如果参数大于1，删除被点击回复
        if ($scope.fchat.replies.length > 1) {
            $scope.fchat.replies.splice($index, 1);
        }
        // 如果参数为1，不允许删除
        if ($scope.fchat.replies.length == 1) {
            $scope.fchat.canDescReply = false;
        }
    }


    /*删除能力组*/
    $scope.delAG = function () {
        var delAGObj = $resource('/api/v1/abilityGroup?modelId=:id');
        delAGObj.delete({id: modelId},{} , function (resp) {
            //console.log(resp);
            $("#deleteSM").modal("hide");
            location.reload();
        }, function (resp) {
            console.log("删除失败");
            alert("删除失败！")
        });
    }


    /*删除能力*/
    $scope.deleteAA = function(data){
        var deleteAA = $resource('/api/v1/ability/:id');
        deleteAA.delete({id:data.abilityId},{},function(){
            toastr.success("删除成功！");
            setTimeout(function () {
                window.location.reload();
            },1000);
        },function () {
            alert("删除失败！");
        });
    }



});
