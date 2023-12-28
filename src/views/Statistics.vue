<script>
import axios from 'axios';
import Chart from 'chart.js/auto';
import { defineCustomElement, getTransitionRawChildren } from 'vue';
export default {
    data() {
        return {
            getTitle: "",
            getDescription: "",
            getStartDate: "",
            getEndDate: "",
            getPublised: false,
            qnList: [],
            qnId: 0,//可以不用？！!
            userList: [],
            quList: [],
            dataArr: [],
            ansSplitArr: [],
            textResult: [],
            resultObj: {}
        }
    },
    mounted() {
        this.getQnList(); //還未處理，要根據qnId渲染!
        this.getQuList();
        setTimeout(() => {
            this.drawChart()
        }, 300)
    },
    methods: {
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
                this.qnList = res.data.questionnaireList; //接受後端返回的數據，給予前端用來存放的qnList，v-for進行畫面渲染，.filter(過濾只顯示已發布的數據) 
                console.log(this.qnList)
            }).catch(err => {
                console.log(err);
            })
        },
        getQuList() { //獲取該問卷的題目
            this.qnId = this.$route.params.qnId
            axios.get(`http://localhost:8080/api/quiz/searchQuestionList?qnId=${this.qnId}`).then(res => {
                console.log(res);
                this.quList = res.data.questionList
                console.log(this.quList) //qnId:1、quId:1、optionType:"single"、option:"1;2;3"
                this.dataArr = this.quList.map(() => []) //將quList中的每個元素(題目)映射為一個空陣列，將結果存在dataArr中。如：[[],[],[]]表示有三題。
                this.getUserList();
            }).catch(err => {
                console.log(err);
            })
        },
        getUserList() { //獲取該問卷填答者所有資訊
            // this.qnId = this.$route.params.qnId
            axios.get(`http://localhost:8080/api/user/searchByQuestionnaireId?qnId=${this.qnId}`).then(res => {
                console.log(res);
                this.userList = res.data.userList; //qnId:1、ans:"1;A!B;txt"
                this.setData();
            }).catch(err => {
                console.log(err);
            })
        },
        setData() {
            this.userList.forEach(item => { //遍歷userList，將所有填答者的ans(字串)切分，放入ansSplitArr:[["Q1的ans", "Q2的ans", "Q3的ans"], ["", "", ""]...]，一個陣列表一位填答者。
                this.ansSplitArr.push(item.ans.split(';'))
            })
            this.ansSplitArr.forEach(ansArr => {
                ansArr.forEach((ans, index) => { //將ansArray中的每個元素按照索引放入dataArr中相應位置的陣列中(ans的index等於題號)
                    if (ans.includes('!')) { // 多選題含有"!"需要再次切分
                        const multiAnsArr = ans.split('!');
                        multiAnsArr.forEach(multiAns => {
                            this.dataArr[index].push(multiAns);
                        });
                    } else {
                        this.dataArr[index].push(ans); // 單選題、簡答題直接放入對應位置，dataArr:[["Q1的ans", "Q1的ans"...], ["Q2的ans", "Q2的ans"...]...]
                    }
                })
            })
            this.resultObj = {
                options: [],   // 放選項
                results: []   // 放選項計數
            }
            for (let i = 0; i < this.quList.length; i++) {
                let optionList = this.quList[i].option.split(";")
                this.resultObj.options.push(optionList)
                let data = this.dataArr[i]
                const counts = data.reduce((obj, item) => {
                    if (item in obj) {
                        obj[item]++
                    } else {
                        obj[item] = 1
                    }
                    return obj
                }, {})
                console.log("counts: " + counts)
                let resultList = []
                optionList.forEach(key => {
                    let value = counts[key]
                    resultList.push(value)
                })
                console.log(resultList)
                this.resultObj.results.push(resultList)

            }
            console.log(this.resultObj)
        },
        drawChart() {
            this.quList.forEach((qu, index) => {
                if (qu.optionType == 'single') {
                    const ctx = document.getElementById(qu.quId);
                    new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: this.resultObj.options[index],
                            datasets: [{
                                label: '# of Votes',
                                data: this.resultObj.results[index],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                }
                if (qu.optionType == 'multi') {
                    const ctx = document.getElementById(qu.quId);
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: this.resultObj.options[index],
                            datasets: [{
                                label: '# of Votes',
                                data: this.resultObj.results[index],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                }
                if (qu.optionType == 'text') {
                    console.log(this.dataArr)
                    this.resultObj = {
                        textList: [],   // 放選項
                        textCounts: []   // 放選項計數
                    }
                    for (let i = 0; i < this.dataArr.length; i++) {
                        this.resultObj.textList.push(this.dataArr[i]);
                        let data = this.dataArr[i];
                        const counts = data.reduce((obj, item) => {
                            if (item in obj) {
                                obj[item]++
                            } else {
                                obj[item] = 1
                            }
                            return obj
                        }, {})
                        let resultList = [];
                        this.dataArr[i].forEach(key => {
                            let value = counts[key]
                            resultList.push(value)
                        })
                        this.resultObj.textCounts.push(resultList)
                    }
                    console.log(this.resultObj)
                    let uniqueTextList = Array.from(new Set(this.resultObj.textList[index])); //Set為只儲存唯一值的集合對象，通過new Set()創建一個新的Set去除重覆項，返回一個包含唯一值的Set對象。使用Array.from()方法，從類似陣列或可叠代的對象中創建一個新的、淺拷貝的陣列實例。使用Array.from()將這個Set對象轉換成一個數組 uniqueTextList。使x軸確保不會重复顯示相同的選項。
                    const ctx = document.getElementById(qu.quId);
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: uniqueTextList,
                            datasets: [{
                                label: '# of Votes',
                                data: this.resultObj.textCounts[index],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                }
            });
        },
    },
}
</script>

<template>
    <div class="questionnaire">
        <!-- <p class="date">{{ qnList.startDate }} ~ {{ qnList.endDate }}</p>
        <div class="center">
            <p class="title">{{ qnList.title }}</p>
            <p class="description">{{ qnList.description }}</p>
        </div> -->
        <div class="questionArea">
            <div class="question" v-for="(qu, quIndex) in quList" :key="qu.id">
                <div class="top">
                    <span class="quId">{{ qu.quId }}{{ '.' }}</span>
                    <span class="qnTitle">{{ qu.qnTitle }}</span>
                </div>
                <div class="chart">
                    <canvas :id="qu.quId"></canvas>
                </div>
                <!-- <canvas v-if="qu.optionType == 'single'" :id="qu.quId"></canvas>
                <canvas v-if="qu.optionType == 'multi'" :id="qu.quId"></canvas>
                <canvas v-if="qu.optionType == 'text'" :id="qu.quId"></canvas> -->
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.questionnaire {
    width: auto;
    margin: 1% 10%;
    color: #538cce;
    font-size: large;
    font-weight: bolder;
    display: flex;
    flex-direction: column;

    .date {
        margin-left: auto;
        margin-bottom: 1%;
        color: #769fcdb0;
    }

    .center {
        padding: 2% 2%;
        background-color: #F7FBFC;
        border-radius: 10px;
        text-align: center;

        .title {
            font-size: larger;
            font-weight: 700;
        }

        .description {
            color: #769fcdb0;
        }
    }

}

.questionArea {
    width: auto;
    margin: 1% 25%;
    padding: 2% 2%;
    color: #538cce;
    font-size: large;
    font-weight: bolder;
    display: flex;
    flex-direction: column;
    background-color: #F7FBFC;
    border-radius: 10px;
    text-align: center;

    .quTitle {
        margin-right: auto;
        margin-bottom: 10px;
    }

    .question {
        background-color: #F7FBFC;
        padding: 20px;
        box-shadow: inset 0 0 8px rgba(102, 175, 233, .3);
        border-radius: 10px;
        margin: 10px 0;
        display: flex;
        flex-direction: column;

        .top {
            margin-right: auto;

            .quId {
                margin-right: 10px;
            }
        }
        // .chart {
        //     width: 90%;
        // }
    }
}
</style>