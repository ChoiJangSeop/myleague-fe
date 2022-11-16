<script>
export default {
    props: {
        league: Object,
    },
    methods: {
        parsingDate(date) {
            date = date.replace('-', '.').replace('-','.');
            return date.split(' ')[0];
        }
    }
}
</script>

<template>
    <div class="card" style="max-width: 50rem;">
        <div class="card-body">
            <h5 class="card-title">{{ league.title }}</h5>
            <p class="card-text" v-if="league.startedDate != null">
                {{ parsingDate(league.startedDate) }} ~ {{ parsingDate(league.endDate) }}
            </p>
            <p class="card-text" v-if="league.startedDate === null">
                
            </p>

            <a :href="`/league/${this.league.id}/${this.league.title}`" class="btn btn-primary">Go Detail</a>
        </div>
    </div>
</template>