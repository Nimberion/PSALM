<template>
	<div class="grid grid-cols-[auto,auto] grid-rows-[auto,auto] bg-white rounded shadow-lg p-4">
		<h2 class="col-span-2 font-semibold text-center mb-4">Projekte</h2>
		<!-- STAFF LIST -->
		<ul class="w-[300px] h-[max-content] border mr-1 p-2 text-center bg-white rounded shadow-lg">
			<li class="cursor-pointer p-1" :class="{ 'bg-gray-400 rounded': employee.id === id }" v-for="employee in staff" :key="employee.id" @click="setEmployee(employee)">
				<span>{{ employee.firstName }} {{ employee.lastName }}</span>
				<button class="text-sm font-extrabold text-red-700 ml-2" @click="triggerDeleteModal(employee)">X</button>
			</li>
		</ul>
		<EditStaffForm class="w-[300px] h-[max-content]" :_first-name="firstName" :_last-name="lastName" :_full-time="fullTime" @add-employee="addEmployee" @save-employee="saveEmployee" @change="editEmployee" />
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import EditStaffForm from "@/components/staff/EditStaffForm.vue";

	@Component({
		name: "Projects",
		components: { EditStaffForm },
	})
	export default class Projects extends Vue {}
</script>
