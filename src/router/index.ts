import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import ProjectPage from "@/views/ProjectPage.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/project/:id",
		name: "Project",
		component: ProjectPage,
	},
];

const router = new VueRouter({
	mode: "hash", //default was "history"
	base: process.env.BASE_URL,
	routes,
});

export default router;
