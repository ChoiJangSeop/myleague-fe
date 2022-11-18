<script>
export default {
    props: {
        id: String,
    },
    data() {
        return {
            league: null,
            participants: [],
            matches: [],
        }
    },

    methods: {

        compareMatch(m1, m2) {
            if (m1.rank < m2.rank) return -1;
            else if (m1.rank > m2.rank) return 1;
            else return 0;
        },

        getTeamData(participantId, field) {

            const participant = this.participants.filter(participant => participant.id === participantId)[0];
            let ret = "";

            switch(field) {
                case "name":
                    ret = participant.team.name;
                    break;
                case "shortName":
                    ret = participant.team.shortName;
                    break;
                case "stat":
                    ret = participant.team.stat;
                    break;
                case "win":
                    ret = participant.win;
                    break;
                case "loss":
                    ret = participant.loss;
                    break;
                case "setWin":
                    ret = participant.setWin;
                    break;
                case "setLoss":
                    ret = participant.setLoss;
                    break;
                case "rank":
                    ret = participant.rank;
                    break;
                default:
                    ret = "not valid field";
                    break;
            }
            return ret;
        },

        getRecentResult(participant, amount) {

            participant.recentWin = 0;
            participant.recentLoss = 0;
            participant.streak = "";

            const recentMatches = this.matches.filter(match => (
                match.complete === true &&
                (match.homeId === participant.id || match.awayId === participant.id)
            ));
            const len = recentMatches.length;

            for (var i=1; i<=amount; ++i) {
                if (len - i < 0) break;

                if (recentMatches[len-i].homeId === participant.id) {
                    if (recentMatches[len-i].homeScore > recentMatches[len-i].awayScore) {
                        participant.recentWin++;
                    } else {
                        participant.recentLoss++;
                    }
                } else {
                    if (recentMatches[len-i].homeScore > recentMatches[len-i].awayScore) {
                        participant.recentLoss++;
                    } else {
                        participant.recentWin++;
                    }
                }
            }

            let flag = -1;  // win : 1 / loss : 0
            let num = 0;
            let curr = -1;

            for (var i=1; i<=len; ++i) {

                if (recentMatches[len-i].homeId === participant.id) {
                    if (recentMatches[len-i].homeScore > recentMatches[len-i].awayScore) {
                        curr = 1;
                    } else {
                        curr = 0;
                    }
                } else {
                    if (recentMatches[len-i].homeScore > recentMatches[len-i].awayScore) {
                        curr = 0;
                    } else {
                        curr = 1;
                    }
                }

                if (flag === -1) {
                    flag = curr;
                    num++;
                } else if (flag === curr) {
                    num++;
                } else {
                    break;
                }
            }

            if (flag === 1) participant.streak = num.toString() + "W";
            else if (flag == 0) participant.streak = num.toString() + "L";
        },  

        getTeam(teamId) {
            this.axios.get("/teams/"+teamId).then(res => {
                return res.data;
            })
        },

        putMatch(match) {
            match.homeScore = match.tmpHomeScore;
            match.awayScore = match.tmpAwayScore;
            match.complete = true;

            match.tmpHomeScore = "";
            match.tmpAwayScore = "";

            this.axios.put("/matches/"+match.id+"/play", match).then(res => {
                console.log(res);

                this.axios.get("/participants/search?league="+this.id).then(res => {
                    this.participants = res.data.content;
                    this.participants.sort(this.compareMatch);


                    this.participants.forEach(participant => {
                        this.axios.get("/teams/"+participant.teamId).then(res=> {
                            participant.team = res.data;
                        });
                        this.getRecentResult(participant, 5);
                    });
                })
            });
        },

        putMatchCancel(match) {
            match.homeScore = "";
            match.awayScore = "";
            match.complete = false;

            match.tmpHomeScore = "";
            match.tmpAwayScore = "";
            
            this.axios.put("/matches/"+match.id+"/cancel").then(res => {
                console.log(res);

                this.axios.get("/participants/search?league="+this.id).then(res => {
                    this.participants = res.data.content;
                    this.participants.sort(this.compareMatch);


                    this.participants.forEach(participant => {
                        this.axios.get("/teams/"+participant.teamId).then(res=> {
                            participant.team = res.data;
                        });
                        this.getRecentResult(participant, 5);
                    });
                })
            });
        },

        randomMatch(match) {
            const homeStat = this.getTeamData(match.homeId, "stat");
            const awayStat = this.getTeamData(match.awayId, "stat");

            let homeScore = 0;
            let awayScore = 0;

            while (homeScore < 2 && awayScore < 2) {
                let r = Math.floor(Math.random() * (homeStat + awayStat));

                if (r < homeStat) homeScore++;
                else awayScore++;
            }

            match.tmpHomeScore = homeScore;
            match.tmpAwayScore = awayScore;
        }
        
    },
    mounted() {
        this.axios.get("/leagues/"+this.id).then(res => {
            this.league = res.data;
        });

        this.axios.get("/participants/search?league="+this.id).then(res => {
            this.participants = res.data.content;

            this.participants.sort(this.compareMatch);

            this.participants.forEach(participant => {
                this.axios.get("/teams/"+participant.teamId).then(res=> {
                    participant.team = res.data;
                });

                this.getRecentResult(participant, 5);
            });
        })

        this.axios.get("/matches/search?league="+this.id).then(res => {
            this.matches = res.data.content;

            this.matches.forEach(match => {
                if (match.homeScore < 0 || match.awayScore < 0) {
                    match.complete = false;
                } else {
                    match.complete = true;
                }
                
                if (match.homeScore < 0) {
                    match.homeScore = "";
                }

                if (match.awayScore < 0) {
                    match.awayScore = "";
                }

                match.tmpHomeScore = "";
                match.tmpAwayScore = "";
            });
        });
        
    },

    watch: {
    }
}
</script>

