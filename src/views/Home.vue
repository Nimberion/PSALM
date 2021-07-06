<template>
	<!-- <div class="grid grid-cols-2 grid-rows-[auto] justify-items-center"> -->
	<div class="flex flex-col lg:flex-row place-items-center lg:place-items-start lg:justify-center">
		<ProjectList class="w-[500px] m-2 lg:ml-0" />
		<Staff class="w-[500px] m-2 lg:mr-0" />
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import ProjectList from "@/components/home/ProjectList.vue";
	import Staff from "@/components/home/Staff.vue";

	@Component({
		name: "Home",
		components: {
			ProjectList,
			Staff,
		},
	})
	export default class Home extends Vue {}
</script>
