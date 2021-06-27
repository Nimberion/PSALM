<template>
	<!-- <div class="grid grid-cols-2 grid-rows-[auto] justify-items-center"> -->
	<div class="flex flex-col lg:flex-row place-items-center lg:place-items-start lg:justify-center">
		<Projects class="m-2 lg:ml-0" />
		<Staff class="m-2 lg:mr-0" />
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
