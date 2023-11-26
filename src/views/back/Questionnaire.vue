<script>
export default {
    data() {
        return {
            flag: false, //彈框顯示及隱藏
            quflag: false, ////建立題目（測試）
            obj: {
                title: "",
                description: "",
                startDate: "",
                endDate: ""
            },
            lists: [],
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            fetch('http://localhost:8080/api/quiz/searchQuestionnaireList', {
                method: 'GET',
                headers: {
                    // "Accept":"application/json",
                    "Content-Type": "application/json",
                    // "Access-Control-Allow-Origin":"*"
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                })
                .catch(error => console.error('Error:', error));
        },
        add() { //新增問題
            this.flag = true //彈框顯示
        },
        creat() { //加入或編輯問題的提交
            /*
            問卷id:以id最大值+1。
            (1)...擴展運算符，Math.max()獲取最大值，map循環遍歷，取得id值，最後進行+1。
            (2)避免list一開始為空陣列，id+1會報錯，故當list長度>0不為空時，取得id+1，否則直接給予id=1。
            */
            let _id = this.lists.length > 0 ? Math.max(...this.lists.map(item => item.id)) + 1 : 1;
            this.lists.push({ ...this.obj, id: _id }); //獲取id並添加進lists
            this.flag = false; //彈框隱藏
            this.obj = {}; //清空前次輸入內容
            this.quflag = true; ////建立題目（測試）
        },
        del(v, index) {  //刪除問題
            //this.lists.splice(index, 1) //刪除位置及個數
            this.lists = this.lists.filter(item => v.id != item.id) //陣列篩選，返回滿足條件的陣列。id相同過濾掉pass，當前點擊的和原本id不相同(將v及index傳遞過來，定義item，如果v的id不等於item的id,進行篩選出來)
        },
        createQu(){
            
        }
    },
};
</script>

<template>
    <!-- 搜尋 -->
    <div class="search">
        <label for="">問卷標題</label>
            <input class="text" type="text" name="" id="" placeholder="請輸入問卷標題" v-model="obj.title">
        <label for="">開始時間</label>
            <input class="date" type="date" name="" id="" v-model="obj.startDate">
        <label for="">結束時間</label>
            <input class="date" type="date" name="" id="" v-model="obj.endDate">
        <button class="searchBtn">搜尋</button>
    </div>
    <!-- 功能：建立問卷 -->
    <div class="addModule">
        <button class="addBtn" @click="add()">建立問卷</button>
    </div>
    <!-- 問卷列表 -->
    <div class="table">
        <table border="1" cellpadding="10">
            <thead>
                <tr>
                    <!-- <th>選取</th> -->
                    <th>編號</th>
                    <th>問卷標題</th>
                    <th>狀態</th>
                    <th>開始時間</th>
                    <th>結束時間</th>
                    <th>結果</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody v-for="(v, index) in lists" :key="v.id">
                <tr>
                    <!-- <td>選取功能 checkbox </td> -->
                    <td>{{ index + 1 }} == {{ v.id }}</td>
                    <td>{{ v.title }}</td>
                    <td>{{ 狀態 }}</td>
                    <td>{{ v.startDate }}</td>
                    <td>{{ v.endDate }}</td>
                    <td>前往</td>
                    <td>
                        <button class="delete" @click="del(v, index)"><i class="fa-solid fa-trash-can"></i></button>
                        <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- 建立問卷彈框 -->
    <div class="layer" v-show="flag">
        <div class="mask">
            <div class="head">
                <span>新建問卷</span>
                <button class="clBtn" @click="flag = false, this.obj = {}"><i class="fa-solid fa-circle-xmark"></i></button>
            </div>
            <div class="content">
                <label for="">問卷標題</label>
                    <input class="text" type="text" name="" id="" placeholder="請輸入問卷標題" v-model="obj.title">
                <label for="">問卷說明</label>
                    <textarea name="" id="" placeholder="請輸入問卷說明" v-model="obj.description"></textarea>
                <label for="">開始時間</label>
                    <input class="date" type="date" name="" id="" v-model="obj.startDate">
                <label for="">結束時間</label>
                    <input class="date" type="date" name="" id="" v-model="obj.endDate">
                <br>
                <button class="btn" @click="flag = false, this.obj = {}">取消</button>
                <button class="btn" @click="creat()"
                    :disabled="!obj.title || !obj.description || !obj.startDate || !obj.endDate">新建</button>
                <!-- :disabled 當新增或編輯內容為空時，creat按鈕禁用 -->
            </div>
        </div>
    </div>

    <!-- 刪除問卷彈框 -->
    <!-- 分頁 -->

    <!-- 建立題目 -->
    <div class="layer" v-show="quflag">
        <div class="mask">
            <button class="btn" @click="quflag = false">取消</button> <!-- 暫時先可以關閉，之後要改成上一頁 -->
            <button v-on:click="createQu()">新增問題</button>
        </div>
    </div>

</template>

<style lang="scss" scoped>
// 搜尋
.search {
    height: 25vh;
    margin: 0% 10% auto;
    border: 1px solid red;
}

// 建立問卷
.addModule {
    height: 10vh;
    margin: 0% 10% auto;
    border: 1px solid red;
    display: flex;
    justify-content: end;
    align-items: center;

    .addBtn {
        width: 100px;
        height: 40px;
        border: 0;
        border-radius: 50px;
        background-color: rgb(162, 162, 245);
        color: white;
    }
}

// 問卷列表
.table {
    display: flex;
    justify-content: center;

    table {
        width: 80%;
        border-collapse: collapse;
        border: 1px solid blue;
    }

    th,
    td {
        border: 1px solid blue;
    }
}

// 建立問卷彈框
.layer {
    width: 100%;
    height: 100vh;
    background-color: rgb(0, 0, 0, 0.5);
    //使畫面可以固定最上層
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .mask {
        width: 700px;
        height: 450px;
        background-color: rgb(224, 163, 163);
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px 25px;


        .head {
            width: 100%;
            height: 15%;
            border: 1px solid blue;
            background-color: rgb(0, 0, 0, 0);
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
                font-size: 18pt;
                font-weight: bold;
                color: black;
            }

            .clBtn {
                background-color: rgb(0, 0, 0, 0);
                border: none;
                font-size: 25pt;
                color: rgb(255, 0, 0);
                position: relative;

                &:hover {
                    color: #88aab9;
                    text-shadow: 1px 1px lightgray;
                }
            }
        }

        .content {
            width: 100%;
            height: 80%;
            border: 1px solid blue;
            background-color: rgb(0, 0, 0, 0);


            .text {
                width: 600px;
                padding: 5pt;
                margin: 5px 0 20px 10px;
                border-radius: 50px;
                border: none;
            }

            textarea {
                width: 600px;
                padding: 5pt;
                margin: 5px 0 20px 10px;
                border-radius: 50px;
                border: none;
            }

            .date {
                width: 200px;
                padding: 5pt;
                margin: 5px 10px 20px 10px;
                border-radius: 50px;
                border: none;
            }

            .btn {
                width: 70px;
                background-color: red;
                border-radius: 50px;
                border: none;
            }
        }
    }
}
</style>
