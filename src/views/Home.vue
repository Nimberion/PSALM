<template>
	<!-- <div class="grid grid-cols-2 grid-rows-[auto] justify-items-center"> -->
	<div class="flex flex-col lg:flex-row place-items-center lg:place-items-start lg:justify-center p-2">
		<ProjectList />
		<Staff />
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
