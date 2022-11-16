<script>
export default {
    props: {
        teamId: String,
        participantId: String,
    },

    data() {
        return {
            participant: {
                name: "",
                shortName: ""
            }

        }
    },

    methods: {

        deleteParticipant() {
            this.axios.delete("/participants/"+this.participantId);
        }
    },

    mounted() {
        this.axios.get("/teams/"+this.teamId).then(res => {
            console.log("ParticipantCare.vue mount : " + res.data);

            this.participant.name = res.data.name;
            this.participant.shortName = res.data.shortName;
        })
    }
    
}
</script>

<template>
    <div class="col-md-2" style="height:100%;">
        <img src="@/assets/img/1.png" class="img-fluid rounded-start my-auto p-1" style="height: 100%;">
    </div>
    <div class="col-md-10">
        <div class="card-body row">
            <h5 class="card-title col-md-3">{{ participant.shortName }}</h5>
            <p class="col-md-8">{{ participant.name }}</p>
        </div>
    </div>
    
</template>