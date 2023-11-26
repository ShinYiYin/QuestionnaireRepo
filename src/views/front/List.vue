<script>
export default {
  data() {
    return {
      form: {
        title: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    }
  },
}

</script>

<template>
  <div>
    <header>動態問卷系統</header>
    <div>
      <main>
        <form action="" method="get">
          <label for="" name="title">問卷名稱
            <input type="text" v-model="form.title" placeholder="請輸入問卷名稱">
          </label>
          <label for="" name="title">統計時間
            <input type="date" name="date" id="startDate" v-model="form.startDate">
            <span>-</span>
            <input type="date" name="date" id="endDate" v-model="form.endDate">
          </label>
          <button type="button" @click="onSubmit">搜尋</button>
          <table>
            <tr>
              <th>編號</th>
              <th>問卷名稱</th>
              <th>狀態</th>
              <th>開始時間</th>
              <th>結束時間</th>
              <th>結果</th>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </table>
        </form>
      </main>
    </div>

  </div>
</template>

<style lang="scss" scoped>
div {
  background-color: rgb(214, 214, 255);
}

main {
  margin: auto;
  width: 80%;
  background-color: white;
}

header {
  margin: auto;
  width: 80%;
  background-color: rgb(188, 188, 250);
}


/* 表格 */
table {
    border-collapse: collapse; /* 合併單元格邊框 */
    text-align: center; /* 將表格內容文字置中 */
}
th, td {
    border: 1px black solid; /* 設定單元格邊框 */
}
</style>