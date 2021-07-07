<template>
	<div class="min-w-[100vw] bg-gradient-to-br from-info via-warning to-secondary min-h-screen">
		<!-- HOME BUTTON -->
		<button v-if="$route.name !== 'Home'" to="/" class="absolute top-0 left-0 bg-white shadow-lg border-b border-r rounded-br text-[1.5rem] p-2" @click="$router.push('/')">
			<PsalmIcon name="home" />
		</button>
		<!-- <nav class="grid grid-cols-[auto,auto,auto] gap-2 place-content-center items-center bg-white p-2">
			<router-link to="/" class="px-4">Home</router-link>
			<router-link to="/about" class="px-4">About</router-link>
		</nav> -->
		<div>
			<router-view v-if="!loading" class="p-2" />
		</div>
		<!-- LOADING SCREEN -->
		<div v-if="loading" class="grid place-items-center absolute min-h-screen min-w-[100vw] bg-primary z-50">
			<h1 class="text-4xl text-white text-center">LOADING...</h1>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import { readTextFile, createDir, readDir } from "@tauri-apps/api/fs";
	import { Employee } from "@/interfaces/Employee";
	import store from "@/store/index";
	import { pathExists } from "@/utils";
	import { Project } from "./interfaces/Project";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";

	@Component({
		name: "App",
		components: { PsalmIcon },
	})
	export default class App extends Vue {
		loading = true;

		async created(): Promise<void> {
			Promise.allSettled([await this.createDir(), await this.readStaffJSON(), await this.readProjectsJSON()])
				.then((results) => {
					results.forEach((result) => {
						if (result.status === "rejected") {
							window.alert(`Error! \n${result.reason}`);
						}
					});
				})
				.finally(() => {
					this.loading = false;
				});
		}

		async createDir(): Promise<void> {
			if (!(await pathExists("", "data\\projects"))) {
				await createDir("data/projects", { recursive: true });
			}
		}

		async readStaffJSON(): Promise<void> {
			if (await pathExists("data", "data\\staff.json")) {
				store.commit("updateStaff", JSON.parse(await readTextFile("data/staff.json")) as Array<Employee>);
			}
		}

		async readProjectsJSON(): Promise<void> {
			const projectsDir = await readDir("data\\projects");
			const projects: Map<string, Project> = new Map();

			for (let i = 0; i < projectsDir.length; i++) {
				const filename: string = projectsDir[i].name?.split(".json")[0] as string;
				projects.set(filename, JSON.parse(await readTextFile(`data/projects/${filename}.json`)));
			}
			store.commit("updateProjects", projects);
		}
	}
</script>

<style>
	.button-hover:hover {
		background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
	}
	.background-gradient {
		background-image: linear-gradient(primary, rgba(0, 0, 0, 0.1));
	}
</style>
