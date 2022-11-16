<script>
import ParticipantCard from '@/components/AddLeague/ParticipantCard.vue';
export default {
    components: { ParticipantCard },
    props: {
        id: String,
    }, 
    data() {
        return {
            league: {},
            noParticipateTeams: [],
            participants: [],
            participateTeams: [],

        }
    },
    methods: {

        getNoParticipateTeams() {
            this.axios.get("/teams").then(res => {
                this.noParticipateTeams = res.data.content;
                
                this.axios.get("/participants/search?league="+this.id).then(res => {
                    res.data.content.forEach(participant => {
                        this.axios.get("/teams/"+participant.teamId).then(res => {
                            this.participants.push(res.data);
                            this.noParticipateTeams = this.noParticipateTeams.filter(team => this.participants
                                .filter(participant => (participant.id === team.id)).length === 0)
                        })
                    })
                })

            })
        },

        postParticipant(teamId) {

            this.noParticipateTeams = this.noParticipateTeams.filter(team => team.id !== teamId);

            this.axios.post("/participants", {
                leagueId: this.id,
                teamId: teamId
            }).then(res => {
                this.participants.push(res.data);
            })
        },

        removeParticipant(participantId, teamId) {

            this.axios.delete("/participants/" + participantId).then(res => {
                console.log(res);
            })
            this.participants = this.participants.filter(participant => participant.id !== participantId);

            this.axios.get("/teams/" + teamId).then(res => {
                this.noParticipateTeams.push(res.data);
            })
        }
    },
    mounted() {
        this.axios.get("/leagues/"+this.id).then(res => {
            this.league = res.data;
        })

        this.axios.get("/teams").then(res => {
            this.noParticipateTeams = res.data.content;
            this.axios.get("/participants/search?league="+this.id).then(res => {

                this.participants = res.data.content;

                res.data.content.forEach(participant => {
                    this.noParticipateTeams = this.noParticipateTeams.filter(team => team.id !== participant.teamId);
                })
            });
        })
        

    },
}
</script>

<template>
    <div class="row">
        <div class="col-5">
            <h1 class="m-3">2단계 : 참가팀 추가</h1>
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-primary m-3" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                참가팀 추가
            </button>
            <a :href="`/league/add/${this.id}/schedule`" class="btn btn-success">다음으로</a>
        </div>

        <div class="col-6">
            <h2 class="m-3">{{ league.title }} - 참가팀</h2>
            <div v-for="participant in participants" :key="participant.id" class="card m-3 row g-0" style="height: 60px;">
                <ParticipantCard class="col-11" :teamId="`${participant.teamId}`" :participantId="`${participant.id}`" />
                <button class="btn btn-outline-danger col-1 mx-2" 
                        @click="removeParticipant(participant.id, participant.teamId)" 
                        style="height: 60px;">X</button>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">팀 Team</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h2 v-if="noParticipateTeams.length===0">팀 없음</h2>
                        <div v-for="team in noParticipateTeams" :key="team.id" class="row m-1">
                            <h2 class="col-md-9">{{ team.name }}</h2>
                            <button class="btn btn-light col-md-3" @click="postParticipant(team.id)">+</button>
                        </div>
                    </div>
                    <div class="modal-footer">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>