<template>
	<div class="flex flex-col place-items-center">
		<div class="flex place-items-center border bg-white rounded shadow-lg m-2 p-2">
			<h2 class="text-xl text-center font-semibold">{{ project.title }}</h2>
			<PsalmIcon name="save" class="ml-2 text-[1.25rem] text-primary" />
			<div class="ml-2">Cancel</div>
		</div>

		<div class="flex max-h-[calc(100vh-5.75rem)] max-w-[calc(100vw-2rem)] border bg-white rounded shadow-lg m-2 px-2 py-4">
			<section class="grid overflow-scroll" :style="`grid-template-columns: auto repeat(${days.length * 2},3rem);`">
				<!-- grid-rows-[auto,repeat(${staff.length},auto)] -->
				<div class="grid row-span-2 sticky top-0 left-0 bg-white border-gray-400 border-r border-b z-10">Filter?</div>

				<div
					v-for="day in days"
					:key="`data-${day.id}`"
					class="h-[calc(3.75rem+1px)] grid col-span-2 sticky top-0 bg-white border-gray-400 border-l border-b px-1 text-sm overflow-ellipsis whitespace-nowrap text-center place-content-center"
				>
					<p class="font-semibold overflow-ellipsis overflow-hidden">{{ day.name }}</p>
					<p class="overflow-ellipsis overflow-hidden">10:30 - 14:60</p>
					<p class="overflow-ellipsis overflow-hidden">Marienschule</p>
				</div>
				<template v-for="day in days">
					<div :key="`available-header-${day.id}`" class="grid col-span-1 auto-cols-max sticky top-[calc(3.75rem+1px)] bg-white border-gray-400 border-l border-b px-1 text-xs place-content-center">Kann</div>
					<div :key="`deployed-header-${day.id}`" class="grid col-span-1 auto-cols-max sticky top-[calc(3.75rem+1px)] bg-white border-gray-400 border-l border-b px-1 text-xs place-content-center">Ist</div>
				</template>

				<template v-for="employee in staff">
					<div :key="employee.id" class="grid auto-cols-max sticky left-0 bg-white border-gray-400 border-r border-t px-1">{{ employee.name }}</div>
					<template v-for="day in days">
						<div :key="`available-${day.id}-${employee.id}`" class="grid auto-cols-max border-gray-400 border-t border-l place-content-center">#1</div>
						<div :key="`deployed-${day.id}-${employee.id}`" class="grid auto-cols-max border-gray-400 border-t border-l place-content-center">#2</div>
					</template>
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
