<template>
	<PsalmCard class="py-4 min-w-[500px] max-w-[500px]">
		<h2 class="text-xl text-center font-semibold mb-4">Projekte</h2>
		<!-- LIST HEADER -->
		<div class="mx-2 lg:mr-6 grid grid-cols-[1fr,2rem] font-semibold border-b border-gray-400">
			<div class="px-1" title="Titel">Titel</div>
		</div>
		<div class="lg:overflow-y-scroll scrollbar-p-2 max-h-[calc(100vh-11.3125rem)] mx-2 lg:mr-0">
			<ul>
				<li class="grid grid-cols-[1fr,2rem] grid-rows-[auto,auto] border-b border-gray-400 last:border-b-0" v-for="project in tempProjects" :key="project.id">
					<!-- PROJECTS INPUTS -->
					<router-link :to="`/project/${project.id}`" v-if="!editMode" class="my-1 px-1 hover:text-secondary min-h-[1.5rem] border border-transparent overflow-ellipsis overflow-hidden whitespace-nowrap" :title="project.title">
						{{ project.title }}
					</router-link>
					<PsalmInput v-if="editMode" class="my-1 w-full" type="text" v-model.trim="project.title" placeholder="Titel" :title="project.title" />
					<PsalmDeleteButton @click="triggerDeleteModal(project)" />
				</li>
				<!-- NO ENTRYS -->
				<li v-if="tempProjects.length === 0" class="text-center">Keine Einträge</li>
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
		tempProjects: Array<Project> = [];
		editMode = false;
		showDoodleImportModal = false;

		get modal(): Modal {
			return store.state.modal;
		}

		created(): void {
			this.tempProjects = JSON.parse(JSON.stringify(store.state.projects));
		}

		triggerDeleteModal(projectToDelete: Project): void {
			store.commit("showModal", { type: ModalType.DELETE_PROJECT, content: projectToDelete });
		}

		async deleteProject(): Promise<void> {
			const projectId = (this.modal.content as Project).id;

			this.tempProjects.splice(
				this.tempProjects.findIndex((e) => e.id === projectId),
				1,
			);

			if (await pathExists("data\\projects", `data\\projects\\${projectId}.json`)) {
				await removeFile(`data/projects/${projectId}.json`);
			}

			await this.saveProjects();
			store.commit("showToast", "deleted");
			store.commit("resetModal");
		}

		addProject(): void {
			this.editMode = true;
			this.tempProjects.push(newProject(newID()));
		}

		async saveProjects(): Promise<void> {
			this.tempProjects.sort((a, b) => {
				return a.title.localeCompare(b.title, "de", { ignorePunctuation: true, sensitivity: "base" });
			});

			this.tempProjects.forEach(async (tempProject) => {
				// SEARCH FOR EDITED PROJECTS
				if (!equal(tempProject, store.state.projects.find((storeProject) => storeProject.id === tempProject.id) || {})) {
					// DELETE OLD JSON FILE
					if (await pathExists("data\\projects", `data\\projects\\${tempProject.id}.json`)) {
						await removeFile(`data/projects/${tempProject.id}.json`);
					}

					// WRITE NEW JSON FILE
					await writeFile({ contents: JSON.stringify(tempProject), path: `data/projects/${tempProject.id}.json` });
				}
			});

			// PUSH TEMP-PROJECTS TO STORE
			store.commit("updateProjects", this.tempProjects);

			this.editMode = false;

			// SHOW SAVED TOAST
			store.commit("showToast", "saved");
		}

		async importProject(projectToImport: Project): Promise<void> {
			this.tempProjects.push(projectToImport);
			await this.saveProjects();

			this.$router.push(`/project/${projectToImport.id}`);

			store.commit("showToast", "imported");
		}
	}
</script>
