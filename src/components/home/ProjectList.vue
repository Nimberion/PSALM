<template>
	<PsalmCard class="py-4 min-w-[500px] max-w-[500px]">
		<h2 class="text-xl text-center font-semibold mb-4">Projekte</h2>
		<!-- LIST HEADER -->
		<div class="ml-2 mr-6 grid grid-cols-[1fr,2rem] font-semibold border-b border-gray-400">
			<div class="px-1" title="Titel">Titel</div>
		</div>
		<div class="lg:overflow-y-scroll scrollbar-p-2 max-h-[calc(100vh-11.3125rem)] mx-2 lg:mr-0">
			<ul>
				<li class="grid grid-cols-[1fr,2rem] grid-rows-[auto,auto] border-b border-gray-400 last:border-b-0" v-for="project in projectsArray" :key="project.id">
					<!-- PROJECTS INPUTS -->
					<router-link :to="`/project/${project.id}`" v-if="!editMode" class="my-1 px-1 hover:text-secondary min-h-[1.5rem] border border-transparent overflow-ellipsis overflow-hidden whitespace-nowrap" :title="project.title">
						{{ project.title }}
					</router-link>
					<PsalmInput v-if="editMode" class="my-1 w-full" type="text" v-model.trim="project.title" placeholder="Titel" :title="project.title" />
					<PsalmDeleteButton @click="triggerDeleteModal(project)" />
				</li>
				<!-- NO ENTRYS -->
				<li v-if="projectsArray.length === 0" class="text-center">
					<!-- HORIZONTAL DIVIDER -->
					<div class="w-full col-span-4 border-b border-gray-400"></div>
					<p>Keine Einträge</p>
				</li>
			</ul>
		</div>
		<div class="flex justify-center">
			<PsalmButton title="Projekt hinzufügen" icon="folder-plus" class="bg-primary" @click="addProject" />
			<PsalmButton v-if="editMode" title="Projekttitel speichern" icon="save" class="bg-primary" @click="saveProjects" />
			<PsalmButton v-if="!editMode" title="Projekttitel bearbeiten" icon="edit" class="bg-primary" @click="editMode = true" />
			<PsalmButton title="Doodle Liste importieren" class="bg-primary" icon="import" @click="showDoodleImportModal = true" />
		</div>

		<!-- MODAL -->
		<PsalmModal v-if="modal.show && modal.type === 'DELETE_PROJECT'" @confirm="deleteProject" />

		<!-- DOODLE IMPORT MODAL -->
		<DoodleImportModal v-if="showDoodleImportModal" @import="importProject" @cancel="showDoodleImportModal = false" />
	</PsalmCard>
</template>

<script lang="ts">
	import store from "@/store";
	import { Component, Vue } from "vue-property-decorator";
	import DoodleImportModal from "@/components/home/DoodleImportModal.vue";
	import PsalmModal from "@/components/common/PsalmModal.vue";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmDeleteButton from "@/components/common/PsalmDeleteButton.vue";
	import PsalmCard from "@/components/common/PsalmCard.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";
	import { newProject, Project } from "@/models/interfaces/Project";
	import { equal, newID, pathExists } from "@/utils/utils";
	import { removeFile, writeFile } from "@tauri-apps/api/fs";
	import { Modal } from "@/models/interfaces/Modal";
	import { ModalType } from "@/models/enums/ModalType";

	@Component({
		name: "ProjectList",
		components: { DoodleImportModal, PsalmModal, PsalmButton, PsalmDeleteButton, PsalmCard, PsalmIcon, PsalmInput },
	})
	export default class ProjectList extends Vue {
		tempProjects: Map<string, Project> = new Map();
		projectsArray: Array<Project> = [];
		editMode = false;
		showDoodleImportModal = false;

		get modal(): Modal {
			return store.state.modal;
		}

		created(): void {
			// this.tempProjects = new Map(store.state.projects);
			this.tempProjects = new Map(JSON.parse(JSON.stringify(Array.from(store.state.projects))));
			this.updateProjectsArray();
		}

		triggerDeleteModal(projectToDelete: Project): void {
			store.commit("showModal", { type: ModalType.DELETE_PROJECT, content: projectToDelete });
		}

		async deleteProject(): Promise<void> {
			const projectId = (this.modal.content as Project).id;

			this.tempProjects.delete(projectId);

			if (await pathExists("data\\projects", `data\\projects\\${projectId}.json`)) {
				await removeFile(`data/projects/${projectId}.json`);
			}

			await this.saveProjects();
			store.commit("showToast", "deleted");
			store.commit("resetModal");
		}

		addProject(): void {
			this.editMode = true;

			const id = newID();
			this.tempProjects.set(id, newProject(id));

			//CREATE ARRAY FOR v-for LOOP
			this.updateProjectsArray();
		}

		async saveProjects(): Promise<void> {
			this.tempProjects.forEach(async (value, key) => {
				// SEARCH FOR EDITED PROJECTS
				if (!equal(value, store.state.projects.get(key) || {})) {
					// DELETE OLD JSON FILE
					if (await pathExists("data\\projects", `data\\projects\\${key}.json`)) {
						await removeFile(`data/projects/${key}.json`);
					}

					// WRITE NEW JSON FILE
					await writeFile({ contents: JSON.stringify(value), path: `data/projects/${key}.json` });
				}
			});

			// PUSH TEMP-PROJECTS TO STORE
			store.commit("updateProjects", this.tempProjects);

			// CREATE ARRAY FOR v-for LOOP
			this.updateProjectsArray();

			this.editMode = false;

			// SHOW SAVED TOAST
			store.commit("showToast", "saved");
		}

		updateProjectsArray(): void {
			this.projectsArray = Array.from(this.tempProjects.values());
			this.projectsArray.sort((a, b) => {
				if (a.title === "") {
					return 1;
				} else if (b.title === "") {
					return -1;
				} else {
					return a.title.localeCompare(b.title, "de", { ignorePunctuation: true, sensitivity: "base" });
				}
			});
		}

		async importProject(projectToImport: Project): Promise<void> {
			this.tempProjects.set(projectToImport.id, projectToImport);
			await this.saveProjects();

			this.$router.push(`/project/${projectToImport.id}`);

			store.commit("showToast", "imported");
		}
	}
</script>
