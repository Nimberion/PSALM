<template>
	<!-- bg-gradient-to-br from-info-400 via-warning to-secondary  -->
	<div class="min-w-[100vw] min-h-screen bg-secondary bg-custom-gradient">
		<!-- HOME BUTTON -->
		<button v-if="$route.name !== 'Home'" to="/" class="absolute top-0 left-0 bg-white shadow-lg border-b border-r rounded-br text-[1.5rem] p-2" @click="$router.push('/')">
			<PsalmIcon name="home" />
		</button>
		<div>
			<router-view v-if="!loading" class="p-2" />
		</div>
		<!-- LOADING SCREEN -->
		<div v-if="loading" class="grid place-items-center absolute top-0 left-0 min-h-screen min-w-[100vw] bg-primary z-50">
			<div class="grid place-items-center text-white text-center">
				<img class="h-[30vh] shadow-lg" src="@/../src-tauri/icons/icon.png" alt="logo" />
				<h1 class="text-[15vh] font-black leading-none">PSALM</h1>
				<h3 class="text-[3vh]">Project Staff And Labor Management</h3>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import { readTextFile, createDir, readDir } from "@tauri-apps/api/fs";
	import { Employee } from "@/models/interfaces/Employee";
	import store from "@/store/index";
	import { pathExists } from "@/utils/utils";
	import { Project } from "./models/interfaces/Project";
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
					setTimeout(() => {
						this.loading = false;
					}, 1000);
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

<style scoped>
	.bg-custom-gradient {
		background-image: repeating-linear-gradient(-25deg, transparent, transparent 80px, rgba(255, 255, 255, 0.2) 80px, rgba(255, 255, 255, 0.2) 100px),
			repeating-linear-gradient(10deg, transparent, transparent 80px, rgba(255, 255, 255, 0.2) 80px, rgba(255, 255, 255, 0.2) 100px), linear-gradient(to bottom right, #86bbd8, #f6ae2d, #f26419);
		background-size: 100% 100%, 100% 100%, 100% 100%;
		background-position: 0 0, 0 0, 0 0;

		background-repeat: no-repeat;

		/* radial-gradient(circle closest-side, rgba(255, 255, 255, 0.3) 100%, transparent 10%),
		radial-gradient(circle closest-side, rgba(255, 255, 255, 0.3) 100%, transparent 10%),
		radial-gradient(circle closest-side, rgba(255, 255, 255, 0.3) 100%, transparent 10%),

		28vw 28vh, 33vw 33vh, 38vw 38vh,

		12vw 8vh, 65vw 40vh, 25vw 55vh, */
	}
</style>
