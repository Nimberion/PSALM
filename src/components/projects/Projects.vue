<template>
	<div class="max-w-max md:grid md:grid-cols-[auto,auto] md:grid-rows-[auto,auto] bg-white rounded shadow-lg p-4">
		<h2 class="col-span-2 font-semibold text-center mb-4">Projekte</h2>
		<!-- STAFF LIST -->
		<ul class="w-[300px] h-[max-content] border text-center bg-white rounded shadow-lg mb-4 md:mb-0 md:mr-1 p-2">
			<!-- <li class="cursor-pointer p-1" :class="{ 'bg-[#33658A] rounded text-white': employee.id === id }" v-for="employee in staff" :key="employee.id" @click="setEmployee(employee)">
				<span>{{ employee.firstName }} {{ employee.lastName }}</span>
				<button class="text-sm font-extrabold text-red-700 ml-2" @click="triggerDeleteModal(employee)">X</button>
			</li> -->
		</ul>

		<div class="w-[300px] md:ml-1" />
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";

	@Component({
		name: "Projects",
	})
	export default class Projects extends Vue {}
</script>
