<template>
	<!-- <div class="grid grid-cols-2 grid-rows-[auto] justify-items-center"> -->
	<div class="flex flex-col 2xl:flex-row place-items-center 2xl:place-items-start 2xl:justify-center">
		<Projects class="max-w-max m-2 ml-0" />
		<Staff class="max-w-max m-2 mr-0" />
	</div>
</template>

<script>
	// @ is an alias to /src
	import Projects from "@/components/projects/Projects.vue";
	import Staff from "@/components/staff/Staff.vue";

	export default {
		name: "Home",
		components: {
			Projects,
			Staff,
		},
	};
</script>
