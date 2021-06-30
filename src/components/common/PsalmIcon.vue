<template>
	<!-- FOLDER-OPEN -->
	<svg v-if="name === 'folder-open'" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="folder-open" class="h-[1em]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
		<path
			fill="currentColor"
			d="M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z"
		></path>
	</svg>
	<!-- FOLDER-PLUS -->
	<svg v-else-if="name === 'folder-plus'" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="folder-plus" class="h-[1em]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
		<path
			fill="currentColor"
			d="M464,128H272L208,64H48A48,48,0,0,0,0,112V400a48,48,0,0,0,48,48H464a48,48,0,0,0,48-48V176A48,48,0,0,0,464,128ZM359.5,296a16,16,0,0,1-16,16h-64v64a16,16,0,0,1-16,16h-16a16,16,0,0,1-16-16V312h-64a16,16,0,0,1-16-16V280a16,16,0,0,1,16-16h64V200a16,16,0,0,1,16-16h16a16,16,0,0,1,16,16v64h64a16,16,0,0,1,16,16Z"
		></path>
	</svg>
	<!-- HOME -->
	<svg v-else-if="name === 'home'" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="home" class="h-[1em]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
		<path
			fill="currentColor"
			d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"
		></path>
	</svg>
	<!-- SAVE -->
	<svg v-else-if="name === 'save'" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="save" class="h-[1em]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
		<path
			fill="currentColor"
			d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"
		></path>
	</svg>
	<!-- TRASH -->
	<svg v-else-if="name === 'trash'" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash-alt" class="h-[1em]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
		<path
			fill="currentColor"
			d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"
		></path>
	</svg>
	<!-- USER-PLUS -->
	<svg v-else-if="name === 'user-plus'" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-plus" class="h-[1em]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
		<path
			fill="currentColor"
			d="M624 208h-64v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-64h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
		></path>
	</svg>
	<div v-else class="text-xs">Error</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component({
		name: "PsalmIcon",
	})
	export default class PsalmIcon extends Vue {
		@Prop({ required: true }) name!: string;
	}
</script>
