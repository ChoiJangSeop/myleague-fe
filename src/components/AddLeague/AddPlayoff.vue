<script>
export default {
    props: {
        id: String,
    },
    data() {
        return {
            league: null,
            playoff: "",
            promotions: 0,
        }
    },
    methods: {
        postPlayoff() {
            this.league.promotions = this.promotions;
            this.league.playoff = this.playoff;

            this.axios.put("/leagues/"+this.id, this.league).then(res => {
                console.log(res);
            });

            this.$router.push({ path: `/league`});
        }
    },
    mounted() {
        this.axios.get("/leagues/"+this.id).then(res => {
            this.league = res.data;
        });
    }
    
}
</script>

<template>
    <h1 class="mx-3 mt-3 md-5">마지막 단계 : 플레이오프 설정</h1> 
    <a href="/league" class="btn btn-danger mx-3 mt-3 md-5">건너뛰기 (플레이오프를 생성하지 않습니다)</a>
    <form @submit.prevent="postPlayoff()" class="row g-3 mx-3 my-5">
        <div class="col-md-1 pull-left my-auto" style="font-weight:bold;">
            <label class="control-label">참가팀</label>
        </div>
        <div class="col-md-2 my-auto">
            <input type="number" v-model="promotions" class="form-control">
        </div>
        
        <div class="col-md-12 m-3"></div> <!--empty container-->
        <div class="col-md-1 pull-left my-auto" style="font-weight:bold;">
            <label class="control-label">방식</label>
        </div>
        <div class="col-md-2 my-auto">
            <select class="form-select" v-model="playoff">
                <option selected value="NONE">방식</option>
                <option value="CHALLENGE_TOURNAMENT">챌린지 토너먼트</option>
                <option value="FULL_LEAGUE">풀리그</option>
                <option value="SINGLE_ELIMINATION">싱글 앨리미네이션</option>
                <option value="DOUBLE_ELIMINATION">더블 앨리미네이션</option>
            </select>
        </div>
        <div class="col-md-12 m-3"></div> <!--empty container-->
        <div class="col-12">
            <button type="submit" class="btn btn-primary">다음으로 (경기생성)</button>
        </div>
    </form>
</template>