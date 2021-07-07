<template>
	<div class="absolute left-0 bottom-0 h-full min-h-screen min-w-[100vw] grid place-items-center bg-[rgba(0,0,0,0.8)] overflow-hidden" :style="`top: ${scrollY}px;`">
		<div class="w-[450px] bg-white shadow-lg z-50">
			<!-- TITLE BAR -->
			<div class="h-[30px] flex justify-between items-center shadow-lg select-none">
				<div class="flex text-xs ml-2">
					<img src="@/../src-tauri/icons/32x32.png" class="h-[18px] mr-1" alt="icon" />
					<span> PSALM - Project Staff And Labor Management</span>
				</div>
				<button
					@click="
						$emit('cancel');
						enableScrolling();
					"
				>
					<PsalmIcon name="close" class="text-[30px] p-[5px] hover:bg-danger hover:text-white" />
				</button>
			</div>
			<!-- CONTENT -->
			<div class="p-6">
				<div class="grid grid-cols-[auto,1fr] items-center gap-6">
					<PsalmIcon name="exclamation-triangle" class="text-4xl text-gray-400" />
					<div class="">
						<p v-if="type === 'employee'">
							Bist du sicher, dass du <span class="font-semibold">"{{ objectToDelete.firstName }} {{ objectToDelete.lastName }}"</span> löschen möchtest?
						</p>
						<p v-else-if="type === 'project'">
							Bist du sicher, dass du <span class="font-semibold">"{{ objectToDelete.title }}"</span> löschen möchtest?
						</p>
						<p v-else-if="type === 'projectDay'">
							Bist du sicher, dass du die Veranstaltung am <span class="font-semibold">{{ objectToDelete.date }}</span> löschen möchtest?
						</p>
						<p v-else-if="type === 'projectEmployee'">
							Bist du sicher, dass du <span class="font-semibold">"{{ objectToDelete.firstName }} {{ objectToDelete.lastName }}"</span> aus <span class="font-semibold">"{{ projectName }}"</span> entfernen möchtest?
						</p>
					</div>
				</div>
				<!-- BUTTONS -->
				<div class="flex justify-center">
					<PsalmButton
						class="bg-danger"
						@click="
							$emit('confirm');
							enableScrolling();
						"
						>Bestätigen</PsalmButton
					>
					<PsalmButton
						class="bg-primary"
						@click="
							$emit('cancel');
							enableScrolling();
						"
						>Abbrechen</PsalmButton
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import { Employee } from "@/interfaces/Employee";
	import { Project, ProjectDay } from "@/interfaces/Project";

	@Component({
		name: "DeleteModal",
		components: { PsalmButton, PsalmIcon },
	})
	export default class DeleteModal extends Vue {
		@Prop({ required: true }) objectToDelete!: Employee | Project | ProjectDay;
		@Prop({ required: true }) type!: string;
		@Prop({ required: false }) projectName!: string;

		scrollY = window.scrollY;

		created(): void {
			document.body.classList.add("no-scroll");
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
