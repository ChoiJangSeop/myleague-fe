<script>
export default {
    props: {
        id: String,
    },

    data() {
        return {

            participants: [],

            league: {
                title: "",
                promotions: "",
                roundRobins: "",
                playoff: "",
                startedDate: "",
                endDate: "",
            },
            startedDate: {
                year: "",
                month: "",
                day: "",
            },

            endDate: {
                year: "",
                month: "",
                day: "",
            },

            matchDay: [
                false,  // SUN
                false,  // MON
                false,  // TUE
                false,  // WED
                false,  // THUR
                false,  // FRI
                false,  // SAT
            ],

            roundRobins: -1,
            matchesPerDay: -1,
            matchesPerTeam: -1,
            matchesPerLeague: -1,
        }
    },

    methods: {
        stringifyDate(date) {
            return date.year.toString() + '-' + 
                    (date.month < 10 ? "0" : "") + date.month.toString() + '-' + 
                    (date.day < 10 ? "0" : "") + date.day.toString();
        },

        putLeague() {
            this.league.roundRobins = this.roundRobins;
            this.league.startedDate = this.stringifyDate(this.startedDate);
            this.league.endDate = this.stringifyDate(this.endDate);

            this.axios.put("/leagues/"+this.id, this.league).then(res => {
                console.log(res.data);
            });
        },

        getEndDate() {
            const dateStart = new Date();
            dateStart.setFullYear(this.startedDate.year);
            dateStart.setMonth(parseInt(this.startedDate.month) - 1);
            dateStart.setDate(this.startedDate.day);

            var N = this.matchesPerLeague;
            var s = this.matchDay.filter((day,index) => (dateStart.getDay() <= index && day===true)).length * this.matchesPerDay;
            var a = this.matchDay.filter(day => day===true).length * this.matchesPerDay;
            
            N = N - s;

            var Q = parseInt(N / a);
            var r = N % a;

            console.log(dateStart.getDay() + " : " + dateStart);
            console.log(s + " " + N + " " + Q + " " + r);

            var endDay = -1;

            for (var i=0; i<7; ++i) {
                if (r == 0) {
                    for (var j=6; j>=0; --j) {
                        if (this.matchDay[j] === true) {
                            endDay = j - 7;
                            break;
                        }
                    }
                    break;
                }

                if (this.matchDay[i] === false) continue;

                r -= this.matchesPerDay;

                if (r<=0) {
                    endDay = i;
                    break;
                }
            }

            let dateEnd = dateStart;

            dateEnd.setDate(dateEnd.getDate() + 7 - dateStart.getDay());
            dateEnd.setDate(dateEnd.getDate() + (7 * Q));
            dateEnd.setDate(dateEnd.getDate() + endDay);

            this.endDate.year = dateEnd.getFullYear();
            this.endDate.month = dateEnd.getMonth() + 1;
            this.endDate.day = dateEnd.getDate();
            
        },

        createMatch(_round, home, away) {
       
            const match = {
                round: _round,
                matchDate: "",
                homeId: home,
                awayId: away
            }

            return match;
        },

        postMatch() {
            
            // 1. create match

            const participantId0 = this.participants[0].id;

            let participantsId = [];
            for (var i=1; i<this.participants.length; ++i) {
                participantsId.push(this.participants[i].id);
            }

            let matches = [];
            let round = 0;
            let flag = true;
            
            if (participantsId.length % 2 === 0) {
                participantsId.push(participantId0);
                flag = false;
            }

            const len = participantsId.length;

            for (var r=0; r<this.roundRobins; ++r) {
                for (var i=0; i<len; ++i) {
                    round++;
                    if (flag === true) {
                        matches.push(this.createMatch(round, participantId0, participantsId[i]));
                    }
                    for (var diff=1; diff<len/2; ++diff) {
                        let home = (i + diff) % len;
                        let away = (i - diff + len) % len;

                        if (home === away) continue;

                        matches.push(this.createMatch(round, participantsId[home], participantsId[away]));
                    }
                }
            }

            // 2. scheduled match
            
            // start week
            const dateStart = new Date();
            dateStart.setFullYear(this.startedDate.year);
            dateStart.setMonth(parseInt(this.startedDate.month) - 1);
            dateStart.setDate(this.startedDate.day);

            let idx = 0;
            
            for (var i=dateStart.getDay(); i<7; ++i) {
                let dateMatch = dateStart;

                if (this.matchDay[i] === true) {
                    dateMatch.setDate(dateStart.getDate() - dateStart.getDay() + i);

                    for (var m=0; m<this.matchesPerDay; ++m) {
                        matches[idx++].matchDate = this.stringifyDate({
                            year: dateMatch.getFullYear(),
                            month: dateMatch.getMonth() + 1,
                            day: dateMatch.getDate()
                        });
                    }
                }
            }

            let currentDate = dateStart;
            currentDate.setDate(dateStart.getDate() - currentDate.getDay() + 7);
            while (idx < matches.length) {

                for (var i=0; i<7; ++i) {
                    if (idx >= matches.length) break;

                    if (this.matchDay[i] === true) {

                        for (var j=0; j<this.matchesPerDay; ++j) {
                            if (idx >= matches.length) break;

                            matches[idx++].matchDate = this.stringifyDate({
                                    year: currentDate.getFullYear(),
                                    month: currentDate.getMonth() + 1,
                                    day: currentDate.getDate()
                            });
                        }
                    }

                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }

            matches.forEach(match => {
                this.axios.post("/matches", match).then(res => {
                    console.log(res);
                })
            });

        },

        upateLeague() {
            this.league.startedDate = this.stringifyDate(this.startedDate);
            this.league.endDate = this.stringifyDate(this.endDate);
            this.league.roundRobins = this.roundRobins;

            this.axios.put("/leagues/"+this.id, this.league).then(res => {
                console.log(res);
            });

            this.postMatch();
            this.$router.push({ path: `/league/add/${this.id}/playoff`})
        }
    },

    mounted() {
        this.axios.get("/leagues/"+this.id).then(res => {
            this.league = res.data;
            console.log(this.league);
        });

        this.axios.get("/participants/search?league="+this.id).then(res => {
            this.participants = res.data.content;
            console.log(this.participants);
        })
    },

    watch: {
        roundRobins() {
            this.matchesPerTeam = this.roundRobins * (this.participants.length - 1);
            this.matchesPerLeague = (this.participants.length / 2) * this.matchesPerTeam;
        },  

        matchesPerDay() {
            this.getEndDate();
        },

        matchDay() {
            this.getEndDate();
        }
    }
    
}
</script>

<template>
    <h1 class="mx-3 mt-3 md-5">3?????? : ?????? ?????? ??? ??????</h1> 
    <form @submit.prevent="upateLeague" class="row g-3 mx-3 my-5">
        <div class="col-md-1 pull-left my-auto" style="font-weight:bold;">
            <label class="control-label">?????????</label>
        </div>
        <div class="col-md-2 my-auto">
            <input type="number" v-model="startedDate.year" class="form-control" placeholder="???(4???)">
        </div>
        <div class="col-md-2 my-auto">
            <select class="form-select" v-model="startedDate.month">
                <option selected>???</option>
                <option v-for="index in 12" :key="index">{{ index }}</option>
            </select>
        </div>
        <div class="col-md-2 my-auto">
            <input type="number" class="form-control" v-model="startedDate.day" placeholder="???">
        </div>
        <div class="col-md-12 m-3"></div> <!--empty container-->
        <div class="col-md-1 pull-left my-auto" style="font-weight:bold;">
            <label class="control-label">???????????????</label>
        </div>
        <div class="col-md-2 my-auto">
            <input type="number" v-model="roundRobins" class="form-control" placeholder="1">
        </div>
        <div class="col-md-9 my-auto">??????  {{ matchesPerTeam }}?????? / ???  {{ matchesPerLeague }}??????</div>
        <div class="col-md-12 m-4"></div> <!--empty container-->
        <div class="col-12 my-auto"><h5 style="font-weight:bold;">?????? ?????? ??????</h5></div>
        <div class="col-md-12 m-4"></div> <!--empty container-->
        <div class="col-md-1 pull-left my-auto" style="font-weight:bold;">
            <label class="control-label">?????? ??????</label>
        </div>

        <div class="btn-group col-md-5 my-auto" role="group" aria-label="Basic checkbox toggle button group">

            <input type="checkbox" v-model="matchDay[0]" class="btn-check" id="sunCheck" autocomplete="off">
            <label class="btn btn-outline-secondary" for="sunCheck">???</label>

            <input type="checkbox" v-model="matchDay[1]" class="btn-check" id="monCheck" autocomplete="off">
            <label class="btn btn-outline-secondary" for="monCheck">???</label>

            <input type="checkbox" v-model="matchDay[2]" class="btn-check" id="tuesCheck" autocomplete="off">
            <label class="btn btn-outline-secondary" for="tuesCheck">???</label>

            <input type="checkbox" v-model="matchDay[3]" class="btn-check" id="wedCheck" autocomplete="off">
            <label class="btn btn-outline-secondary" for="wedCheck">???</label>

            <input type="checkbox" v-model="matchDay[4]" class="btn-check" id="thurCheck" autocomplete="off">
            <label class="btn btn-outline-secondary" for="thurCheck">???</label>

            <input type="checkbox" v-model="matchDay[5]" class="btn-check" id="friCheck" autocomplete="off">
            <label class="btn btn-outline-secondary" for="friCheck">???</label>

            <input type="checkbox" v-model="matchDay[6]" class="btn-check" id="satCheck" autocomplete="off">
            <label class="btn btn-outline-secondary" for="satCheck">???</label>

        </div>
        <div class="col-md-12 m-3"></div> <!--empty container-->
        <div class="col-md-1 pull-left my-auto" style="font-weight:bold;">
            <label class="control-label">?????? ?????? ???</label>
        </div>
        <div class="col-md-2 my-auto">
            <input type="number" v-model="matchesPerDay" class="form-control" placeholder="0">
        </div>
        <div class="col-md-9 my-auto">?????? ????????? : {{ endDate.year }}??? {{ endDate.month }}??? {{ endDate.day }}???</div>
        
        <div class="col-12">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="gridCheck">
                <label class="form-check-label" for="gridCheck">
                    ????????? ???????????? ???????????? ????????????.
                </label>
            </div>
        </div>
        <div class="col-12">
            <button type="submit" class="btn btn-primary">???????????? (????????????)</button>
        </div>
    </form>
</template>