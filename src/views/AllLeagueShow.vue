<script>
import LeagueCard from '@/components/LeagueCard.vue';
export default {
    components: {
        LeagueCard
    },
    data() {
        return {
            leagues: [],
            search: "",
            showLeagues: [],
        }
    },
    methods: {
        getLeagues() {
            this.axios.get("/leagues").then((res) => {
                this.leagues = res.data.content;
                this.showLeagues = this.leagues;
            });
        },

        searchLeagues() {
            if (this.search.length < 2) {
                alert("2글자 이상 입력해주세요");
                this.search = "";
                return;
            }

            this.showLeagues = this.leagues.filter( league => league.title.toUpperCase().includes(this.search.toUpperCase()));
        }
    },
    mounted() {
        this.axios.get("/leagues").then((res) => {
            this.leagues = res.data.content;
            this.showLeagues = this.leagues;
        });
    }
}
</script>

<template>
    <div class="row">
        <div class="col-2 sub">
            계정정보
        </div>
        <div class="col-10 p-0 main">
            <div class="sub">
            <nav id="navar" class="navbar navbar-expand-lg navbar-dark">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                        <a class="nav-link active" aria-current="page" @click="getLeagues()">All League</a>
                        </li>
                        <input class="form-control mx-3 mw-5" type="search" placeholder="Search" aria-label="Search" v-model="search" style="width: 520px;">
                        <button class="btn btn-outline-success me-3" @click="searchLeagues()">Search</button>

                        <a class="btn btn-outline-light" href="/league/add">Add League</a>
                    </ul>
            </nav>
            </div>

            <div class="main" style="height: 700px; overflow-y: scroll;">
                <h5 v-if="showLeagues.length === 0" class="m-3">No Leagues</h5>
                <template v-for="league in showLeagues" :key="league.title">
                    <LeagueCard :league="league" class="m-3"/>
                </template>
            </div>
        </div>
        
    </div>
    
</template>

<style scoped>

.main {
    color: white;
    background-color: #202022; 
    font-family: 'Fjalla One', sans-serif;;
}

.sub {
    color: white;
    background-color: #262626;
}

</style>
