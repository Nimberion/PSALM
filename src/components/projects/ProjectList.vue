<template>
	<div class="bg-white rounded border shadow-lg px-2 py-4">
		<h2 class="text-xl text-center font-semibold mb-4">Projekte</h2>
		<!-- LIST HEADER -->
		<div class="grid grid-cols-[2rem,1fr,3rem,2rem] font-semibold">
			<div></div>
			<div class="px-1" title="Titel">Titel</div>
			<div class="text-center px-1" title="Benötigte Mitarbeiter pro Projekttag">MA</div>
		</div>
		<ul class="">
			<li class="grid grid-cols-[2rem,1fr,3rem,2rem] grid-rows-[auto,auto]" v-for="project in projectsArray" :key="project.id">
				<!-- HORIZONTAL DIVIDER -->
				<div class="w-full col-span-4 border-b border-gray-500"></div>
				<!-- PROJECTS INPUTS -->
				<button class="place-self-center" title="Öffnen" @click="saveProjects"><Icon name="folder-open" class="text-primary" /></button>
				<Input type="text" v-model="project.title" placeholder="Titel" dblclick="dblclick" @dblclick="saveProjects" />
				<Input type="number" class="text-center" v-model="project.numberOfRequiredStaff" />
				<button class="place-self-center" title="Löschen" @click="triggerDeleteModal(project)"><Icon name="trash" class="text-danger" /></button>
			</li>
			<!-- NO ENTRYS -->
			<li v-if="projectsArray.length === 0" class="text-center">
				<!-- HORIZONTAL DIVIDER -->
				<div class="w-full col-span-4 border-b border-gray-500"></div>
				<p>Keine Einträge</p>
			</li>
		</ul>

		<div class="flex justify-center">
			<Button icon="folder-plus" color="primary" @click="addProject" />
			<Button icon="save" color="primary" @click="saveProjects" />
		</div>
	</div>
</template>

<script lang="ts">
	import store from "@/store";
	import { Component, Vue } from "vue-property-decorator";
	import Button from "@/components/common/Button.vue";
	import Icon from "@/components/common/Icon.vue";
	import Input from "@/components/common/Input.vue";
	import { newProject, Project } from "@/interfaces/Project";
	import { newID } from "@/utils";

	@Component({
		name: "ProjectList",
		components: { Button, Icon, Input },
	})
	export default class ProjectList extends Vue {
		tempProjects: Map<string, Project> = new Map();
		projectsArray: Array<Project> = [];

		get projectList(): Array<string> {
			return store.state.projectList;
		}

		triggerDeleteModal(project: Project): void {
			console.log(project);

			this.tempProjects.delete(project.id);
			this.projectsArray = Array.from(this.tempProjects, ([name, value]) => value);
		}

		addProject(): void {
			const id = newID();
			this.tempProjects.set(id, newProject(id, store.state.staff));

			this.projectsArray = Array.from(this.tempProjects, ([name, value]) => value);
			console.log("Project added... maybe\n", this.projectsArray);
		}

		saveProjects(): void {
			console.log("Project saved... maybe");
		}
	}
</script>
