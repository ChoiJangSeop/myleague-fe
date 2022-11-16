<script>
export default {
    data() {
        return {
            league: {
                title: "",
                startedDate: "",
                endDate: "",
                playoff: "NONE",
                promotions: 0,
                roundRobins: 0
            },

            startedDate: {
                year: NaN,
                month: NaN,
                day: NaN
            },

            endDate: {
                year: NaN,
                month: NaN,
                day: NaN
            },

            noneDate: false,
        }
    },
    methods: {
        stringifyDate(date) {
            return date.year.toString() + '-' + 
                    (date.month < 10 ? "0" : "") + date.month.toString() + '-' + 
                    (date.day < 10 ? "0" : "") + date.day.toString();
        },
        parsingDate(date) {
            const dateObj = {
                year: 0,
                month: 0,
                day: 0,
            };
            dates = date.split('-');

            dateObj.year = parseInt(dates[0]);
            dateObj.month = parseInt(dates[1]);
            dateObj.day = parseInt(dates[2]);

            return dateObj;
        },
        goNextStep() {
            if (this.noneDate === false) {
                this.league.startedDate = this.stringifyDate(this.startedDate);
                this.league.endDate = this.stringifyDate(this.endDate);
            } else {
                this.league.startedDate = "";
                this.league.endDate = "";
            }

            this.axios.post("/leagues", this.league).then(res => {
                console.log(res);
                this.$router.push({ path: `/league/add/${res.data.id}/participants` });
            }).catch(e => {
                console.log(e);
                alert(`${e.response.data.msg}`);
            })
        }
    },
}
</script>

<template>
    <h1 class="m-3">1단계 : 리그 기본 정보</h1>
    <form class="row g-3 m-3" @submit.prevent="goNextStep()">
        <div class="col-12">
            <label for="leagueTitle" class="form-label">리그 제목</label>
            <input type="text" class="form-control" v-model="league.title" id="leagueTitle">
        </div>
        <div class="col-7">
            시작일
        </div>
        <div class="col-5">
            종료일
        </div>
        <div class="col-12 row mt-1 g-2" v-if="noneDate === false">
        <div class="col-md-2">
            <input type="number" v-model="startedDate.year" class="form-control" placeholder="년(4자)">
        </div>
        <div class="col-md-2">
            <select class="form-select" v-model="startedDate.month">
                <option selected>월</option>
                <option v-for="index in 12" :key="index">{{ index }}</option>
            </select>
        </div>
        <div class="col-md-1">
            <input type="number" class="form-control" v-model="startedDate.day" placeholder="일">
        </div>
        <div class="col-md-2"><h3 style="text-align: center;">~</h3></div>
        <div class="col-md-2">
            <input type="number" class="form-control" v-model="endDate.year" placeholder="년(4자)">
        </div>
        <div class="col-md-2">
            <select class="form-select" v-model="endDate.month">
                <option selected>월</option>
                <option v-for="index in 12" :key="index">{{ index }}</option>
            </select>
        </div>
        <div class="col-md-1">
            <input type="number" class="form-control" v-model="endDate.day" placeholder="일">
        </div>
        </div>
        <div class="form-check col-12 mx-2">
            <input class="form-check-input" type="checkbox" v-model="noneDate" id="flexCheckChecked">
            <label class="form-check-label" for="flexCheckChecked">
                날짜를 지정하지 않습니다
            </label>
        </div>
        <button type="submit" class="btn btn-primary col-md-1 m-3 mx-2">다음</button>
    </form>
</template>