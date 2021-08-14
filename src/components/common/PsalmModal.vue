<template>
	<div class="absolute left-0 bottom-0 right-0 top-0 h-full min-h-screen min-w-[100vw] grid place-items-center bg-[rgba(0,0,0,0.8)] overflow-hidden z-50" :style="`top: ${scrollY}px;`">
		<PsalmCard class="w-[450px] relative p-6 pt-4 z-50">
			<!-- CLOSE BUTTON -->
			<button @click="close()" class="absolute top-0 right-0">
				<PsalmIcon name="close" class="text-[30px] p-[5px] hover:bg-danger hover:text-white rounded-bl-sm" />
			</button>

			<!-- CONTENT -->
			<div class="text-center mb-2">
				<div class="flex justify-center place-items-center gap-4 border-b border-warning pb-4 mb-6">
					<PsalmIcon name="exclamation-triangle" class="text-4xl text-warning" /> <span class="text-2xl font-semibold text-warning"> WARNUNG!</span>
				</div>

				<div v-if="modal.type === 'DELETE_EMPLOYEE'">
					Bist du sicher, dass du <span class="font-semibold">"{{ modal.content.firstName }} {{ modal.content.lastName }}"</span> löschen möchtest?
				</div>
				<div v-else-if="modal.type === 'DELETE_PROJECT'">
					Bist du sicher, dass du <span class="font-semibold">"{{ modal.content.title }}"</span> löschen möchtest?
				</div>
				<div v-else-if="modal.type === 'DELETE_PROJECT_DAY'">
					Bist du sicher, dass du die Veranstaltung am <span class="font-semibold">{{ projectDayDateToDelete }}</span> mit <span class="font-semibold">"{{ modal.content.participant }}"</span> löschen möchtest?
				</div>
				<div v-else-if="modal.type === 'ERROR'">Error</div>
				<div v-else-if="modal.type === 'EXIT'">Exit</div>
				<div v-else-if="modal.type === 'RELOAD'">Reload</div>
				<div v-else-if="modal.type === 'ROUTE'">Route</div>
			</div>
			<!-- BUTTONS -->
			<div class="flex justify-center">
				<PsalmButton class="bg-primary" @click="confirm()">Bestätigen</PsalmButton>
				<PsalmButton class="bg-gray-500" @click="close()">Abbrechen</PsalmButton>
			</div>
		</PsalmCard>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmCard from "@/components/common/PsalmCard.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import { Project, ProjectDay } from "@/models/interfaces/Project";
	import store from "@/store";
	import { ModalType } from "@/models/enums/ModalType";
	import { Modal } from "@/models/interfaces/Modal";
	import { formatDate, pathExists } from "@/utils/utils";
	import { Employee } from "@/models/interfaces/Employee";
	import { removeFile } from "@tauri-apps/api/fs";

	@Component({
		name: "DeleteModal",
		components: { PsalmButton, PsalmCard, PsalmIcon },
	})
	export default class PsalmModal extends Vue {
		scrollY = window.scrollY; // FOR Y-OFFSET
		projectDayDateToDelete = "";
		content = "";

		get modal(): Modal {
			return store.state.modal;
		}

		get tempStaff(): Array<Employee> {
			return store.state.tempStaff;
		}

		get tempProjects(): Array<Project> {
			return store.state.tempProjects;
		}

		created(): void {
			document.body.classList.add("no-scroll");

			// FORMAT DATE
			if (this.modal.type === ModalType.DELETE_PROJECT_DAY) {
				const projectDayToDelete = this.modal.content as ProjectDay;

				this.projectDayDateToDelete = formatDate(projectDayToDelete.date);
			}
		}

		close(): void {
			store.commit("resetModal");
			document.body.classList.remove("no-scroll");
		}

		// enableScrolling(): void {
		// 	document.body.classList.remove("no-scroll");
		// }

		async confirm(): Promise<void> {
			switch (this.modal.type) {
				case "DELETE_EMPLOYEE":
					await this.deleteEmployee();
					break;
				case "DELETE_PROJECT":
					await this.deleteProject();
					break;
				case "DELETE_PROJECT_DAY":
					await this.deleteProjectDay();
					break;
				case "ERROR":
					// await this.deleteEmployee();
					break;
				case "EXIT":
					// await this.deleteEmployee();
					break;
				case "RELOAD":
					// await this.deleteEmployee();
					break;
				case "ROUTE":
					// await this.deleteEmployee();
					break;
			}

			this.close();
		}

		async deleteEmployee(): Promise<void> {
			const employeeToDelete = store.state.modal.content as Employee;

			this.tempStaff.splice(
				this.tempStaff.findIndex((element) => element.id === employeeToDelete.id),
				1,
			);

			await store.dispatch("saveTempStatesToFiles");
			store.commit("showToast", "deleted");
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

			await store.dispatch("saveTempStatesToFiles");
			store.commit("showToast", "deleted");
		}

		async deleteProjectDay(): Promise<void> {
			const projectDayToDelete = store.state.modal.content as ProjectDay;

			const tempProject = this.tempProjects.find((project) => project.projectDays.includes(projectDayToDelete));

			if (tempProject) {
				tempProject.projectDays.splice(
					tempProject.projectDays.findIndex((e) => e.id === projectDayToDelete.id),
					1,
				);
			}

			await store.dispatch("saveTempStatesToFiles");
			store.commit("showToast", "deleted");
		}
	}
</script>

<style>
	.no-scroll {
		overflow: hidden;
	}
</style>
