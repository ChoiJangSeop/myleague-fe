<script>
export default {
    props: {
        id: String,
    },
    data() {
        return {
            team: null,
            players: [],
        }
    },
    methods: {
        getTeam() {
            this.axios.get("/teams/"+this.id).then(res => {
                this.team = res.data;
                console.log(res.data);

                this.axios.get(this.team.links.find(link => link.rel === 'players').href)
                    .then(res => {
                        this.players = res.data.content;
                });
            });
        },
        deleteTeam() {
            if (confirm("팀을 삭제하시겠습니까? 삭제시 복구는 불가능합니다") === true) {
                this.axios.delete("/teams/"+this.id).then(res => {
                    console.log(res);
                });
                this.$router.push({ name: 'allTeams' })
            }
        }
    },
    mounted() {
        this.getTeam();
    },
    watch: {
        team: {
            immediate: true,
            handler() {
                this.getTeam();
            }
        }
    }
}
</script>

<template>
    <div class="card m-3 big-card" style="width: 50rem;">
        <img src="@/assets/img/1.png" class="card-img-top" style="height:160px; width:fit-content">
        <div class="card-body">
            <h1 class="card-title">{{ team.shortName }}</h1>
            <h5 class="card-text">{{ team.name }}</h5>
        </div>
        <ul class="list-group list-group-flush row">
            <li v-for="player in players" :key="player.id" class="list-group-item">
                <div class="card" style="width: 18rem;">
                    <div class="card-header mb-3">{{ player.name }}</div>
                    <img src="@/assets/img/basic_img.png" class="card-img-top" alt="...">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">{{ player.position }}</li>
                        <li class="list-group-item">{{ player.stat }}</li>
                    </ul>
                    <div class="card-body">
                        <a href="#" class="card-link">Go Detail</a>
                    </div>
                </div>
            </li>
        </ul>
        <div class="card-body">
            <a :href="`/team/${team.id}/${team.shortName}/edit`" class="btn btn-warning card-link">Edit</a>
            <button v-on:click="deleteTeam" class="btn btn-secondary card-link">Delete</button>
        </div>
    </div>
</template>

<style scoped>
.big-card {
    border:0ch;
}
</style>
