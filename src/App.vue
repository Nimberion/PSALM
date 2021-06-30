<template>
	<div class="min-w-[100vw] grid grid-rows-[auto,1fr] bg-secondary shadow-lg min-h-screen">
		<nav class="grid grid-cols-[auto,auto,auto] gap-2 place-content-center items-center bg-white p-2">
			<router-link to="/" class="px-4">Home</router-link>
			<router-link to="/about" class="px-4">About</router-link>
		</nav>
		<div>
			<router-view class="p-2" />
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

	@Component({
		name: "App",
	})
	export default class App extends Vue {
		staff: Array<Employee> = [];

		async created(): Promise<void> {
			await this.createDir();
			await this.readStaffJSON();
			await this.readProjectsJSON();
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

		// async readDoodleTXT(): Promise<void> {
		// 	if (await pathExists("data", "data\\doodle.txt")) {
		// 		console.log(await readBinaryFile("data/doodle.txt"));
		// 	}
		// }
	}
</script>
