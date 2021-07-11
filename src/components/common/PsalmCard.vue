<template>
	<div class="bg-white rounded-sm shadow-card m-2 px-2 py-4">
		<slot />
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";

	@Component({
		name: "PsalmCard",
		components: {},
	})
	export default class PsalmCard extends Vue {}
</script>
