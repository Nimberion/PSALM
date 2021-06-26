<template>
	<div id="app" class="min-w-[600px] p-2 pr-4">
		<div id="nav">
			<router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
			<router-link to="/staff">Mitarbeiter</router-link>
		</div>
		<router-view />
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
			await this.readStaff();
			//console.log((await readDir("")).find((element) => element.name === "data" && element.path === "data"));
		}

		async createDir(): Promise<void> {
			if (!(await pathExists("", "data"))) {
				await createDir("data");
			}

			if (!(await pathExists("data", "data\\projects"))) {
				await createDir("data/projects");
			}
		}

		async readStaff(): Promise<void> {
			if (await pathExists("data", "data\\staff.json")) {
				store.commit("updateStaff", JSON.parse(await readTextFile("data/staff.json")) as Array<Employee>);
			}
		}
	}
</script>

<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}

	#nav {
		padding: 30px;
	}

	#nav a {
		font-weight: bold;
		color: #2c3e50;
	}

	#nav a.router-link-exact-active {
		color: #42b983;
	}
</style>
