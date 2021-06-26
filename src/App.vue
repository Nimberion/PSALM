<template>
	<div id="app">
		<div id="nav">
			<router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
			<router-link to="/staff">Mitarbeiter</router-link>
		</div>
		<router-view />
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import { writeFile, readTextFile, createDir, readDir } from "@tauri-apps/api/fs";
	import { Employee } from "./interfaces/Employee";

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
			if ((await readDir("")).find((element) => element.path === "data") === undefined) {
				await createDir("data");
			}

			if ((await readDir("data")).find((element) => element.path === "data\\projects") === undefined) {
				await createDir("data/projects");
			}
		}

		async readStaff(): Promise<void> {
			if ((await readDir("data")).find((element) => element.path === "data\\staff.json")) {
				this.staff = JSON.parse(await readTextFile("data/staff.json")) as Array<Employee>;
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
