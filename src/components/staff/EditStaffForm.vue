<template>
	<div class="h-[max-content] grid grid-rows-[repeat(5,auto)] gap-2 border p-2 bg-white rounded shadow-lg text-sm">
		<button class="max-w-max place-self-center bg-[#33658A] text-white rounded p-2 py-1" @click="addEmployee">Mitarbeiter hinzufügen</button>

		<label name="Vorname" title="Vorname">
			<p class="text-left font-semibold">Vorname:</p>
			<input class="w-full rounded p-1 px-2 focus:ring-[#33658A] focus:border-[#33658A]" type="text" :value="firstName" @input="$emit('change', 'firstName', $event)" autocomplete="anyrandomstring" />
		</label>

		<label name="Nachname" title="Nachname">
			<p class="text-left font-semibold">Nachname:</p>
			<input class="w-full rounded p-1 px-2 focus:ring-[#33658A] focus:border-[#33658A]" type="text" :value="lastName" @input="$emit('change', 'lastName', $event)" autocomplete="anyrandomstring" />
		</label>

		<label class="w-max text-left cursor-pointer" name="Hauptamtlich?" title="Hauptamtlich?">
			<span class="font-semibold mr-2">Hauptamtlich?</span>
			<input class="rounded place-self-center text-[#33658A] focus:ring-[#33658A] focus:border-[#33658A] cursor-pointer" type="checkbox" :checked="fullTime" @input="$emit('change', 'fullTime', $event)" />
		</label>

		<button class="max-w-max place-self-center bg-[#33658A] text-white rounded p-2 py-1" @click="saveEmployee">Speichern</button>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import TextInput from "@/components/common/TextInput.vue";

	@Component({
		name: "EditStaffForm",
		components: { TextInput },
	})
	export default class EditStaffForm extends Vue {
		@Prop({ required: true }) _firstName!: string;
		@Prop({ required: true }) _lastName!: string;
		@Prop({ required: true }) _fullTime!: boolean;

		get firstName(): string {
			return this._firstName;
		}
		get lastName(): string {
			return this._lastName;
		}
		get fullTime(): boolean {
			return this._fullTime;
		}

		addEmployee(): void {
			this.$emit("add-employee");
		}

		saveEmployee(): void {
			this.$emit("save-employee");
		}
	}
</script>

<style scoped>
	.grid-test {
		grid-column: 2;
		grid-row: 4;
	}
</style>
