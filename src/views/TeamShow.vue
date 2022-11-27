<script>
export default {
    props: {
        id: String,
    },
    data() {
        return {
            team: null,
            records: [],
            matches: [],
            matchRecord: [],
        }
    },

    methods: {
        
    },
    mounted() {
        console.log("mounted!");
        

        // team basic info
        this.axios.get("/teams/"+this.id).then(res => {
            this.team = res.data;
        });

        // team league record
        this.axios.get("/participants/search?team="+this.id).then(res => {
            this.records = res.data.content;

            this.records.forEach(record => {
                this.axios.get("/leagues/"+record.leagueId).then(res => {
                    record.title = res.data.title;
                    record.startedDate = res.data.startedDate.split(" ")[0].replaceAll("-", ".");
                    record.endDate = res.data.endDate.split(" ")[0].replaceAll("-", ".");
                })
            })
        });

        // team match record
        this.axios.get("/matches/search?team="+this.id).then(res => {
            this.matches = res.data.content;

            this.matches = this.matches.filter(match => (
                match.homeScore !== -1 && match.awayScore !== -1
            ));

            this.matches.forEach(match => {
                this.axios.get("/participants/"+match.homeId).then(res => {
                    if (res.data.teamId !== this.id) {
                        if (this.matchRecord.filter(record => record.teamId === res.data.teamId).length == 0) {
                            let newRecord = {
                                "teamId": res.data.teamId,
                                "win" : 0,
                                "loss": 0,
                                "setWin": 0,
                                "setLoss": 0,
                            };

                            this.matchRecord.push(newRecord);
                        }

                        this.matchRecord.forEach(record => {
                            if (record.teamId === res.data.teamId) {
                                if (match.homeScore < match.awayScore) {
                                    record.win++;
                                } else {
                                    record.loss++;
                                }

                                record.setWin += match.awayScore;
                                record.setLoss += match.homeScore;
                            }
                        })
                    }
                });

                this.axios.get("/participants/"+match.awayId).then(res => {
                    if (res.data.teamId !== this.id) {
                        if (this.matchRecord.filter(record => record.teamId === res.data.teamId).length == 0) {
                            let newRecord = {
                                "teamId": res.data.teamId,
                                "win" : 0,
                                "loss": 0,
                                "setWin": 0,
                                "setLoss": 0,
                            };

                            this.matchRecord.push(newRecord);
                        }

                        this.matchRecord.forEach(record => {
                            if (record.teamId === res.data.teamId) {
                                if (match.awayScore < match.homeScore) {
                                    record.win++;
                                } else {
                                    record.loss++;
                                }

                                record.setWin += match.homeScore;
                                record.setLoss += match.awayScore;
                            }
                        })
                    }
                });
            })

        });

        
    },

    watch: {
    }
}
</script>

<template>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fjalla+One&family=Roboto+Mono:wght@500&display=swap" rel="stylesheet">
    
    <div v-if="team !== null && records !== null" class="row p-0" style="height: 95vh; border-top: 1px solid #0d0d0d;">
        <!-- side page -->
        <div class="p-0 sub" style="width: 25vw;">
            <div class="img_box"><img class="main_logo" src="@/assets/img/kt.png"></div>
            <div class="title my-3">
                <h1>{{ team.shortName }}</h1>
                <h3>{{ team.name }}</h3>
            </div>
            
            <div class="my-auto pt-1 mt-5 title">
                <h5>LEAGUES IN PROGRESS</h5>
            </div>
            <div class="table-head main col-12 row mx-0 my-1 title" style="text-align: center;">
                <div class="col-5">League</div>
                <div class="col-2">R</div>
                <div class="col-3">W - L</div>
                <div class="col-1">P</div>
            </div>
            <div v-for="record in records" :key="record.id" 
                class="table-head col-12 row mx-0 my-1 title" 
                style="text-align: center;">
                <div class="col-5 my-auto">{{ record.title }}</div>
                <div class="col-2 my-auto">{{ record.rank }}위</div>
                <div class="col-3 my-auto">{{ record.win }}W {{ record.loss }}L</div>
                <div class="col-1 my-auto">{{ (record.setWin - record.setLoss > 0) ? "+" : "" }}{{ record.setWin - record.setLoss }}</div>
            </div>

        </div>


        <!-- main page -->
        <div class="main p-0" style="width:75vw;">
            <!-- navigation -->
            <div>
            <nav id="navar" class="navbar navbar-expand-lg navbar-dark">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Main</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#players">Players</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#league_record">League Record</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#match_record">Match Record</a>
                        </li>
                    </ul>
            </nav>
            </div>

            <!-- players -->
            <div id="players"></div>
            <div class="col-12 row">
                <div class="col-12 text m-3">
                    <h4>Players</h4>
                </div>
            </div>

            <!-- league record -->
            <div id="league_record"></div>
            <div class="col-12 text m-3">
                    <h4>League Record</h4>
            </div>
            <div class="col-12 row">
                <div class="col-12">
                    <div class="table-head main col-12 row mx-0 my-1 text" style="text-align: center; border-bottom: 1px solid black;">
                        <div style="width: 6%;"></div>
                        <div style="width: 24%;">League</div>
                        <div style="width: 20%;">Date</div>
                        <div style="width: 10%;">Status</div>
                        <div style="width: 10%;">Rank</div>
                        <div style="width: 20%;">Match</div>
                        <div style="width: 10%;">SET</div>
                    </div>
                    <div v-for="record in records" :key="record.id" 
                        class="table-head col-12 row mx-0 my-1 text" 
                        style="text-align: center; line-height: 50px; border-bottom: 1px solid black;">
                        <div class="my-auto title" style="width: 6%"><img src="@/assets/img/lck.png"></div>
                        <div style="width: 24%;">{{ record.title }}</div>
                        <div style="width: 20%;">{{ record.startedDate }} ~ {{ record.endDate }}</div>
                        <div style="width: 10%;">진행중</div>
                        <div style="width: 10%;">{{ record.rank }}위</div>
                        <div style="width: 20%;">{{ record.win }}W {{ record.loss }}L</div>
                        <div style="width: 10%;">{{ record.setWin }} - {{ record.setLoss }}</div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    
</template>

<style scoped>
nav {
    background-color: #262626;
    height: 40px;
    font-family: 'Fjalla One', sans-serif;
}
.main {
    background-color: #202022;   
    color: white;
}
.sub {
    background-color: #262626;
    color: white;
}


.btn-side {
    background-color: #202022;
    border-radius: 5px;
    color: white;
}

.btn-main {
    background-color: #262626;
    border-radius: 5px;
    color: white;
}

.standing-side {
    background-size: 100% 100%;
    background-image: url("@/assets/img/worlds_logo.png");
    opacity: 0.2;
}



.title {
    font-weight: bold;
    text-align: center;
    font-family: 'Fjalla One', sans-serif;
}

.match {
    font-size: 20px;
}

.text {
    font-weight: bold;
    font-family: 'Fjalla One', sans-serif;
}

img {
    width: 100%;
    padding: 10%;
    vertical-align: middle;
}


.img_box {
    aspect-ratio: 1/1;
    line-height: 25vw;
    padding: 5%;
    background: linear-gradient(45deg, Violet, Orange);
}
</style>