<script>
import LeagueCard from '@/components/LeagueCard.vue';
export default {
    components: {
        LeagueCard
    },
    data() {
        return {
            leagues: [],
        }
    },
    methods: {
        getLeagues() {
            this.axios.get("/leagues").then((res) => {
                this.leagues = res.data.content;
            });
        }
    },
    mounted() {
        this.getLeagues();
    }
}
</script>

<template>
    <a :href="`/league/add/info`" type="button" class="btn m-3 btn-primary">Add League</a>
    <template v-for="league in leagues" :key="league.title">
        <LeagueCard :league="league" class="m-3"/>
    </template>
</template>