<template>
	<div class="flex flex-col lg:flex-row place-items-center lg:place-items-start lg:justify-center">
		<div>Projekt</div>
		<div>{{ project }}</div>
		<button @click="test" class="bg-white">Test</button>
	</div>
</template>

<script lang="ts">
	// import { Employee, newEmployee } from "@/interfaces/Employee";
	// import store from "@/store";
	import { Project } from "@/interfaces/Project";
	import store from "@/store";
	import { Component, Vue } from "vue-property-decorator";
	// import Icon from "@/components/common/Icon.vue";
	// import TextInput from "@/components/common/TextInput.vue";
	// import Checkbox from "@/components/common/TextInput.vue";

	@Component({
		name: "ProjectPage",
		components: {},
	})
	export default class ProjectPage extends Vue {
		get project(): Project {
			return store.state.projects.get(this.$route.path.split("/")[2]) as Project;
		}

		mounted(): void {
			console.log(this.$route.name);
		}

		test(): void {
			console.log(this.$route.path.split("/")[2]);
		}
	}
</script>
