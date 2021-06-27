<template>
	<!-- <div class="grid grid-cols-2 grid-rows-[auto] justify-items-center"> -->
	<div class="flex flex-col 2xl:flex-row place-items-center 2xl:place-items-start 2xl:justify-center">
		<Projects class="m-2 ml-0" />
		<Staff class="m-2 mr-0" />
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import Projects from "@/components/projects/Projects.vue";
	import Staff from "@/components/staff/Staff.vue";

	@Component({
		name: "Home",
		components: {
			Projects,
			Staff,
		},
	})
	export default class Home extends Vue {}
</script>
