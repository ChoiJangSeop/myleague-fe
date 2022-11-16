import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import AllTeamShow from '@/views/AllTeamShow.vue';
import AllLeagueShow from '@/views/AllLeagueShow.vue';
import AddTeamShow from '@/views/AddTeamShow.vue';
import AddLeagueInfo from '@/components/AddLeague/AddLeagueInfo.vue';


const routes = [
    { path: "/", name: "home", component: Home },
    { path: "/team", name: "allTeams", component: AllTeamShow },
    { path: "/league", name: "allLeauges", component: AllLeagueShow },
    { path: "/team/add", name: "addTeam", component: AddTeamShow },
    { path: "/league/add/info", name: "addLeagueInfo", component: AddLeagueInfo },
    { 
        path: "/league/add/:id/participants", 
        name: "addLeagueParticipants", 
        component: ()=>import('@/components/AddLeague/AddParticipant.vue'),
        props: route => ({ id: route.params.id }),

    },
    {
        path: "/league/add/:id/schedule",
        name: "addLeagueSchedule",
        component: () => import('@/components/AddLeague/AddSchedule.vue'),
        props: route => ({ id: route.params.id }),
    },
    {
        path: "/league/add/:id/playoff",
        name: "addLeaguePlayoff",
        component: () => import('@/components/AddLeague/AddPlayoff.vue'),
        props: route => ({ id: route.params.id }),
    },
    {
        path: "/league/:id/:name",
        name: 'league.show',
        component: () => import('@/views/LeagueShow.vue'),
        props: route => ({ id: route.params.id }),
    },
    {
        path: '/team/:id/:name',
        name: 'team.show',
        component: ()=>import('@/views/TeamShow.vue'),
        props: route => ({ id: route.params.id }),
    },
    {
        path: '/team/:id/:name/edit',
        name: 'team.edit',
        component: ()=>import('@/views/EditTeamShow.vue'),
        props: route => ({id: route.params.id}),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'myleauge-active-link'
})

export default router