<template>
	<div class="flex flex-col place-items-center">
		<!-- <div class="h-screen w-screen grid grid-cols-1 grid-rows-[auto,1fr] place-items-center"> -->
		<!-- HEADER -->
		<div class="flex place-items-center border bg-white rounded shadow-lg m-2 p-2">
			<h2 class="text-xl font-semibold border-r border-gray-400 pr-2">{{ project.title }}</h2>
			<button class="ml-2" title="Projekttag hinzufügen"><PsalmIcon name="calendar-plus" class="text-primary text-xl" /></button>
			<button class="ml-2" title="Mitarbeiter bearbeiten" @click="projectStaffEditMode = !projectStaffEditMode"><PsalmIcon name="users-cog" class="text-primary text-xl" /></button>
			<button class="ml-2" title="Speichern"><PsalmIcon name="save" class="text-primary text-xl" /></button>
		</div>

		<!-- TABLE WRAPPER -->
		<div class="flex max-h-[calc(100vh-5.75rem-4px)] max-w-[calc(100vw-2rem-2px)] border bg-white rounded shadow-lg m-2 px-2 py-4">
			<!-- PROJECT-STAFF-EDITOR -->
			<ProjectStaff v-if="projectStaffEditMode" :project-staff="tempProject.staff" @update="updateTempProjectStaff" />
			<!-- TABLE -->
			<section v-if="!projectStaffEditMode" class="grid overflow-scroll" :style="`grid-template-columns: auto repeat(${days.length * 2},3rem) auto;`">
				<!-- TOP-LEFT CORNER -->
				<div class="flex flex-col justify-end items-end row-span-2 sticky top-0 left-0 bg-white border-gray-400 border-r-2 border-b-2 z-10">
					<div class="w-24 text-xs text-center font-semibold">Statistik</div>
					<div class="flex text-xs text-center border-t border-gray-400">
						<div class="w-8 border-l border-gray-400">Kann</div>
						<div class="w-8 border-l border-gray-400">Ist</div>
						<div class="w-8 border-l border-gray-400">Soll</div>
					</div>
				</div>

				<!-- DAY HEADER LOOP -->
				<div
					v-for="day in days"
					:key="`data-${day.id}`"
					class="h-[calc(3.75rem+1px)] grid col-span-2 sticky top-0 bg-white border-gray-400 border-l border-b border-r px-1 text-sm overflow-ellipsis whitespace-nowrap text-center place-content-center"
				>
					<p class="font-semibold overflow-ellipsis overflow-hidden">{{ day.name }}</p>
					<p class="overflow-ellipsis overflow-hidden">10:30 - 14:60</p>
					<p class="overflow-ellipsis overflow-hidden">Marienschule</p>
				</div>

				<!-- TOP-RIGHT CORNER -->
				<div class="grid row-span-2 sticky top-0 right-0 bg-white border-gray-400 border-l-2 border-b-2 z-10"></div>

				<!-- "Kann" AND "Ist" LOOP -->
				<template v-for="day in days">
					<div :key="`available-header-${day.id}`" class="grid col-span-1 auto-cols-max sticky top-[calc(3.75rem+1px)] bg-white border-gray-400 border-l border-b-2 px-1 text-xs place-content-center">Kann</div>
					<div :key="`deployed-header-${day.id}`" class="grid col-span-1 auto-cols-max sticky top-[calc(3.75rem+1px)] bg-white border-gray-400 border-l border-b-2 border-r px-1 text-xs place-content-center">Ist</div>
				</template>

				<!-- ROWS LOOP -->
				<template v-for="(employee, index) in staff">
					<!-- STAFF LOOP -->
					<div :key="employee.id" class="flex justify-between whitespace-nowrap sticky left-0 bg-white border-gray-400 border-r-2 border-t" :class="{ 'bg-gray-200': index % 2 === 0 }">
						<div class="px-1">{{ employee.firstName }} {{ employee.lastName }}</div>
						<!-- STATISTIC DATA -->
						<div class="flex text-center">
							<div class="w-8 border-l border-gray-400">2</div>
							<div class="w-8 border-l border-gray-400">3</div>
							<div class="w-8 border-l border-gray-400">13</div>
						</div>
					</div>
					<!-- PROJECT DAYS LOOP -->
					<template v-for="day in days">
						<div :key="`available-${day.id}-${employee.id}`" class="grid auto-cols-max border-gray-400 border-t border-l place-content-center" :class="{ 'bg-gray-200': index % 2 === 0 }">#1</div>
						<div :key="`deployed-${day.id}-${employee.id}`" class="grid auto-cols-max border-gray-400 border-t border-l border-r place-content-center" :class="{ 'bg-gray-200': index % 2 === 0 }">#2</div>
					</template>
					<!-- RIGHT STAFF LIST -->
					<div :key="`left-side-${employee.id}`" class="px-1 whitespace-nowrap sticky right-0 bg-white border-gray-400 border-l-2 border-t" :class="{ 'bg-gray-200': index % 2 === 0 }">
						{{ employee.firstName }} {{ employee.lastName }}
					</div>
				</template>
			</section>
		</div>
	</div>
</template>

<script lang="ts">
	// import { Employee, newEmployee } from "@/interfaces/Employee";
	// import store from "@/store";
	import { newEmployeeAvailability, newProject, Project } from "@/interfaces/Project";
	import store from "@/store";
	import { Component, Vue } from "vue-property-decorator";
	import ProjectStaff from "@/components/project/ProjectStaff.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";
	import { newID } from "@/utils";
	import { Employee } from "@/interfaces/Employee";

	@Component({
		name: "ProjectPage",
		components: { ProjectStaff, PsalmIcon, PsalmInput },
	})
	export default class ProjectPage extends Vue {
		projectStaffEditMode = false;
		tempProject: Project = newProject(newID());

		days = [
			{ id: 101, name: "16.03.2021" },
			{ id: 102, name: "day2" },
			{ id: 103, name: "day3" },
			{ id: 104, name: "day4" },
			{ id: 105, name: "day5" },
			{ id: 106, name: "day6" },
			{ id: 107, name: "day7" },
		];

		get project(): Project {
			return store.state.projects.get(this.$route.path.split("/")[2]) as Project;
		}

		get staff(): Array<Employee> {
			return store.state.staff.filter((item) => this.tempProject.staff.includes(item.id));
		}

		created(): void {
			this.tempProject = JSON.parse(JSON.stringify(this.project));
		}

		getNameById(id: string): string {
			const employee = this.staff.find((element) => element.id === id);
			return `${employee?.firstName} ${employee?.lastName}`;
		}

		updateTempProjectStaff(newTempProjectStaff: Array<string>): void {
			this.tempProject.staff = newTempProjectStaff;

			// UPDATE staffAvailability OF ALL PROJECT-DAYS
			this.tempProject.projectDays.forEach((day) => {
				const tempStaffAvailability = new Map(Object.entries(day.staffAvailability));

				this.tempProject.staff.forEach((employeeId) => {
					if (!tempStaffAvailability.has(employeeId)) {
						tempStaffAvailability.set(employeeId, newEmployeeAvailability());
						day.staffAvailability = tempStaffAvailability;
					}
				});
			});
		}
	}
</script>
