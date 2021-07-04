<template>
	<button class="flex justify-center min-w-[6rem] text-white rounded p-2 m-4 mb-0" @click="$emit('click')">
		<!-- :class="`bg-${color}`" -->
		<PsalmIcon v-if="icon" :name="icon" />
		<span class="text-sm leading-4"><slot /></span>
	</button>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";

	@Component({
		name: "PsalmButton",
		components: { PsalmIcon },
	})
	export default class PsalmButton extends Vue {
		@Prop({ required: false }) icon!: string;
		// @Prop({ required: true }) color!: string;
	}
</script>
