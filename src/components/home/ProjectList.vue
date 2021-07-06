<template>
	<div class="bg-white rounded border shadow-lg px-2 py-4">
		<h2 class="text-xl text-center font-semibold mb-4">Projekte</h2>
		<!-- LIST HEADER -->
		<div class="grid grid-cols-[1fr,2rem] font-semibold">
			<div class="px-1" title="Titel">Titel</div>
		</div>
		<ul class="">
			<li class="grid grid-cols-[1fr,2rem] grid-rows-[auto,auto]" v-for="project in projectsArray" :key="project.id">
				<!-- HORIZONTAL DIVIDER -->
				<div class="w-full col-span-4 border-b border-gray-400"></div>
				<!-- PROJECTS INPUTS -->
				<router-link :to="`/project/${project.id}`" v-if="!editMode" class="px-1 hover:text-primary">{{ project.title }}</router-link>
				<PsalmInput v-if="editMode" type="text" v-model="project.title" placeholder="Titel" />
				<button class="place-self-center" title="Löschen" @click="triggerDeleteModal(project)"><PsalmIcon name="trash" class="text-danger" /></button>
			</li>
			<!-- NO ENTRYS -->
			<li v-if="projectsArray.length === 0" class="text-center">
				<!-- HORIZONTAL DIVIDER -->
				<div class="w-full col-span-4 border-b border-gray-400"></div>
				<p>Keine Einträge</p>
			</li>
		</ul>

		<div class="flex justify-center">
			<PsalmButton title="Projekt hinzufügen" icon="folder-plus" class="bg-primary" @click="addProject" />
			<PsalmButton v-if="editMode" title="Projekte speichern" icon="save" class="bg-primary" @click="saveProjects" />
			<PsalmButton v-if="!editMode" title="Projekte bearbeiten" icon="edit" class="bg-primary" @click="editMode = true" />
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
	import { newID, pathExists } from "@/utils";
	import { removeFile, writeFile } from "@tauri-apps/api/fs";

	@Component({
		name: "ProjectList",
		components: { PsalmButton, PsalmIcon, PsalmInput },
	})
	export default class ProjectList extends Vue {
		tempProjects: Map<string, Project> = new Map();
		projectsArray: Array<Project> = [];
		editMode = false;

		// get projectsArray(): Array<Project> {
		// 	return Array.from(this.tempProjects, ([name, value]) => value);
		// }

		// set projectsArray(value: Array<Project>) {
		// 	this.projectsArray = value;
		// }

		created(): void {
			this.tempProjects = new Map(store.state.projects);
			this.updateProjectsArray();
		}

		triggerDeleteModal(project: Project): void {
			console.log("project deleted");

			this.tempProjects.delete(project.id);
			//delete json-file

			//CREATE ARRAY FOR v-for LOOP
			this.updateProjectsArray();
		}

		addProject(): void {
			this.editMode = true;

			const id = newID();
			this.tempProjects.set(id, newProject(id));

			//CREATE ARRAY FOR v-for LOOP
			this.updateProjectsArray();

			console.log("added", this.tempProjects.entries());
		}

		async saveProjects(): Promise<void> {
			//SORT TEMP-PROJECTS
			// temp
			// this.tempProjects.sort((e1, e2) => {
			// 	return e1.lastName >= e2.lastName ? 1 : -1;
			// });

			// SEARCH FOR EDITED PROJECTS
			// temp

			// PUSH TEMP-PROJECTS TO STORE
			store.commit("updateProjects", this.tempProjects);

			this.tempProjects.forEach(async (value, key) => {
				// DELETE JSON FILE
				if (await pathExists("data\\projects", `data\\projects\\${key}.json`)) {
					await removeFile(`data/projects/${key}.json`);
				}

				// WRITE JSON FILE
				await writeFile({ contents: JSON.stringify(value), path: `data/projects/${key}.json` });
				console.log("Save complete");
			});

			// CREATE ARRAY FOR v-for LOOP
			this.updateProjectsArray();

			//temp
			this.editMode = false;
			console.log("saved", this.tempProjects.entries());
		}

		updateProjectsArray(): void {
			this.projectsArray = Array.from(this.tempProjects, ([name, value]) => value);
		}
	}
</script>
