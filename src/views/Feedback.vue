<script>
import axios from 'axios';
export default {
    data() {
        return {
            userList: [],
        }
    },
    mounted() {
        this.getUserList();
    },
    computed: {
        reverseUserList() {
            return this.userList.reverse();
        }
    },
    methods: {
        getUserList() {
            const qnId = this.$route.params.qnId
            console.log(qnId)
            axios.get(`http://localhost:8080/api/user/searchByQuestionnaireId?qnId=${qnId}`).then(res => {
                console.log(res);
                this.userList = res.data.userList
                console.log(this.userList)
            }).catch(err => {
                console.log(err);
            })
        },
        formatDateTime(dateTime) {
            const date = new Date(dateTime);
            return date.toLocaleString(); // 使用本地时间格式显示
        }
    }
}
</script>

<template>
    <div class="table">
        <table cellpadding="2" style="width:50%">
            <thead>
                <tr>
                    <th width="10%">編號</th>
                    <th width="35%">姓名</th>
                    <th width="40%">填寫時間</th>
                    <th width="15%">觀看回覆</th>
                </tr>
            </thead>
            <tbody v-for="(user, index) in reverseUserList">
                <tr>
                    <td>{{ index + 1 }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ formatDateTime(user.dateTime) }}</td>
                    <td><button class="edit btn" @click=""><i class="fa-solid fa-right-to-bracket"></i></button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss" scoped>
.table {
    display: flex;
    justify-content: center;

    table {
        width: 80%;
        border-collapse: collapse;
    }

    th,
    td {
        color: #538cce;
        font-size: medium;
        text-align: center; //文字水平居中
        vertical-align: middle; //文字垂直居中
        border: 2px solid #769fcdb0; //表格邊框樣式
    }

    th {
        color: white;
        background-color: #769FCD;
    }

    td {
        background-color: #F7FBFC;
    }

    .btn {
        border-radius: 25%;
        font-size: 15px;
        color: white;
    }

    .edit {
        background-color: #5a85ce;
        margin: 0 4%;
    }
}

</style>