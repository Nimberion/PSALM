<template>
	<PsalmCard class="px-2 py-4 min-w-[500px] max-w-[500px]">
		<h2 class="text-xl text-center font-semibold mb-4">Projekte</h2>
		<!-- LIST HEADER -->
		<div class="grid grid-cols-[1fr,2rem] font-semibold">
			<div class="px-1" title="Titel">Titel</div>
		</div>
		<div class="lg:overflow-y-scroll max-h-[calc(100vh-8.25rem)]">
			<ul>
				<li class="grid grid-cols-[1fr,2rem] grid-rows-[auto,auto]" v-for="project in projectsArray" :key="project.id">
					<!-- HORIZONTAL DIVIDER -->
					<div class="w-full col-span-4 border-b border-gray-400"></div>
					<!-- PROJECTS INPUTS -->
					<router-link :to="`/project/${project.id}`" v-if="!editMode" class="my-1 px-1 hover:text-secondary min-h-[1.5rem] border border-transparent overflow-ellipsis overflow-hidden whitespace-nowrap" :title="project.title">{{
						project.title
					}}</router-link>
					<PsalmInput v-if="editMode" class="my-1 w-full" type="text" v-model="project.title" placeholder="Titel" :title="project.title" />
					<PsalmDeleteButton @click="triggerDeleteModal(project)" />
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
				<PsalmButton v-if="editMode" title="Projekttitel speichern" icon="save" class="bg-primary" @click="saveProjects" />
				<PsalmButton v-if="!editMode" title="Projekttitel bearbeiten" icon="edit" class="bg-primary" @click="editMode = true" />
			</div>
		</div>

		<!-- DELETE MODAL -->
		<PsalmDeleteModal v-if="showDeleteModal" type="project" :object-to-delete="projectToDelete" @confirm="deleteProject" @cancel="showDeleteModal = false" />
	</PsalmCard>
</template>

<script lang="ts">
	import store from "@/store";
	import { Component, Vue } from "vue-property-decorator";
	import PsalmDeleteModal from "@/components/common/PsalmDeleteModal.vue";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmDeleteButton from "@/components/common/PsalmDeleteButton.vue";
	import PsalmCard from "@/components/common/PsalmCard.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";
	import { newProject, Project } from "@/models/interfaces/Project";
	import { newID, pathExists } from "@/utils/utils";
	import { removeFile, writeFile } from "@tauri-apps/api/fs";

	@Component({
		name: "ProjectList",
		components: { PsalmDeleteModal, PsalmButton, PsalmDeleteButton, PsalmCard, PsalmIcon, PsalmInput },
	})
	export default class ProjectList extends Vue {
		tempProjects: Map<string, Project> = new Map();
		projectsArray: Array<Project> = [];
		editMode = false;
		showDeleteModal = false;
		projectToDelete = newProject(newID());

		created(): void {
			this.tempProjects = new Map(store.state.projects);
			this.updateProjectsArray();
		}

		triggerDeleteModal(projectToDelete: Project): void {
			this.projectToDelete = projectToDelete;
			this.showDeleteModal = true;
		}

		async deleteProject(): Promise<void> {
			this.tempProjects.delete(this.projectToDelete.id);

			if (await pathExists("data\\projects", `data\\projects\\${this.projectToDelete.id}.json`)) {
				await removeFile(`data/projects/${this.projectToDelete.id}.json`);
			}

			store.commit("updateProjects", this.tempProjects);
			this.updateProjectsArray();
			this.showDeleteModal = false;
		}

		addProject(): void {
			this.editMode = true;

			const id = newID();
			this.tempProjects.set(id, newProject(id));

			//CREATE ARRAY FOR v-for LOOP
			this.updateProjectsArray();
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
			});

			// CREATE ARRAY FOR v-for LOOP
			this.updateProjectsArray();

			this.editMode = false;

			// SHOW SAVED TOAST
			store.commit("showSavedToast");
		}

		updateProjectsArray(): void {
			this.projectsArray = Array.from(this.tempProjects.values());

			this.projectsArray.sort((a, b) => {
				return a.title.localeCompare(b.title, "de", { ignorePunctuation: true, sensitivity: "base" });
			});
		}
	}
</script>
