<script>
export default {
    props: {
        id: String,
    },
    data() {
        return {
            team: {
                name: "",
                shortName: "",
                stat: 0,
            },
        }
    },
    methods: {
        getTeam() {
            this.axios.get("/teams/"+this.id).then(res => {
                this.team = res.data;
            })
        },
        putTeam() {
            this.axios.put("/teams/"+this.id, this.team).then(res => {
                console.log(res);
                this.$router.push({ path: `/team/${this.team.id}/${this.team.shortName}` });
            }).catch( e => {
                console.log(e);
                alert(e.response.data.msg);
            });
        }
        
    },
    mounted() {
        this.getTeam();
    },
    
}
</script>

<template>
    <div class="card m-3 big-card" style="width: 50rem;">
        <img src="@/assets/img/1.png" class="card-img-top" style="height:160px; width:fit-content">
        <form @submit.prevent="putTeam">
        <div class="card-body">            
            <div class="input-group input-group-lg mb-3">
                <input 
                    type="text"
                    v-model="team.shortName" 
                    class="form-control" aria-label="short name input" aria-describedby="short-name-input">
            </div>
            <div class="input-group input-group mb-3">
                <input 
                    type="text" 
                    v-model="team.name"
                    class="form-control" aria-label="name input" aria-describedby="name-input">
            </div>
            <div class="input-group input-group">
                <input 
                    type="text" 
                    v-model="team.stat"
                    class="form-control" aria-label="stat input" aria-describedby="stat-input">
            </div>

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
            <button type="submit" class="btn btn-success card-link">Complete</button>
        </div>
        </form>
    </div>
</template>

<style scoped>
.big-card {
    border:0ch;
}
</style>