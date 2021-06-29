<template>
	<!-- :class="{ 'bg-primary rounded text-white': employee.id === id }"
	min-w von window = 500px-->
	<div class="w-[max-content] h-[max-content] border text-center bg-white rounded shadow-lg p-2 m-2">ABOUT{{ day }}</div>
</template>

<script lang="ts">
	// import { Employee, newEmployee } from "@/interfaces/Employee";
	// import store from "@/store";
	import { Component, Vue } from "vue-property-decorator";
	// import Icon from "@/components/common/Icon.vue";
	// import TextInput from "@/components/common/TextInput.vue";
	// import Checkbox from "@/components/common/TextInput.vue";

	@Component({
		name: "About",
		components: {},
	})
	export default class About extends Vue {
		today = new Date(1992, 11, 19);
		options = { year: "numeric" as const, month: "2-digit" as const, day: "2-digit" as const };
		day = this.today.toLocaleTimeString("de-DE", this.options);
		// 	tempStaff: Array<Employee> = [];
		// 	get staff(): Array<Employee> {
		// 		return store.getters.sortedStaff;
		// 	}
		// 	created(): void {
		// 		this.tempStaff = JSON.parse(JSON.stringify(this.staff));
		// 	}
		// 	updateCheckbox(nativeValue: boolean, value: boolean): void {
		// 		nativeValue = value;
		// 	}
		// 	addEmployee(): void {
		// 		this.tempStaff.push(newEmployee());
		// 	}
		// 	saveStaff(): void {
		// 		add mutation in store which sorts as well
		// 		store.state.staff = this.tempStaff;
		// 	}
	}
</script>
