import { newID } from "@/utils/utils";
import { Employee } from "./Employee";
import { Available } from "@/models/enums/Available";
import { Deployed } from "@/models/enums/Deployed";

export interface EmployeeAvailability {
	employeeId: string;
	available: Available;
	deployed: Deployed;
}

export interface ProjectDayType {
	id: string;
	title: string;
}

export interface ProjectDay {
	id: string;
	type: string;
	date: string;
	time: string;
	participant: string;
	staffAvailability: Array<EmployeeAvailability>;
}

export interface Project {
	id: string;
	title: string;
	numberOfRequiredStaff: number;
	staff: Array<string>;
	projectDayTypes: Array<ProjectDayType>;
	projectDays: Array<ProjectDay>;
}

export function newEmployeeAvailability(employeeId: string, available = Available.FALSE, deployed = Deployed.FALSE): EmployeeAvailability {
	return { employeeId, available, deployed };
}

export function newProjectDay(staff: Array<Employee>, id = newID(), type = "", date = new Date().toISOString().split("T")[0], time = "", participant = ""): ProjectDay {
	const staffAvailability: Array<EmployeeAvailability> = [];

	staff.forEach((e) => staffAvailability.push(newEmployeeAvailability(e.id)));

	return { id, type, date, time, participant, staffAvailability };
}

export function newProjectDayType(id = newID(), title = ""): ProjectDayType {
	return { id, title };
}

export function newProject(id = newID(), title = "", numberOfRequiredStaff = Number(""), projectDays = [newProjectDay([])], staff = [] as Array<string>, projectDayTypes = [newProjectDayType()]): Project {
	return { id, title, numberOfRequiredStaff, staff, projectDayTypes, projectDays };
}
