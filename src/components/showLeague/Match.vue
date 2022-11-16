<script>
export default {
    props: {
        match: Object,
    }
    
}
</script>

<template>
    <div class="accordion m-5 row side" id="accordionPanelsStayOpenExample">
        <div class="col-10 row">
            <div class="col-12 m-2 row text">
                <div class="col-1 my-auto"><img src="@/assets/img/1.png"></div>
                <div class="col-8"><h5>Afreeca Freecs</h5>1위 2W 0L</div>
                <div class="col-3 title my-auto"><h5>1</h5></div>
            </div>
            <div class="col-12 m-2 row text">
                <div class="col-1 my-auto"><img src="@/assets/img/t1.png"></div>
                <div class="col-3"><h5>T1</h5>2위 1W 0L</div>
                <div class="col-5"><h5><span class="badge bg-primary">win</span></h5></div>
                <div class="col-3 title my-auto"><h5>2</h5></div>
            </div>
            <div class="accordion-item m-3 col-12 row">
                <div class="col-2">Round 1</div>
                <p class="accordion-header col-10" id="panelsStayOpen-headingOne">
                <a type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                    Edit
                </a>
                </p>
                <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show m-2" aria-labelledby="panelsStayOpen-headingOne">
                    <div class="accordion-body main row">
                        <div class="col-12 m-2 row text">
                            <div class="col-1 my-auto"><img src="@/assets/img/1.png"></div>
                            <div class="col-7"><h5>Afreeca Freecs</h5>1위 2W 0L</div>
                            <div class="col-4 title my-auto"><input></div>
                        </div>
                        <div class="col-12 m-2 row text">
                            <div class="col-1 my-auto"><img src="@/assets/img/t1.png"></div>
                            <div class="col-7"><h5>T1</h5>2위 1W 0L</div>
                            <div class="col-4 title my-auto"><input></div>
                        </div>
                        <div class="col-12 m-2">
                            <button class="btn-main">확인</button>
                            <button class="btn-side">랜덤</button>
                            <button class="btn-side">취소</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-2 my-auto title">
            <h5>2022.01.01</h5>
            <h5>5PM</h5>
        </div>
    </div>
    
</template>


<style scoped>
nav {
    background-color: #262626;
    height: 40px;
    font-family: 'Roboto Condensed', sans-serif;
}
.main {
    background-color: #202022;   
    color: white;
}
.side {
    background-color: #262626;
    color: white;
}

.accordion {
    border-radius: 4px;
}

.accordion-item {
    background-color: #262626;
    border: 0;
    color: white;
}

.btn-side {
    background-color: #202022;
    border-radius: 5px;
    color: white;
}

.btn-main {
    background-color: #262626;
    border-radius: 5px;
    color: white;
}

.standing-side {
    background-size: 100% 100%;
    background-image: url("@/assets/img/worlds_logo.png");
    opacity: 0.2;
}



.title {
    font-weight: bold;
    text-align: center;
    font-family: 'Roboto Condensed', sans-serif;

}

.match {
    font-size: 20px;
}

.text {
    font-weight: bold;
    font-family: 'Roboto Condensed', sans-serif;

}

.league-info {
}
img {
    width: 100%;
    border-radius: 2px;
}
</style>