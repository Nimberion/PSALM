<template>
	<div>
		<Staff />
	</div>
</template>

<script>
	// @ is an alias to /src
	import Staff from "@/components/staff/Staff.vue";

	export default {
		name: "Home",
		components: {
			Staff,
		},
	};
</script>
