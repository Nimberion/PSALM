<template>
	<div class="flex flex-col place-items-center">
		<!-- <div class="h-screen w-screen grid grid-cols-1 grid-rows-[auto,1fr] place-items-center"> -->
		<!-- HEADER -->
		<div class="flex place-items-center border bg-white rounded shadow-lg m-2 p-2">
			<h2 class="text-xl font-semibold border-r border-gray-400 pr-2">{{ project.title }}</h2>
			<PsalmIcon name="calendar-plus" class="text-primary text-xl ml-2" />
			<PsalmIcon name="save" class="text-primary text-xl ml-2" />
		</div>

		<!-- TABLE WRAPPER -->
		<div class="flex max-h-[calc(100vh-5.75rem-4px)] max-w-[calc(100vw-2rem-2px)] border bg-white rounded shadow-lg m-2 px-2 py-4">
			<!-- TABLE -->
			<section class="grid overflow-scroll" :style="`grid-template-columns: auto repeat(${days.length * 2},3rem) auto;`">
				<!-- TOP-LEFT CORNER -->
				<div class="flex flex-col justify-end items-end row-span-2 sticky top-0 left-0 bg-white border-gray-400 border-r border-b z-10">
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
					class="h-[calc(3.75rem+1px)] grid col-span-2 sticky top-0 bg-white border-gray-400 border-l border-b px-1 text-sm overflow-ellipsis whitespace-nowrap text-center place-content-center"
				>
					<p class="font-semibold overflow-ellipsis overflow-hidden">{{ day.name }}</p>
					<p class="overflow-ellipsis overflow-hidden">10:30 - 14:60</p>
					<p class="overflow-ellipsis overflow-hidden">Marienschule</p>
				</div>

				<!-- TOP-RIGHT CORNER -->
				<div class="grid row-span-2 sticky top-0 right-0 bg-white border-gray-400 border-l border-b z-10"></div>

				<!-- "Kann" AND "Ist" LOOP -->
				<template v-for="day in days">
					<div :key="`available-header-${day.id}`" class="grid col-span-1 auto-cols-max sticky top-[calc(3.75rem+1px)] bg-white border-gray-400 border-l border-b px-1 text-xs place-content-center">Kann</div>
					<div :key="`deployed-header-${day.id}`" class="grid col-span-1 auto-cols-max sticky top-[calc(3.75rem+1px)] bg-white border-gray-400 border-l border-b px-1 text-xs place-content-center">Ist</div>
				</template>

				<!-- ROWS LOOP -->
				<template v-for="(employee, index) in staff">
					<!-- STAFF LOOP -->
					<div :key="employee.id" class="flex justify-between whitespace-nowrap sticky left-0 bg-white border-gray-400 border-r border-t" :class="{ 'bg-gray-200': index % 2 === 0 }">
						<div class="px-1">{{ employee.name }}</div>
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
						<div :key="`deployed-${day.id}-${employee.id}`" class="grid auto-cols-max border-gray-400 border-t border-l place-content-center" :class="{ 'bg-gray-200': index % 2 === 0 }">#2</div>
					</template>
					<!-- RIGHT STAFF LIST -->
					<div :key="`left-side-${employee.id}`" class="px-1 whitespace-nowrap sticky right-0 bg-white border-gray-400 border-l border-t" :class="{ 'bg-gray-200': index % 2 === 0 }">{{ employee.name }}</div>
				</template>
			</section>
		</div>
	</div>
</template>

<script lang="ts">
	// import { Employee, newEmployee } from "@/interfaces/Employee";
	// import store from "@/store";
	import { Project } from "@/interfaces/Project";
	import store from "@/store";
	import { Component, Vue } from "vue-property-decorator";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";

	@Component({
		name: "ProjectPage",
		components: { PsalmIcon, PsalmInput },
	})
	export default class ProjectPage extends Vue {
		staff = [
			{ id: 1, name: "Anna Pauls" },
			{ id: 2, name: "Hannes" },
			{ id: 3, name: "Paul" },
			{ id: 4, name: "Gerda" },
			{ id: 5, name: "Hannes2" },
			{ id: 6, name: "Paul4" },
			{ id: 7, name: "Gerda5" },
			{ id: 8, name: "Anna" },
			{ id: 9, name: "Hannes" },
			{ id: 10, name: "Paul" },
			{ id: 11, name: "Gerda" },
			{ id: 12, name: "Hannes2" },
			{ id: 13, name: "Paul4" },
			{ id: 14, name: "Gerda5" },
			{ id: 15, name: "Anna" },
			{ id: 16, name: "Hannes" },
			{ id: 17, name: "Paul" },
			{ id: 18, name: "Gerda" },
			{ id: 19, name: "Hannes2" },
			{ id: 20, name: "Paul4" },
			{ id: 21, name: "Gerda5" },
			{ id: 22, name: "Paul" },
			{ id: 23, name: "Paul4" },
			{ id: 24, name: "Gerda5" },
			{ id: 25, name: "Anna" },
			{ id: 26, name: "Hannes" },
			{ id: 27, name: "Paul" },
			{ id: 28, name: "Gerda" },
			{ id: 29, name: "Hannes2" },
			{ id: 30, name: "Paul4" },
			{ id: 31, name: "Gerda5" },
			{ id: 32, name: "Paul" },
			{ id: 33, name: "Paul4" },
			{ id: 34, name: "Gerda5" },
			{ id: 35, name: "Anna" },
			{ id: 36, name: "Hannes" },
			{ id: 37, name: "Paul" },
			{ id: 38, name: "Gerda" },
			{ id: 39, name: "Hannes2" },
			{ id: 40, name: "Paul4" },
			{ id: 41, name: "Gerda5" },
		];
		days = [
			{ id: 101, name: "16.03.2021" },
			{ id: 102, name: "day2" },
			{ id: 103, name: "day3" },
			{ id: 104, name: "day4" },
			{ id: 105, name: "day5" },
			{ id: 106, name: "day6" },
			{ id: 107, name: "day7" },
			{ id: 108, name: "day8" },
			{ id: 109, name: "day9" },
			{ id: 110, name: "day10" },
			{ id: 111, name: "day11" },
			{ id: 112, name: "day12" },
			{ id: 113, name: "day13" },
			{ id: 114, name: "day14" },
			{ id: 115, name: "day15" },
			{ id: 116, name: "day16" },
			{ id: 117, name: "day7" },
			{ id: 118, name: "day8" },
			{ id: 119, name: "day9" },
			{ id: 120, name: "day10" },
		];

		get project(): Project {
			return store.state.projects.get(this.$route.path.split("/")[2]) as Project;
		}

		beforeMounted(): void {
			console.log(this.days.length);
		}

		test(): void {
			console.log(this.$route.path.split("/")[2]);
		}
	}
</script>
