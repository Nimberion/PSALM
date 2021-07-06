<template>
	<div class="absolute top-0 left-0 bottom-0 h-full min-h-screen min-w-[100vw] grid place-items-center bg-[rgba(0,0,0,0.8)]" @click="$emit('cancel')">
		<div class="grid grid-cols-1 grid-rows-[repeat(3,auto)] gap-4 bg-white rounded shadow-lg p-4 z-50" @click.stop>
			<h2 class="bg-primary text-white font-semibold text-center rounded p-1">Achtung!</h2>
			<p v-if="type === 'employee'" class="col-span-2">
				Bist du sicher, dass du <span class="font-semibold">"{{ objectToDelete.firstName }} {{ objectToDelete.lastName }}"</span> löschen möchtest?
			</p>
			<p v-else-if="type === 'project'" class="col-span-2">
				Bist du sicher, dass du <span class="font-semibold">"{{ objectToDelete.titel }}"</span> löschen möchtest?
			</p>
			<p v-else-if="type === 'projectDay'" class="col-span-2">
				Bist du sicher, dass du die Veranstaltung am <span class="font-semibold">{{ objectToDelete.date }}</span> löschen möchtest?
			</p>
			<p v-else-if="type === 'projectEmployee'" class="col-span-2">
				Bist du sicher, dass du <span class="font-semibold">"{{ objectToDelete.firstName }} {{ objectToDelete.lastName }}"</span> aus <span class="font-semibold">"{{ projectName }}"</span> entfernen möchtest?
			</p>
			<div class="flex justify-center">
				<PsalmButton class="bg-danger" @click="$emit('input')">Bestätigen</PsalmButton>
				<PsalmButton class="bg-primary" @click="$emit('cancel')">Abrechnen</PsalmButton>
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

		update(e: { target: HTMLInputElement }): void {
			switch (this.type) {
				case "checkbox":
					this.$emit("input", e.target.checked as boolean);
					break;
				case "number":
					this.$emit("input", e.target.valueAsNumber);
					break;
				case "text":
					this.$emit("input", e.target.value);
					break;
			}
		}
	}
</script>
