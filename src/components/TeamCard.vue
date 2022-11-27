<script>
export default {
    props: {
        team: Object
    },
}
</script>

<template class="row">
        <div class="col-9 row m-3" style="border-radius: 5px; border: 2px solid #262626; box-shadow: 5px 5px black;">
            <div class="col-2 sub">
                <img src="@/assets/img/1.png" class="img-thumbnail align-items-center sub" alt="..." style="border: 0;">
            </div>
            <div class="col-10 my-auto row">
                <div class="col-2 my-auto"><h1 style="font-weight: bold; text-align:center;">{{ team.shortName }}</h1></div>
                <div class="col-10">
                <h5 class="mb-2">{{ team.name }}</h5>
                <a :href="`/team/${team.id}/${team.shortName}`" class="btn btn-dark" style="border: 1px solid black;">Go Detail</a>
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