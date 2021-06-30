<template>
	<div class="bg-white rounded border shadow-lg px-2 py-4">
		<h2 class="text-xl text-center font-semibold mb-4">Projekte</h2>
		<!-- LIST HEADER -->
		<div class="grid grid-cols-[2rem,1fr,2rem] font-semibold">
			<div></div>
			<div class="px-1" title="Titel">Titel</div>
		</div>
		<ul class="">
			<li class="grid grid-cols-[2rem,1fr,2rem] grid-rows-[auto,auto]" v-for="project in projectsArray" :key="project.id">
				<!-- HORIZONTAL DIVIDER -->
				<div class="w-full col-span-4 border-b border-gray-500"></div>
				<!-- PROJECTS INPUTS -->
				<button class="place-self-center" title="Öffnen" @click="saveProjects"><PsalmIcon name="folder-open" class="text-primary" /></button>
				<PsalmInput type="text" v-model="project.title" placeholder="Titel" dblclick="dblclick" @dblclick="saveProjects" />
				<button class="place-self-center" title="Löschen" @click="triggerDeleteModal(project)"><PsalmIcon name="trash" class="text-danger" /></button>
			</li>
			<!-- NO ENTRYS -->
			<li v-if="projectsArray.length === 0" class="text-center">
				<!-- HORIZONTAL DIVIDER -->
				<div class="w-full col-span-4 border-b border-gray-500"></div>
				<p>Keine Einträge</p>
			</li>
		</ul>

		<div class="flex justify-center">
			<PsalmButton icon="folder-plus" color="primary" @click="addProject" />
			<PsalmButton icon="save" color="primary" @click="saveProjects" />
		</div>
	</div>
</template>

<script lang="ts">
	import store from "@/store";
	import { Component, Vue } from "vue-property-decorator";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";
	import { newProject, Project } from "@/interfaces/Project";
	import { newID } from "@/utils";

	@Component({
		name: "ProjectList",
		components: { PsalmButton, PsalmIcon, PsalmInput },
	})
	export default class ProjectList extends Vue {
		tempProjects: Map<string, Project> = new Map();
		projectsArray: Array<Project> = [];

		get projectList(): Array<string> {
			return store.state.projectList;
		}

		triggerDeleteModal(project: Project): void {
			this.tempProjects.delete(project.id);

			//CREATE ARRAY FOR v-for LOOP
			this.updateProjectsArray();
		}

		addProject(): void {
			const id = newID();
			this.tempProjects.set(id, newProject(id, []));

			//CREATE ARRAY FOR v-for LOOP
			this.updateProjectsArray();

			console.log("added", this.tempProjects.entries());
		}

		saveProjects(): void {
			//sort thempProjects here

			store.commit("updateProjects", this.tempProjects);

			this.tempProjects = store.state.projects;

			//CREATE ARRAY FOR v-for LOOP
			this.updateProjectsArray();
			console.log("saved", this.tempProjects.entries());
		}

		updateProjectsArray(): void {
			this.projectsArray = Array.from(this.tempProjects, ([name, value]) => value);
		}
	}
</script>
