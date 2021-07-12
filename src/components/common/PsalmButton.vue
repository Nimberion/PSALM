<template>
	<!-- hover:translate-y-[-2px] -->
	<button class="flex justify-center min-w-[6rem] text-white rounded-[1px] select-none p-2 m-4 mb-0 hover:bg-gradient-to-t from-[rgba(0,0,0,0.15)] to-[rgba(0,0,0,0.15)]" @click="$emit('click')">
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
	}
</script>
