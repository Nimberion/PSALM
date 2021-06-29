import { newID } from "@/utils";
import { Employee } from "./Employee";

export interface EmployeeAvailability {
	available: boolean;
	deployed: boolean;
	reserve: boolean;
	indisposed: boolean;
}

export interface ProjectDay {
	id: string;
	date: Date;
	time: string;
	participant: string;
	staffAvailability: Map<string, EmployeeAvailability>;
}

export interface Project {
	id: string;
	title: string;
	numberOfRequiredStaff: number;
	projectDays: Array<ProjectDay>;
}

export function newEmployeeAvailability(available = false, deployed = false, reserve = false, indisposed = false) {
	return { available, deployed, reserve, indisposed };
}

export function newProjectDay(staff: Array<Employee>, id = newID(), date = new Date(), time = "", participant = ""): ProjectDay {
	const staffAvailability: Map<string, EmployeeAvailability> = new Map();

	staff.forEach((e) => staffAvailability.set(e.id, newEmployeeAvailability()));

	return { id, date, time, participant, staffAvailability };
}

export function newProject(id: string, staff: Array<Employee>, title = "", numberOfRequiredStaff = Number(""), projectDays = [newProjectDay(staff)]) {
	return { id, title, numberOfRequiredStaff, projectDays };
}

// export function test(): void {
// 	const id = "3grdsh56rs";
// 	const test = {
// 		[id]: {
// 			available: true,
// 			deployed: false,
// 			reserve: true,
// 			indisposed: false,
// 		},
// 	};
// 	//.set(key, value)
// 	test[id].available;
// }

//.toLocaleTimeString("de-DE", {day: '2-digit', month:'2-digit', year: '2-digit'}
