<template>
	<input v-if="type === 'text'" type="text" :value="value" class="rounded focus:ring-primary focus:ring-2 border-0 focus:border-0 focus:-translate-x-1 focus:-translate-y-1 focus:shadow-input p-0 px-1" @change="update" />
	<input v-else-if="type === 'checkbox'" type="checkbox" :checked="value" class="place-self-center rounded text-primary focus:ring-primary focus:border-primary cursor-pointer" @change="update" />
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component({
		name: "Input",
	})
	export default class Input extends Vue {
		@Prop({ required: true }) type!: string;
		@Prop({ required: true }) value!: string | boolean;

		update(e: { target: HTMLInputElement }): void {
			switch (this.type) {
				case "text":
					this.$emit("input", e.target.value);
					break;

				case "checkbox":
					this.$emit("input", e.target.checked as boolean);
					break;
			}
		}
	}
</script>
