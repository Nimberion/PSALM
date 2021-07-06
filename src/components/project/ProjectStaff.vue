<template>
	<section class="">
		<h2 class="text-center font-semibold mb-4">Mitarbeiter</h2>
		<ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4">
			<li v-for="employee in staff" :key="employee.id">
				<label class="grid grid-cols-[auto,1fr] cursor-pointer">
					<input type="checkbox" v-model="tempProjectStaff" :value="employee.id" class="cursor-pointer place-self-center rounded text-primary focus:ring-primary focus:border-primary mr-2" @change="updateTempProjectStaff" />
					<span>{{ employee.firstName }} {{ employee.lastName }}</span>
				</label>
			</li>
		</ul>
	</section>
</template>

<script lang="ts">
	import store from "@/store";
	import { Component, Prop, Vue } from "vue-property-decorator";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";
	import { Employee } from "@/interfaces/Employee";

	@Component({
		name: "ProjectStaff",
		components: { PsalmButton, PsalmIcon, PsalmInput },
	})
	export default class ProjectStaff extends Vue {
		@Prop({ required: true }) projectStaff!: Array<string>;

		tempProjectStaff: Array<string> = [];

		get staff(): Array<Employee> {
			return store.state.staff;
		}

		mounted(): void {
			this.tempProjectStaff = this.projectStaff;
		}

		updateTempProjectStaff(): void {
			this.$emit("update", this.tempProjectStaff);
		}
	}
</script>
