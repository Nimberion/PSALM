<template>
	<div class="grid grid-rows-[repeat(5,auto)] gap-2 border p-2 ml-1">
		<button class="place-self-center bg-gray-400 p-2 py-1 border border-gray-600 rounded max-w-max text-sm" @click="addEmployee">Mitarbeiter hinzufügen</button>

		<label name="Vorname" title="Vorname">
			<p class="text-left font-semibold text-sm">Vorname:</p>
			<input class="w-full rounded p-1 px-2" type="text" :value="firstName" @input="$emit('change', 'firstName', $event)" autocomplete="anyrandomstring" />
		</label>

		<label name="Nachname" title="Nachname">
			<p class="text-left font-semibold text-sm">Nachname:</p>
			<input class="w-full rounded p-1 px-2" type="text" :value="lastName" @input="$emit('change', 'lastName', $event)" autocomplete="anyrandomstring" />
		</label>

		<label class="text-left" name="Hauptamtlich?" title="Hauptamtlich?">
			<span class="font-semibold text-sm mr-2">Hauptamtlich?</span>
			<input class="rounded place-self-center" type="checkbox" :checked="fullTime" @input="$emit('change', 'fullTime', $event)" />
		</label>

		<button class="bg-gray-400 p-2 py-1 border border-gray-600 rounded max-w-max place-self-center text-sm" @click="saveEmployee">Speichern</button>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component({
		name: "EditStaffForm",
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
