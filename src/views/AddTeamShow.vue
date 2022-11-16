<script>
import AddTeamForm from './AddTeamForm.vue';
export default {
    components: { AddTeamForm },
    data() {
        return {
            datas: [{
                name: "",
                shortName: "",
                stat: 50,
            },],
        }
    },
    methods: {
        addForm() {
            this.datas.push({
                name: "",
                shortName: "",
                stat: 50,
            })
        },
        cancelAddForm(data) {
            if (this.datas.length === 1) {
                alert("1개 이상의 팀을 추가해야 합니다");
                return;
            }

            const idx = this.datas.indexOf(data);
            this.datas.splice(idx, 1);
        },
        postTeams() {
            this.datas.forEach(data => {
                console.log(data);

                this.axios.post("/teams", data).then(res => {
                    console.log(res);
                    this.$router.push({ path: `/team` });
                }).catch(e => {
                    console.log(e);
                    alert(`${data.name}: ${e.response.data.msg}`);
                    this.$router.push({ path: `/team` });
                }) 
            })
        }
    }
}
</script>

<template>
    <h1 class="m-4">팀 생성</h1>
    <button class="btn btn-primary m-4 g-3" v-on:click="addForm">+</button>
    <form class="row ms-3 me-3 g-3">
        <div class="col-md-6">
            <label for="teamName" class="form-label">Team Full Name</label>
        </div>
        <div class="col-md-4">
            <label for="teamShortName" class="form-label">Team Short Name</label>
        </div>
        <div class="col-md-1">
            <label for="teamStat" class="form-label">Team Stat</label>
        </div>
    </form>
    
    <div v-for="data in datas" class="row ms-3 me-3 g-3 mb-3" :key="data._id">
        <div class="col-md-6">
            <input id="teamName" v-model="data.name" type="text" class="form-control">
        </div>
        <div class="col-md-4">
            <input id="teamShortName" v-model="data.shortName" type="text" class="form-control">
        </div>
        <div class="col-md-2 row g-2">
            <div class="col-md-6">
                <input id="teamStat" v-model="data.stat" type="text" class="form-control" disabled>
            </div>
            <div class="btn-group col-md-3" role="group" aria-label="Vertical button group">
                <button @click="data.stat++" type="button" class="btn btn-dark btn-sm">+</button>
                <button @click="data.stat--" type="button" class="btn btn-dark btn-sm">-</button>
            </div>
            <button @click="cancelAddForm(data)" class="btn btn-danger col-md-3">X</button>
        </div>        
    </div>
    <button class="btn btn-success ms-4 g-3" @click="postTeams()">Create</button>
</template>