<script>
export default {
    props: {
        team: Object
    },
}
</script>

<template>
    <div class="card text-bg-light m-3" style="max-width: 25rem;">
        <div class="card-header">{{ team.shortName }}</div>
        <div class="card-body row">
            <div class="col-4">
                <img src="@/assets/img/1.png" class="img-thumbnail align-items-center" alt="...">
            </div>
            <div class="col-8">
                <h5 class="card-title mb-2">{{ team.name }}</h5>
                <a :href="`/team/${team.id}/${team.shortName}`" class="btn btn-primary">Go Detail</a>
            </div>
        </div>
    </div>
</template>