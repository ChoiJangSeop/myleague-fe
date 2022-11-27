<script>
import TeamCard from  '@/components/TeamCard.vue';

export default {
    components: { TeamCard },
    data() {
        return {
            teams: [],
            showTeams: [],
            search: "",
            showCommend: "active",
        }
    },
    methods: {
        getTeam() {
            this.axios.get("/teams").then(res => {
                this.teams = res.data.content;
                this.showTeams = this.teams.filter(team => team.activation === 1);
            });
        },

        editShowTeams(commend) {
            this.showCommend = commend;
            
            switch(commend) {
                case "all":
                    this.showTeams = this.teams;
                    break;
                case "active":
                    this.showTeams = this.teams.filter(team => team.activation === 1);
                    break;
                case "inactive":
                    this.showTeams = this.teams.filter(team => team.activation === 0);
                    break;
            }
        },

        searchTeam() {
            if (this.search.length < 2) {
                alert("2글자 이상 입력해주세요");
                this.search = "";
                return;
            }
            this.showTeams = this.teams.filter(team => (team.name.toUpperCase().includes(this.search.toUpperCase()) || team.shortName.toUpperCase().includes(this.search.toUpperCase())));
        }


    },
    mounted() {
        this.getTeam();
    },
}
</script>

<template>
    <div class="row p-0" style="height: 800px; border-top: 1px solid #0d0d0d;">
        <div class="col-2 sub">
            계정정보
        </div>
        <div class="col-10 p-0 main">
            <div class="sub">
            <nav id="navar" class="navbar navbar-expand-lg navbar-dark">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" href="#" @click="editShowTeams('active')">Active Teams</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="#" @click="editShowTeams('all')">All Teams</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" @click="editShowTeams('inactive')">Inactive Teams</a>
                        </li>
                        <input class="form-control mx-3 mw-5" type="search" placeholder="Search" aria-label="Search" v-model="search" style="width: 520px;">
                        <button class="btn btn-outline-success me-3" @click="searchTeam()">Search</button>

                        <a class="btn btn-outline-light" href="/team/add">Add Team</a>
                    </ul>
            </nav>
            </div>

            <div class="main" style="height: 100vh; overflow-y: scroll;">
                <h5 class="m-3" v-if="showTeams.length===0">No Teams</h5>
                <template v-for="team in showTeams" :key="team.id">
                    <TeamCard class="m-3" :team="team" />
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