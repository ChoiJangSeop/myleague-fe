<script>
export default {
    props: {
        league: Object,
    },
    methods: {
        parsingDate(date) {
            date = date.replace('-', '.').replace('-','.');
            return date.split(' ')[0];
        },
    }
}
</script>

<template>
    <div class="col-9 row m-3" style="border-radius: 5px; border: 2px solid #262626; box-shadow: 5px 5px black;">
            <div class="col-2 sub">
                <img src="@/assets/img/lck.png" class="img-thumbnail align-items-center sub" alt="..." style="border: 0;">
            </div>
            <div class="col-10 my-auto row">
                <h3 style="font-weight: bold;">{{ league.title }}</h3>
                <div class="col-10">
                <p class="mb-2">{{ parsingDate(league.startedDate) }} ~ {{ parsingDate(league.endDate) }}</p>
                <a :href="`/league/${this.league.id}/${this.league.title}`" class="btn btn-dark" style="border: 1px solid black;">Go Detail</a>
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

img {
    width: 100%;
    border-radius: 2px;
}

</style>