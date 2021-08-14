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
	import { Modal } from "@/models/interfaces/Modal";
	import { ModalType } from "@/models/enums/ModalType";

	@Component({
		name: "ProjectList",
		components: { DoodleImportModal, PsalmModal, PsalmButton, PsalmDeleteButton, PsalmCard, PsalmIcon, PsalmInput },
	})
	export default class ProjectList extends Vue {
		editMode = false;
		showDoodleImportModal = false;

		get tempProjects(): Array<Project> {
			return store.state.tempProjects;
		}

		get modal(): Modal {
			return store.state.modal;
		}

		triggerDeleteModal(projectToDelete: Project): void {
			store.commit("showModal", { type: ModalType.DELETE_PROJECT, content: projectToDelete });
		}

		addProject(): void {
			this.editMode = true;
			this.tempProjects.push(newProject());
		}

		async saveProjects(): Promise<void> {
			await store.dispatch("saveTempStatesToFiles");
			this.editMode = false;
		}

		async importProject(projectToImport: Project): Promise<void> {
			this.tempProjects.push(projectToImport);
			await this.saveProjects();

			this.$router.push(`/project/${projectToImport.id}`);

			store.commit("showToast", "imported");
		}
	}
</script>
