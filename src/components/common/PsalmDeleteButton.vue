<template>
	<!-- hover:translate-y-[-2px] -->
	<button class="text-danger select-none place-self-center filter hover:brightness-[0.8]" title="Löschen" @click="$emit('click')">
		<PsalmIcon name="trash" />
	</button>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";

	@Component({
		name: "PsalmDeleteButton",
		components: { PsalmIcon },
	})
	export default class PsalmDeleteButton extends Vue {}
</script>
