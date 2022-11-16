<script>
import LeagueInfo from '@/components/AddLeague/LeagueInfo.vue';
import AddParticiapnt from '@/components/AddLeague/AddParticipant.vue';
export default {
    components: { LeagueInfo, AddParticiapnt },
    data() {
        return {
            step: 1,
        }
    }
    
}
</script>

<template>
    <LeagueInfo v-if="step==1" />
    <AddParticiapnt v-if="step==2"/>
    <button v-if="step>1" class="btn btn-primary m-4" @click="step--">뒤로</button> 
    <button class="btn btn-primary m-4" @click="step++">다음</button>
</template>