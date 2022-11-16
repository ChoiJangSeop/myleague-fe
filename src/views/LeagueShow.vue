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

        getTeam(teamId) {
            this.axios.get("/teams/"+teamId).then(res => {
                return res.data;
            })
        },

        putMatch(match) {
            match.homeScore = match.tmpHomeScore;
            match.awayScore = match.tmpAwayScore;
            match.tmpHomeScore = "";
            match.tmpAwayScore = "";

            this.axios.put("/matches/"+match.id+"/play", match).then(res => {
                console.log(res);

                this.axios.get("/participants/search?league="+this.id).then(res => {
                    this.participants = res.data.content;

                    this.participants.forEach(participant => {
                        this.axios.get("/teams/"+participant.teamId).then(res=> {
                            participant.team = res.data;
                        });
                    });
                })
            });
        }
        
    },
    mounted() {
        this.axios.get("/leagues/"+this.id).then(res => {
            this.league = res.data;
        });

        this.axios.get("/participants/search?league="+this.id).then(res => {
            this.participants = res.data.content;

            this.participants.forEach(participant => {
                this.axios.get("/teams/"+participant.teamId).then(res=> {
                    participant.team = res.data;
                });
            });
        })

        this.axios.get("/matches/search?league="+this.id).then(res => {
            this.matches = res.data.content;

            this.matches.forEach(match => {
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
                <div class="col-1 p-0"><img src="@/assets/img/1.png"></div>
                <div class="col-2">{{ participant.team.shortName }}</div>
                <div class="col-3">{{ participant.win }} - {{ participant.loss }}</div>
                <div class="col-3">{{ participant.setWin - participant.setLoss }}</div>
            </div>
        </div>

        <!-- main page -->
        <div class="col-9 p-0 main">
            <!-- navigation -->
            <nav class="navbar navbar-expand-lg navbar-dark">
                <div class="container-fluid">
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Main</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="/team">Match</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#">Standing</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#">Playoff</a>
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>

            <!-- Teams -->
            <div class="col-12 row">
                <div class="col-12 text m-3">
                    <h4>Teams</h4>
                </div>
                <div class="row mx-3">
                    <div v-for="participant in participants" :key="participant.id" class="col-1 title">
                        <div style="line-height:65px;" class="m-1"><img src="@/assets/img/1.png"></div>
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
            <div class="col-12 text m-3">
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
                        <div class="col-3" style="width: 150px;">T</div>
                        <div class="col-3" style="width: 150px;">W - L</div>
                        <div class="col-3" style="width: 150px;">S</div>
                        <div class="col-3" style="width: 50px;">P</div>
                        <div class="col-3" style="width: 150px;"></div>
                        <div class="col-3" style="width: 50px;"></div>
                    </div>
                    <div v-for="participant in participants" :key="participant.id" 
                        class="table-head col-12 row mx-0 my-1 text" 
                        style="text-align: center; line-height: 50px; border-bottom: 1px solid black;">
                        <div class="col-3" style="width: 50px;">{{ participant.rank }}</div>
                        <div class="col-3" style="width: 60px;"><img src="@/assets/img/1.png"></div>
                        <div class="col-3" style="width: 90px; text-align: left;">{{ participant.team.shortName }}</div>
                        <div class="col-3" style="width: 150px;">{{ participant.win }}W {{ participant.loss }}L</div>
                        <div class="col-3" style="width: 150px;">{{ participant.setWin }} - {{ participant.setLoss }}</div>
                        <div class="col-3" style="width: 50px;">{{ participant.setWin - participant.setLoss }}</div>
                        <div class="col-3" style="width: 150px;"></div>
                        <div class="col-3" style="width: 50px;">P</div>
                    </div>
                </div>
            </div>

            <!-- matches list-->
            <div class="col-12 text m-3">
                    <h4>Match</h4>
            </div>
            <div v-for="match in matches" :key="match.id" class="accordion accordion-flush m-5 row side" id="accordionFlushExample">
                <div class="col-10 row">
                    <div class="col-12 m-2 row text">
                        <div class="col-1 my-auto"><img src="@/assets/img/1.png"></div>
                        <div class="col-8">
                            <h5>
                                {{ match.homeId }} 팀
                            </h5>
                            1위 
                        </div>
                        <div class="col-3 title my-auto"><h5>{{ match.homeScore }}</h5></div>
                    </div>
                    <div class="col-12 m-2 row text">
                        <div class="col-1 my-auto"><img src="@/assets/img/t1.png"></div>
                        <div class="col-3">
                            <h5>
                                {{ match.awayId }} 팀
                            </h5>
                            2위 1W 0L
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
                                <div class="col-1 my-auto"><img src="@/assets/img/1.png"></div>
                                <div class="col-7"><h5>{{ match.homeId }} 팀</h5>1위 2W 0L</div>
                                <div class="col-4 title my-auto"><input v-model="match.tmpHomeScore"></div>
                            </div>
                            <div class="col-12 m-2 row text">
                                <div class="col-1 my-auto"><img src="@/assets/img/t1.png"></div>
                                <div class="col-7"><h5>{{ match.awayId }} 팀</h5>2위 1W 0L</div>
                                <div class="col-4 title my-auto"><input v-model="match.tmpAwayScore"></div>
                            </div>
                            <div class="col-12 m-2">
                                <button class="btn-main" @click="putMatch(match)">확인</button>
                                <button class="btn-side">랜덤</button>
                                <button class="btn-side">취소</button>
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