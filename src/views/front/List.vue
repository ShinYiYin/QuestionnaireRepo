<script>
import axios from 'axios';
export default {
  data() {
    return {
      searchFlag: false,
      //搜尋用
      getTitle: "",
      getDescription: "",
      getStartDate: "",
      getEndDate: "",
      getPublised: false,
      qnList: [], //存放後端回傳的問卷物件 (可放置多個問卷)
      quList: [], //存放後端回傳的問題物件（可放置多個問題）
    }
  },
  mounted() {
    this.getQnList(); //重新加載頁面時，獲取問卷
  },
  methods: {
    searchQn() {
      this.searchFlag = !this.searchFlag; //彈框顯示及隱藏
    },
    getQnList() { //獲取問卷
      axios.get('http://localhost:8080/api/quiz/searchQuestionnaireList', {
        params: { //後端變數：前端變數 =>將前端變數v-model綁定input標籤，作為參數發送給後端
          title: this.getTitle,
          description: this.getDescription,
          published: this.getPublised,
          startDate: this.getStartDate,
          endDate: this.getEndDate,
        }
      }).then(res => {
        console.log(res); //res返回的數據
        this.qnList = res.data.questionnaireList.filter(item => item.published == true); //接受後端返回的數據，給予前端用來存放的qnList，v-for進行畫面渲染，.filter(過濾只顯示已發布的數據) 
        console.log(this.qnList)
      }).catch(err => {
        console.log(err);
      })
    },
    getQuList() { //獲取問卷的題目
      return axios.get(`http://localhost:8080/api/quiz/searchQuestionList?qnId=${this.getQnId}`).then(res => {
        console.log(res);
        this.quList = res.data.questionList
        console.log(this.quList)
      }).catch(err => {
        console.log(err);
      })
    },
    getStatus(published, startDate, endDate) {
      if (published == false) {
        return "未發布";
      }
      if (published == true) {
        const currentDate = new Date(); //將返回一個包含當前日期和時間的Date對象，然後賦值給currentDate。
        startDate = new Date(startDate); //將startDate和endDate轉換為了Date物件(從後端獲取的日期數據是字串)
        endDate = new Date(endDate);
        if (currentDate < startDate) {
          return "尚未開始";
        }
        if (currentDate > endDate) {
          return "已結束";
        } else {
          return "進行中";
        }
      }
    },
  },
}
</script>

<template>
  <!-- 功能：建立問卷 -->
  <div class="addModule">
    <button class="searchBtn btn" @click="searchQn()"><i class="fa-solid fa-magnifying-glass"></i></button>
  </div>
  <!-- 搜尋 -->
  <div class="search" v-show="searchFlag">
    <div class="searchTitle">
      <label for="">問卷標題</label>
      <input class="searchText" type="text" name="" id="" placeholder="請輸入問卷標題" v-model="getTitle">
    </div>
    <div class="searchDate">
      <label for="">開始時間</label>
      <input class="searchInputDate" type="date" name="" id="" v-model="getStartDate">
      <label for="">結束時間</label>
      <input class="searchInputDate" type="date" name="" id="" v-model="getEndDate">
      <button class="btn" @click="getQnList()">搜尋</button>
    </div>
  </div>

  <!-- 問卷列表 -->
  <div class="table">
    <table cellpadding="5" style="width:80%">
      <thead>
        <tr>
          <th width="6%">編號</th>
          <th width="29%">問卷標題</th>
          <th width="8%">狀態</th>
          <th width="15%">開始時間</th>
          <th width="15%">結束時間</th>
          <th width="6%">填寫</th>
          <th width="6%">結果</th>
        </tr>
      </thead>
      <tbody v-for="(qn, index) in qnList" :key="qn.id" >
        <tr>
          <td>{{ qn.id }}</td> <!-- {{ index + 1 }}-->
          <td>{{ qn.title }}</td>
          <td>{{ getStatus(qn.published, qn.startDate, qn.endDate) }}</td>
          <td>{{ qn.startDate }}</td>
          <td>{{ qn.endDate }}</td>
          <td><RouterLink to="/ans" class="edit btn"><i class="fa-solid fa-pen"></i></RouterLink></td>
          <td><button class="edit btn" @click=""><i class="fa-solid fa-chart-simple"></i></button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
// 建立問卷
.addModule {
  height: 10vh;
  margin: 0% 10% auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .btn {
    width: 120px;
  }

  .searchBtn {
    width: 50px;
  }
}

// 搜尋
.search {
  // max-width: 1260px;
  width: auto;
  height: 25vh;
  margin: 1% 10%;
  padding: 2% 5%;
  background-color: #F7FBFC;
  border-radius: 10px;
  color: #538cce;
  font-size: large;
  font-weight: bolder;

  .searchTitle {
    width: 100%;
    height: 47%;
    margin-bottom: 1%;
    display: flex;
    align-items: center;

    label {
      margin: 0 1%;
      width: 10%;
    }

    input {
      width: 88%;
      height: 80%;
    }
  }

  .searchDate {
    width: 100%;
    height: 47%;
    margin-top: 1%;
    display: flex;
    align-items: center;

    label {
      margin: 0 1%;
      width: 10%;
    }

    input {
      width: 32%;
      height: 80%;
    }

    .btn {
      width: 10%;
      margin-left: 2%;
    }
  }
}

//input樣式
textarea,
input {
  outline-style: none;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 5px;
  font-size: medium;
  font-weight: 700;
  color: #769FCD;

  &::placeholder {
    color: #ccc;
  }

  &:hover {
    border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6)
  }

  &::-webkit-datetime-edit-text {
    color: #ccc;
  }

  &::-webkit-datetime-edit-year-field {
    color: #ccc;
  }

  &::-webkit-datetime-edit-month-field {
    color: #ccc;
  }

  &::-webkit-datetime-edit-day-field {
    color: #ccc;
  }
}

//按鈕樣式
.btn {
  background-color: #769FCD;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: large;
  // width: 80px;
  // height: 40px;
  font-weight: bolder;

  &:hover {
    background-color: #769fcdb0;
  }
}

// 問卷列表
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
  }

  .delete {
    background-color: #CE5A67;
    margin: 0 5%;
  }

  .edit {
    background-color: #5a85ce;
    margin: 0 5%;
  }
}
</style>