<script>
export default {
    data() {
        return {
            datas: [{
                name: "",
                shortName: "",
                stat: 0,
            }],
            data: {
                name: "",
                shortName: "",
                stat: 0,
            }
        }
    },
    methods: {
        submitForm() {
            this.axios.post("/teams", this.data).then(res => {
                console.log(res);
            }).catch(e => {
                console.log(e);
                alert(e.response.data.msg);
                this.data = {
                    name: "",
                    shortName: "",
                    stat: 0,
                };

            })
        },
        addForm() {
            this.datas.push({
                name: "",
                shortName: "",
                stat: 0,
            });
        }
    }
}
</script>

<template>
    <form @submit.prevent="submitForm" class="row g-3 m-3">
        <div class="col-md-6">
            <input id="teamName" v-model="data.name" type="text" class="form-control">
        </div>
        <div class="col-md-3">
            <input id="teamShortName" v-model="data.shortName" type="text" class="form-control">
        </div>
        <div class="col-md-1">
            <input id="teamStat" v-model="data.stat" type="text" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary col-md-1">Create</button>
    </form>
</template>