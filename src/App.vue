<template>
	<div class="min-w-[600px] grid grid-rows-[auto,1fr] bg-white shadow-lg">
		<nav class="grid grid-cols-[auto,auto,auto] gap-2 place-content-center items-center p-2">
			<router-link to="/" class="px-4">Home</router-link>
			<router-link to="/about" class="px-4">About</router-link>
		</nav>
		<router-view class="min-h-[calc(100vh-3.5rem)] p-2 bg-blue-400" />
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import { readTextFile, createDir } from "@tauri-apps/api/fs";
	import { Employee } from "@/interfaces/Employee";
	import store from "@/store/index";
	import { pathExists } from "@/utils";

	@Component({
		name: "App",
	})
	export default class App extends Vue {
		staff: Array<Employee> = [];

		async created(): Promise<void> {
			await this.createDir();
			await this.readStaffJSON();
			//console.log((await readDir("")).find((element) => element.name === "data" && element.path === "data"));
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
	}
</script>
