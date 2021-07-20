<template>
	<div class="absolute left-0 bottom-0 right-0 top-0 h-full min-h-screen min-w-[100vw] grid place-items-center bg-[rgba(0,0,0,0.8)] overflow-hidden z-50" :style="`top: ${scrollY}px;`">
		<PsalmCard v-if="rawData.length > 0" class="py-4 min-w-[500px] max-w-[600px] relative">
			<button
				class="absolute top-0 right-0"
				@click="
					$emit('cancel');
					enableScrolling();
				"
			>
				<PsalmIcon name="close" class="text-[30px] p-[5px] hover:bg-danger hover:text-white" />
			</button>
			<h2 class="text-xl text-center font-semibold mb-4">Mitarbeiter Import</h2>
			<!-- LIST -->
			<div class="grid grid-cols-[1fr,1fr,3rem] pl-4 pr-6 font-semibold">
				<p class="pl-1">Vorname</p>
				<p>Nachname</p>
				<p class="text-center">HA?</p>
			</div>
			<div class="overflow-y-scroll scrollbar-p-2 max-h-[calc(100vh-13.75rem)] pl-4">
				<ul>
					<li v-for="employee in tempStaff" :key="employee.id" class="grid grid-cols-[1fr,1fr,3rem] items-center">
						<!-- HORIZONTAL DIVIDER -->
						<hr class="h-[1px] w-full col-span-3 bg-gray-400 border-0" />
						<div class="overflow-ellipsis overflow-hidden whitespace-nowrap mx-1" :title="employee.firstName">{{ employee.firstName }}</div>
						<div class="overflow-ellipsis overflow-hidden whitespace-nowrap" :title="employee.lastName">{{ employee.lastName }}</div>
						<div class="text-center">{{ employee.fullTime === true ? "Ja" : "-" }}</div>
					</li>
				</ul>
			</div>
			<div class="flex justify-center">
				<PsalmButton class="bg-primary" @click="importStaff">Importieren</PsalmButton>
				<PsalmButton
					class="bg-gray-500"
					@click="
						$emit('cancel');
						enableScrolling();
					"
					>Abbrechen</PsalmButton
				>
			</div>
		</PsalmCard>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmCard from "@/components/common/PsalmCard.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";
	import { newID } from "@/utils/utils";
	import { open } from "@tauri-apps/api/dialog";
	import { Employee, newEmployee } from "@/models/interfaces/Employee";
	import { readTextFile } from "@tauri-apps/api/fs";

	@Component({
		name: "StaffImportModal",
		components: { PsalmInput, PsalmButton, PsalmCard, PsalmIcon },
	})
	export default class StaffImportModal extends Vue {
		scrollY = window.scrollY; // FOR Y-OFFSET

		rawData: Array<Array<string>> = [];

		tempStaff: Array<Employee> = [];

		created(): void {
			document.body.classList.add("no-scroll");
			this.readStaffCSV();
		}

		enableScrolling(): void {
			document.body.classList.remove("no-scroll");
		}

		async readStaffCSV(): Promise<void> {
			// OPEN DIALOG
			const path = await open({ filters: [{ name: "PSALM Mitarbeiter", extensions: ["csv"] }] });
			// on  error??

			// READ FILE IF PICKED
			if (path) {
				const importedData = (await readTextFile(path as string)).split("\r\n");

				for (let i = 1; i < importedData.length - 1; i++) {
					this.rawData.push(importedData[i].split(";"));
				}

				this.rawData.forEach((e) => {
					this.tempStaff.push(newEmployee(newID(), e[0], e[1], e[2] === "1"));
				});
			} else {
				this.$emit("cancel");
				this.enableScrolling();
			}
		}

		importStaff(): void {
			this.$emit("import", this.tempStaff);
			this.enableScrolling();
		}
	}
</script>

<style>
	.no-scroll {
		overflow: hidden;
	}
</style>