<template>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap" rel="stylesheet">

    <div class="row p-0" style="height: 800px; border-top: 1px solid #0d0d0d;">
        <!-- side page -->
        <div class="col-3 p-0 side">
            <div class="league-info">
                <div class="col-12">
                    <img src="@/assets/img/worlds_logo.png">
                </div>
                <div class="col-12 my-2">
                    <h2 class="title">league Title</h2>
                </div>
            </div>
            <div class="col-12 my-auto pt-1 mt-5 title">
                <h5>STANDING</h5>
            </div>
            <div class="table-head main col-12 row mx-0 my-1 text" style="text-align: center;">
                <div class="col-3">R</div>
                <div class="col-3">T</div>
                <div class="col-3">W - L</div>
                <div class="col-3">P</div>
            </div>
            <div v-for="participant in participants" :key="participant.id" 
                class="table-head col-12 row mx-0 my-1 text" 
                style="text-align: center;">
                <div class="col-3">{{ participant.rank }}</div>
                <div class="col-1 p-0"><img src="@/assets/img/lck.png"></div>
                <div class="col-2">{{ participant.team.shortName }}</div>
                <div class="col-3">{{ participant.win }} - {{ participant.loss }}</div>
                <div class="col-3">{{ (participant.setWin - participant.setLoss > 0) ? "+" : "" }}{{ participant.setWin - participant.setLoss }}</div>
            </div>
        </div>

        <!-- main page -->
        <div class="col-9 p-0 main">
            <!-- navigation -->
            
            <nav id="navar" class="navbar navbar-expand-lg navbar-dark">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Main</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#standing">Standing</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#match">Match</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#">Playoff</a>
                        </li>
                    </ul>
            </nav>

            <!-- main container-->
            <div data-bs-spy="scroll" data-bs-target="#navbar" data-bs-offset="0" class="scrollspy-example" tabindex="0">
            <!-- Teams -->
            <div class="col-12 row">
                <div class="col-12 text m-3">
                    <h4>Teams</h4>
                </div>
                <div class="row mx-3">
                    <div v-for="participant in participants" :key="participant.id" class="col-1 title">
                        <div style="line-height:65px;" class="m-1"><img src="@/assets/img/lck.png"></div>
                        <h5>{{ participant.team.name }}</h5>
                    </div>
                </div>
            </div>
            
            <!-- recent matches -->
            <div class="col-12 text m-3">
                    <h4>Recent Matches</h4>
            </div>
            <div class="row" style="line-height: 50px;">
                <div class="col-2 title my-auto" style="text-align: right;">2022.10.11 5PM</div>
                <div class="col-10 row side text mx-3 my-3 match" style="width: 640px; border-radius: 10px;">
                    <div class="col-1"></div>
                    <div class="col-3" style="text-align: right;">Afreeca Freecs</div>
                    <div class="col-1"><img src="@/assets/img/1.png"></div>
                    <div class="col-1 m-1 main title" style="border-radius: 10px; font-size: 30px;">2</div>
                    <div class="col-1 m-1 main title" style="border-radius: 10px; font-size: 30px;">0</div>
                    <div class="col-1"><img src="@/assets/img/t1.png"></div>
                    <div class="col-3">T1</div>
                </div>
            </div>
            <div class="row" style="line-height: 50px;">
                <div class="col-2 title my-auto" style="text-align: right;">2022.10.11 5PM</div>
                <div class="row side text mx-3 my-3 match" style="width: 640px; border-radius: 10px;">
                    <div class="col-1"></div>
                    <div class="col-3" style="text-align: right;">Afreeca Freecs</div>
                    <div class="col-1"><img src="@/assets/img/1.png"></div>
                    <div class="col-1 m-1 main title" style="border-radius: 10px; font-size: 30px;">3</div>
                    <div class="col-1 m-1 main title" style="border-radius: 10px; font-size: 30px;">1</div>
                    <div class="col-1"><img src="@/assets/img/t1.png"></div>
                    <div class="col-3">T1</div>
                </div>
            </div>

            <!-- standing -->
            <div id="standing" class="col-12 text m-3">
                    <h4>Standing</h4>
            </div>
            <div class="col-12 row">
                <div class="col-3 standing-side row">
                    <div class="col-12 my-auto">
                        <h1 class="title md-1" style="color:white;">45 / 90</h1>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-9">
                    <div class="table-head main col-12 row mx-0 my-1 text" style="text-align: center; border-bottom: 1px solid black;">
                        <div class="col-3" style="width: 50px;">R</div>
                        <div class="col-3" style="width: 150px;">TEAM</div>
                        <div class="col-3" style="width: 150px;">MATCH</div>
                        <div class="col-3" style="width: 150px;">SET</div>
                        <div class="col-3" style="width: 50px;">Pt</div>
                        <div class="col-3" style="width: 150px;">최근5경기</div>
                        <div class="col-3" style="width: 50px;">STREAK</div>
                    </div>
                    <div v-for="participant in participants" :key="participant.id" 
                        class="table-head col-12 row mx-0 my-1 text" 
                        style="text-align: center; line-height: 50px; border-bottom: 1px solid black;">
                        <div class="col-3" style="width: 50px;">{{ participant.rank }}</div>
                        <div class="col-3" style="width: 60px;"><img src="@/assets/img/lck.png"></div>
                        <div class="col-3" style="width: 90px; text-align: left; font-size: 18px;">{{ participant.team.shortName }}</div>
                        <div class="col-3" style="width: 150px;">{{ participant.win }}W {{ participant.loss }}L</div>
                        <div class="col-3" style="width: 150px;">{{ participant.setWin }} - {{ participant.setLoss }}</div>
                        <div class="col-3" style="width: 50px;">
                            {{ (participant.setWin - participant.setLoss > 0) ? "+" : "" }}{{ participant.setWin - participant.setLoss }}
                        </div>
                        <div class="col-3" style="width: 150px;">{{ participant.recentWin }}W {{ participant.recentLoss }}L</div>
                        <div class="col-3" style="width: 50px;">{{ participant.streak }}</div>
                    </div>
                </div>
            </div>

            <!-- matches list-->
            <div id="match" class="col-12 text m-3">
                    <h4>Match</h4>
            </div>
            <div v-for="match in matches" :key="match.id" class="accordion accordion-flush m-5 row side" id="accordionFlushExample">
                <div class="col-10 row">
                    <div class="col-12 m-2 row text">
                        <div class="col-1 my-auto"><img src="@/assets/img/lck.png"></div>
                        <div class="col-8">
                            <h5>{{ getTeamData(match.homeId, "name") }}</h5>
                            {{ getTeamData(match.homeId, "rank") }}위 {{ getTeamData(match.homeId, "win") }}W {{ getTeamData(match.homeId, "loss") }}L    
                        </div>
                        <div class="col-3 title my-auto"><h5>{{ match.homeScore }}</h5></div>
                    </div>
                    <div class="col-12 m-2 row text">
                        <div class="col-1 my-auto"><img src="@/assets/img/lck.png"></div>
                        <div class="col-3">
                            <h5>{{ getTeamData(match.awayId, "name") }}</h5>
                            {{ getTeamData(match.awayId, "rank") }}위 {{ getTeamData(match.awayId, "win") }}W {{ getTeamData(match.awayId, "loss") }}L    
                        </div>
                        <div class="col-5"><h5><span class="badge bg-primary">win</span></h5></div>
                        <div class="col-3 title my-auto"><h5>{{ match.awayScore }}</h5></div>
                    </div>
                </div>
                <div class="col-2 my-auto title">
                    <h5>{{ match.matchDate.split('T')[0] }}</h5>
                    <h5>5PM</h5>
                </div>
                <div class="accordion-item m-3 col-12 row">
                    <div class="col-2">Round {{ match.round }}</div>
                    <p class="accordion-header col-10" id="flush-headingOne">
                        <a class="collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#flush-collapse${match.id}`" aria-expanded="false" aria-controls="flush-collapseOne">
                            Edit
                        </a>
                    </p>
                    <div :id="`flush-collapse${match.id}`" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                        <div class="accordion-body main row">
                            <div class="col-12 m-2 row text">
                                <div class="col-1 my-auto"><img src="@/assets/img/lck.png"></div>
                                <div class="col-7">
                                    <h5>{{ getTeamData(match.homeId, "name") }}</h5>
                                    {{ getTeamData(match.homeId, "rank") }}위 {{ getTeamData(match.homeId, "win") }}W {{ getTeamData(match.homeId, "loss") }}L
                                </div>
                                <div class="col-4 title my-auto"><input v-model="match.tmpHomeScore"></div>
                            </div>
                            <div class="col-12 m-2 row text">
                                <div class="col-1 my-auto"><img src="@/assets/img/lck.png"></div>
                                <div class="col-7">
                                    <h5>{{ getTeamData(match.awayId, "name") }}</h5>
                                    {{ getTeamData(match.awayId, "rank") }}위 {{ getTeamData(match.awayId, "win") }}W {{ getTeamData(match.awayId, "loss") }}L
                                </div>
                                <div class="col-4 title my-auto"><input v-model="match.tmpAwayScore"></div>
                            </div>
                            <div class="col-12 m-2">
                                <button class="collapsed btn-main" @click="putMatch(match)" type="button" data-bs-toggle="collapse" :data-bs-target="`#flush-collapse${match.id}`">확인</button>
                                <button class="btn-side" @click="randomMatch(match)">랜덤</button>
                                <button class="collapsed btn-side" type="button" data-bs-toggle="collapse" :data-bs-target="`#flush-collapse${match.id}`">취소</button>
                                <button class="collapsed btn-side" @click="putMatchCancel(match)" type="button" data-bs-toggle="collapse" :data-bs-target="`#flush-collapse${match.id}`">Clear</button>
                            </div>
                        </div>
                    </div>
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
    font-family: 'Roboto Condensed', sans-serif;
}
.main {
    background-color: #202022;   
    color: white;
}
.side {
    background-color: #262626;
    color: white;
}

.accordion {
    border-radius: 4px;
}

.accordion-item {
    background-color: #262626;
    border: 0;
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
    font-family: 'Roboto Condensed', sans-serif;

}

.match {
    font-size: 20px;
}

.text {
    font-weight: bold;
    font-family: 'Roboto Condensed', sans-serif;

}

.league-info {
}
img {
    width: 100%;
    border-radius: 2px;
}
</style>