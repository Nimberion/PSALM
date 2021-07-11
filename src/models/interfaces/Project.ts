import { newID } from "@/utils/utils";
import { Employee } from "./Employee";
import { Available } from "@/models/enums/Available";
import { Deployed } from "@/models/enums/Deployed";

export interface EmployeeAvailability {
	employeeId: string;
	available: Available;
	deployed: Deployed;
}

export interface ProjectDay {
	id: string;
	date: Date;
	time: string;
	participant: string;
	staffAvailability: Array<EmployeeAvailability>;
}

export interface Project {
	id: string;
	title: string;
	numberOfRequiredStaff: number;
	staff: Array<string>;
	projectDays: Array<ProjectDay>;
}

export function newEmployeeAvailability(employeeId: string, available = Available.FALSE, deployed = Deployed.FALSE): EmployeeAvailability {
	return { employeeId, available, deployed };
}

export function newProjectDay(staff: Array<Employee>, id = newID(), date = new Date(), time = "", participant = ""): ProjectDay {
	const staffAvailability: Array<EmployeeAvailability> = [];

	staff.forEach((e) => staffAvailability.push(newEmployeeAvailability(e.id)));

	return { id, date, time, participant, staffAvailability };
}

export function newProject(id: string, title = "", numberOfRequiredStaff = Number(""), projectDays = [newProjectDay([])], staff = [] as Array<string>): Project {
	return { id, title, numberOfRequiredStaff, staff, projectDays };
}
