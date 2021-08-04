<template>
	<!-- max-h-[calc(100vh-6.875rem)] -->
	<PsalmCard class="w-[200px] h-full pt-4 pb-2">
		<h2 class="text-center font-semibold mb-4">Mitarbeiter</h2>
		<!-- max-h-[calc(100%-2.5rem)] -->

		<ul class="overflow-y-scroll scrollbar-p-2 max-h-[calc(100vh-10.875rem)] pl-4">
			<li v-for="employee in staff" :key="employee.id">
				<label class="flex cursor-pointer items-center">
					<input
						type="checkbox"
						v-model="tempProjectStaff"
						:value="employee.id"
						class="h-[1.125rem] w-[1.125rem] border-2 border-primary place-self-center text-primary focus:ring-secondary focus:ring-1 cursor-pointer mr-2 my-1"
						@change="updateTempProjectStaff"
					/>
					<span class="overflow-ellipsis overflow-hidden whitespace-nowrap" :title="`${employee.firstName} ${employee.lastName}`">{{ employee.firstName }} {{ employee.lastName }} </span>
				</label>
			</li>
		</ul>
	</PsalmCard>
</template>

<script lang="ts">
	import store from "@/store";
	import { Component, Prop, Vue } from "vue-property-decorator";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmCard from "@/components/common/PsalmCard.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";
	import { Employee } from "@/models/interfaces/Employee";

	@Component({
		name: "ProjectStaff",
		components: { PsalmButton, PsalmCard, PsalmIcon, PsalmInput },
	})
	export default class ProjectStaff extends Vue {
		@Prop({ required: true }) projectStaff!: Array<string>;

		tempProjectStaff: Array<string> = [];

		get staff(): Array<Employee> {
			return store.state.fileStaff;
		}

		mounted(): void {
			this.tempProjectStaff = this.projectStaff;
			console.log(this.tempProjectStaff);
		}

		updateTempProjectStaff(): void {
			this.$emit("update", this.tempProjectStaff);
		}
	}
</script>
