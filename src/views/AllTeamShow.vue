<script>
import TeamCard from  '@/components/TeamCard.vue';

export default {
    components: { TeamCard },
    data() {
        return {
            teams: [],
        }
    },
    methods: {
        getTeam() {
            this.axios.get("/teams").then(res => {
                this.teams = res.data.content;
            });
        }
    },
    mounted() {
        this.getTeam();
    },
}
</script>

<template>
    <a :href="`/team/add`" type="button" class="btn m-3 btn-primary">Add Team</a>
    <template v-for="team in teams" :key="team.id">
        <TeamCard :team="team" />
    </template>
</template>