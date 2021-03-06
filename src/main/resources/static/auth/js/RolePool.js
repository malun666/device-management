var app = new Vue({
    el: '#app',
    data: {
        roleInfo: [],
        activeItem: '',
        columns: [
            {
                label: 'ID',
                prop: 'id',
                width: 50
            },
            {
                label: '权限名称',
                prop: 'name',
                width: 200
            },
            {
                label: '描述',
                prop: 'description'
            }],
        tableData: [],
        multipleSelection: [],
        dialogVisible_AP: false,  //AP=addPermission
        dialogVisible_AR: false,   //AR=addRole
        tableData_AP: [],
        multipleSelection_AP: [],
        addRoleInfo: {}
    },
    methods: {
        selected: function (item) {
            this.activeItem = item
            this.getPermissionByRole()
        },
        getAllRoles: function () {
            var vm = this
            //获取所有权限
            axios.get("/api/account/roles").then(function (response) {
                vm.roleInfo = response.data
                vm.activeItem = vm.roleInfo[0]
                vm.getPermissionByRole()
            }).catch(function (error) {
                console.log(error);
            })
        },
        getPermissionByRole: function () {
            var vm = this

            //根据id获取permission
            axios.get("/api/account/rolePermission", {
                params: {
                    role_id: vm.activeItem.id
                }
            }).then(function (response) {
                vm.tableData = response.data
            }).catch(function (error) {
                console.log(error);
            })
        },
        getExtraPermissionByRole: function () {
            var vm = this
            var role_id = vm.activeItem.id
            //根据角色ID获取可添加权限
            axios.get("/api/account/roleNotOwnedPermission", {
                params: {role_id: role_id}
            }).then(function (response) {
                vm.tableData_AP = response.data
            }).catch(function (error) {
                console.log(error);
            })
        },
        handleSelectionChange: function (val) {
            this.multipleSelection = val;
            //console.log(val);
        },
        deleteTag: function (id) {
            var vm = this
            var role_id = vm.activeItem.id
            var text = '删除'
            var json={}

            json.id=id

            //删除一个role下的permission
            axios.delete("/api/account/permission", {
                data:json ,
                params: {
                    role_id: role_id
                }
            }).then(function (response) {
                vm.showMessage(response.status, text)
                vm.getPermissionByRole()
            }).catch(function (error) {
                console.log(error);
            })
        },
        deleteMultipleTag: function () {
            var vm = this
            var permission_ids = []
            var json = {}
            var role_id = vm.activeItem.id
            var text = '批量删除'

            vm.multipleSelection.forEach(function (item) {
                permission_ids.push(item.id)
            })
            json.id = permission_ids.toString()
            //删除一个role下的permission
            axios.delete("/api/account/permission", {
                data: json,
                params: {
                    role_id: role_id
                }
            }).then(function (response) {
                vm.showMessage(response.status, text)
                vm.getPermissionByRole()
            }).catch(function (error) {
                console.log(error);
            })
        },
        handleSelectionChange_AP: function (val) {
            this.multipleSelection_AP = val;
            //console.log(val);
        },
        addMultiplePermissionTag: function () {
            var vm = this
            var permission_ids = []
            var role_id = vm.activeItem.id
            var text = '添加'
            var json = {}

            vm.multipleSelection_AP.forEach(function (item) {
                permission_ids.push(item.id)
            })
            json.id = permission_ids.toString()
            //为一个role添加permission
            axios.post("/api/account/permission?role_id=" + role_id,
                json
            ).then(function (response) {
                vm.showMessage(response.status, text)
                vm.dialogVisible_AP = false
                vm.getPermissionByRole()
            }).catch(function (error) {
                console.log(error);
            })
        },
        showDialog_AP: function () {
            var vm = this
            vm.dialogVisible_AP = true
            vm.getExtraPermissionByRole()
        },
        addRole: function () {
            var vm = this
            var text = '创建'

            //创建一个role
            axios.post("/api/account/role",
                vm.addRoleInfo
            ).then(function (response) {
                vm.showMessage(response.status, text)
                vm.dialogVisible_AR = false
                vm.getAllRoles()
            }).catch(function (error) {
                console.log(error);
            })

        },
        deleteRole: function () {
            var vm = this
            var roleId = vm.activeItem.id
            var text = '删除'

            //删除一个role
            axios.delete("/api/account/role", {
                params: {
                    roleId: roleId
                }
            }).then(function (response) {
                vm.showMessage(response.status, text)
                vm.getAllRoles()
            }).catch(function (error) {
                console.log(error);
            })
        },
        editRole: function () {
        },
        showMessage: function (status, text) {
            var vm = this
            var text = text
            var message = ''
            var type = ''

            switch (status) {
                case 200:
                    message = text + '成功'
                    type = 'success'
                    break;
                case 400:
                    message = text + '失败：参数无效'
                    type = 'warning'
                    break;
                case 401:
                    message = text + '失败：没有权限'
                    type = 'error'
                    break;
                case 403:
                    message = text + '失败：请求被禁止'
                    type = 'error'
                    break;
                case 404:
                    message = text + '失败：没有搜索到请求的资源'
                    type = 'error'
                    break;
                default:
                    message = text + '失败：未知错误'
                    type = 'error'
            }
            vm.$message({
                message: message,
                type: type
            });
        }
    },
    created: function () {
        var vm = this
        vm.getAllRoles()
    }
})
