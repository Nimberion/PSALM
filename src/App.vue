<template>
	<!-- bg-gradient-to-br from-info-400 via-warning to-secondary  -->
	<div class="w-screen min-h-screen bg-secondary bg-custom-gradient">
		<!-- HOME BUTTON -->
		<button v-if="$route.name !== 'Home'" to="/" class="absolute top-0 left-0 bg-white shadow-lg border-b border-r rounded-br text-[1.5rem] p-2" @click="$router.push('/')" title="Startseite">
			<PsalmIcon name="home" />
		</button>
		<div>
			<router-view v-if="!loading" class="" />
		</div>
		<!-- LOADING SCREEN -->
		<div v-if="loading" class="grid place-items-center absolute top-0 left-0 min-h-screen min-w-[100vw] bg-primary z-50">
			<div class="grid place-items-center text-white text-center">
				<img class="h-[30vh] shadow-lg" src="@/../src-tauri/icons/icon.png" alt="logo" />
				<h1 class="text-[15vh] font-black leading-none">PSALM</h1>
				<h3 class="text-[3vh]">Project Staff And Labor Management</h3>
			</div>
		</div>
		<!-- SAVED TOAST -->
		<transition name="slide">
			<div v-if="toast.show" class="flex transition-all duration-1000 ease-in-out w-max fixed top-6 right-0 left-0 bg-secondary text-white text-xs shadow-card mx-auto py-2 px-3 z-50">{{ toast.message }}</div>
		</transition>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import { readTextFile, createDir, readDir } from "@tauri-apps/api/fs";
	import { Employee } from "@/models/interfaces/Employee";
	import store from "@/store/index";
	import { pathExists } from "@/utils/utils";
	import { Project } from "./models/interfaces/Project";
	import { Toast } from "./models/interfaces/Toast";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";

	@Component({
		name: "App",
		components: { PsalmIcon },
	})
	export default class App extends Vue {
		loading = true;

		get toast(): Toast {
			return store.state.toast;
		}

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

			document.body.classList.add("overflow-x-hidden");

			// window.addEventListener("keydown", (e) => {
			// 	e.preventDefault();
			// });
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
	}

	.slide-enter-active,
	.slide-leave-active {
		transition: margin-top 0.3s ease-in-out;
	}
	.slide-enter,
	.slide-leave-to {
		margin-top: -5rem;
	}
</style>

<style>
	/* CUSTOM SCROLLBAR */
	body {
		--scroll-padding: 0px;
	}

	.inner-scrollbar {
		--scroll-padding: 0.5rem;
	}

	*::-webkit-scrollbar {
		width: calc(0.5rem + var(--scroll-padding) * 2);
		height: calc(0.5rem + var(--scroll-padding) * 2);
	}

	/* SCROLLBAR-TRACK */
	*::-webkit-scrollbar-track {
		background: #d7dce4;
		background-clip: padding-box;
	}

	/* SCROLLBAR-THUMB */
	*::-webkit-scrollbar-thumb {
		background-color: #6b7280;
		background-clip: padding-box;
	}

	*::-webkit-scrollbar-thumb:hover {
		background-color: #606672;
	}

	*::-webkit-scrollbar-thumb:vertical,
	*::-webkit-scrollbar-track:vertical {
		border-left: var(--scroll-padding) solid transparent;
		border-right: var(--scroll-padding) solid transparent;
	}

	*::-webkit-scrollbar-thumb:horizontal,
	*::-webkit-scrollbar-track:horizontal {
		border-top: var(--scroll-padding) solid transparent;
		border-bottom: var(--scroll-padding) solid transparent;
	}
</style>
