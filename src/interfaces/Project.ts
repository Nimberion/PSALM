import { newID } from "@/utils";
import { Employee } from "./Employee";

export enum Available {
	true = "TRUE",
	false = "FALSE",
	indisposed = "INDISPOSED",
}

export enum Deployed {
	true = "TRUE",
	false = "FALSE",
	reserve = "RESERVE",
}
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

export function newEmployeeAvailability(employeeId: string, available = Available.false, deployed = Deployed.false): EmployeeAvailability {
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

export function findEmployeeAvailability(staffAvailability: Array<EmployeeAvailability>, employeeId: string): EmployeeAvailability | undefined {
	return staffAvailability.find((e) => e.employeeId === employeeId);
}

export function getNumberOfAvailabilities(project: Project, employeeId: string): number {
	let i = 0;

	project.projectDays.forEach((e) => {
		const isEmployeeAvailable = findEmployeeAvailability(e.staffAvailability, employeeId)?.available;

		if (isEmployeeAvailable === Available.true) {
			i++;
		}
	});

	return i;
}

export function getNumberOfDeployments(project: Project, employeeId: string): number {
	let i = 0;

	project.projectDays.forEach((e) => {
		const isEmployeeAvailable = findEmployeeAvailability(e.staffAvailability, employeeId)?.deployed;

		if (isEmployeeAvailable === Deployed.true) {
			i++;
		}
	});

	return i;
}

export function getSetPointOfDeployments(project: Project, staff: Array<Employee>, employee: Employee): number | string {
	if (employee.fullTime) {
		return "-";
	} else {
		// GET NUMBER OF ALL POSSIBLE DEPLOYMENTS (MINUS DEPLOYMENTS OF FULL TIME)
		let possibleDeployments = project.numberOfRequiredStaff * project.projectDays.length;

		staff.forEach((tempEmployee) => {
			if (tempEmployee.fullTime) {
				possibleDeployments -= getNumberOfDeployments(project, tempEmployee.id);
			}
		});

		// GET NUMBER OF ALL STAFF AVAILABILITIES (EXCEPT FOR FULL TIME)
		let allAvailabilities = 0;

		staff.forEach((tempEmployee) => {
			if (!tempEmployee.fullTime) {
				allAvailabilities += getNumberOfAvailabilities(project, tempEmployee.id);
			}
		});

		// RETURN SET POINT BASED ON THE PERCENTAGE AVAILABILITY, BUT NOT HIGHTER THAN THE OWN AVAILABILITY
		const setPointOfDeployments = Math.round((getNumberOfAvailabilities(project, employee.id) / allAvailabilities) * possibleDeployments * 10) / 10;
		const employeeAvailability = getNumberOfAvailabilities(project, employee.id);

		if (setPointOfDeployments > employeeAvailability) {
			return employeeAvailability;
		} else {
			return setPointOfDeployments;
		}
	}
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
