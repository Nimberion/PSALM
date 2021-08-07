<template>
	<div class="absolute left-0 bottom-0 right-0 top-0 h-full min-h-screen min-w-[100vw] grid place-items-center bg-[rgba(0,0,0,0.8)] overflow-hidden z-50" :style="`top: ${scrollY}px;`">
		<PsalmCard class="w-[450px] relative p-6 pt-4 z-50">
			<!-- CLOSE BUTTON -->
			<button @click="cancel(), enableScrolling()" class="absolute top-0 right-0">
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
				<PsalmButton
					class="bg-primary"
					@click="
						$emit('confirm');
						enableScrolling();
					"
					>Bestätigen</PsalmButton
				>
				<PsalmButton class="bg-gray-500" @click="cancel(), enableScrolling()">Abbrechen</PsalmButton>
			</div>
		</PsalmCard>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmCard from "@/components/common/PsalmCard.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import { ProjectDay } from "@/models/interfaces/Project";
	import store from "@/store";
	import { ModalType } from "@/models/enums/ModalType";
	import { Modal } from "@/models/interfaces/Modal";
	import { formatDate } from "@/utils/utils";

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

		created(): void {
			document.body.classList.add("no-scroll");

			// FORMAT DATE
			if (this.modal.type === ModalType.DELETE_PROJECT_DAY) {
				const projectDayToDelete = this.modal.content as ProjectDay;

				this.projectDayDateToDelete = formatDate(projectDayToDelete.date);
			}
		}

		cancel(): void {
			store.commit("resetModal");
		}

		enableScrolling(): void {
			document.body.classList.remove("no-scroll");
		}
	}
</script>

<style>
	.no-scroll {
		overflow: hidden;
	}
</style>
