const state = {
    tableList: [{
        id: '1',
        name: 'name1',
        attr:"attr1"
    }, {
        id: '2',
        name: 'name2',
        attr:"attr2"
    }],//表格数据
}

//控制弹窗
function lanPopup(elem) {
    let popup = document.querySelector(elem)
    //弹窗点击关闭
    popup.querySelector(".close-btn").addEventListener("click", () => {
        popup.style.display = "none"
    })
    return {
        //显示弹窗
        show: () => {
            popup.style.display = "flex"
        },
        //关闭弹窗
        hide: () => {
            popup.style.display = "none"
        }
    }
}

//点击操作
function operationClick(type, id) {
    console.log("operationClick", type, id)
    switch (type) {
        case 'search':
            //获取搜索表单
            let searchFrom = {};
            ['name'].forEach(attr => {
                searchFrom[attr] = document.querySelector(".search-box").querySelector(`input[name=${attr}]`).value
            })
            console.log("searchFrom",searchFrom)
            //过滤满足条件的表格数据
            let tableList = state.tableList.filter(item => {
                return item.name.includes(searchFrom.name)
            })
            templateHTMl("tableList", tableList)
            break
        case 'add':
            templateHTMl("fromData")
            lanPopup("#popup-1").show()
            break
        case 'edit':
            // 获取编辑属性
            let fromData = state.tableList.find(item => item.id == id)
            console.log("fromData", fromData)
            templateHTMl("fromData", fromData)
            lanPopup("#popup-1").show()
            break
        case 'del':
            if (confirm("确定要删除吗?")) {
                //根据id查找索引
                let findIndex = state.tableList.findIndex(item => item.id === id)
                //根据索引删除
                state.tableList.splice(findIndex, 1)
                templateHTMl("tableList", state.tableList)
            }
            break
    }
}

//表单验证方法
function validationFn(elem,vObj = {}) {
    let fromElem = document.querySelector(elem)
    let bool = true
    for(let key in vObj){
        //查找错误
        let findError = vObj[key]&&vObj[key].find(item=>{
            if (!item.verify) {
                fromElem.querySelector(`input[name="${key}"]`).parentNode.setAttribute("error",item.msg)
                bool  = false
            }
            return !item.verify
        })
        console.log("findError",findError)
        if(!findError){
            fromElem.querySelector(`input[name="${key}"]`).parentNode.removeAttribute("error")
        }
    }
    return bool
}

//表单提交
function submitFn() {
    //获取表单
    let fromData = {};
    ["id",'name','attr'].forEach(attr => {
        fromData[attr] = document.querySelector("#fromData").querySelector(`input[name=${attr}]`).value
    })
    console.log("fromData", fromData)
    if (validationFn("#fromData",{
        name: [
            {
                verify: fromData.name,
                msg: '名称不能为空'
            },
            {
                verify: fromData.name.length >= 5,
                msg: '名称字数不能小于5'
            }
        ],
        attr:[
            {
                verify: fromData.attr,
                msg: '属性不能为空'
            },
        ]
    })) {
        if (fromData.id) {
            //编辑
            let findIndex = state.tableList.findIndex(item => item.id === fromData.id)
            state.tableList[findIndex] = fromData
        } else {
            //新增
            fromData.id = new Date().getTime()
            state.tableList.unshift(fromData)
            console.log("tableList", state.tableList)
        }
        templateHTMl("tableList", state.tableList)
        lanPopup("#popup-1").hide()
    }

}


//渲染页面
function templateHTMl(id, data = {}) {
    let html = ``
    switch (id) {
        case 'tableList':
            html = ((data) => {
                return data.map(item => {
                    return `<tr>
                                <td>${item.id}</td>
                                <td>${item.name}</td>
                                <td>${item.attr}</td>
                                <td>
                                    <div class="btn-Arr">
                                        <button class="btn btn-primary" onclick="operationClick('edit','${item.id}')">编辑</button>
                                        <button class="btn btn-danger" onclick="operationClick('del','${item.id}')">删除</button>
                                    </div>
                                </td>
                            </tr>`
                }).join("")
            })(data)
            break
        case 'fromData':
            html = ((data) => {
                return `
                        <input type="hidden" name="id" value="${data.id || ''}"/>
                        <div class="header-box">
                            <div class="title-box" name="">${data.id ? '编辑' : '新增'}</div>
                            <div class="close-btn">-</div>
                        </div>
                        <div class="section-box">
                            <div class="form-list">
                                <div class="form-li">
                                    <input type="text" name="name" value="${data.name || ''}" class="form-control" placeholder="名称">
                                </div>
                                <div class="form-li">
                                    <input type="text" name="attr" value="${data.attr || ''}" class="form-control" placeholder="属性">
                                </div>
                            </div>
                        </div>
                        <div class="footer-box">
                            <button class="btn btn-primary" onclick="submitFn()">提交</button>
                        </div>`
            })(data)
            break
    }
    document.getElementById(id).innerHTML = html
}




//进入页面执行
(() => {
    templateHTMl("tableList", state.tableList)
})()