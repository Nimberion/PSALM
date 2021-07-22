import { Available } from "@/models/enums/Available";
import { Deployed } from "@/models/enums/Deployed";
import { Employee } from "@/models/interfaces/Employee";
import { EmployeeAvailability, Project } from "@/models/interfaces/Project";
import store from "@/store";
import { jsPDF } from "jspdf";

export function findEmployeeAvailability(staffAvailability: Array<EmployeeAvailability>, employeeId: string): EmployeeAvailability | undefined {
	return staffAvailability.find((e) => e.employeeId === employeeId);
}

export function getNumberOfAvailabilities(project: Project, employeeId: string): number {
	let i = 0;

	project.projectDays.forEach((e) => {
		const isEmployeeAvailable = findEmployeeAvailability(e.staffAvailability, employeeId)?.available;

		if (isEmployeeAvailable === Available.TRUE) {
			i++;
		}
	});

	return i;
}

export function getNumberOfDeployments(project: Project, employeeId: string): number {
	let i = 0;

	project.projectDays.forEach((e) => {
		const isEmployeeAvailable = findEmployeeAvailability(e.staffAvailability, employeeId)?.deployed;

		if (isEmployeeAvailable === Deployed.TRUE) {
			i++;
		}
	});

	return i;
}

export function getSetPointOfDeployments(project: Project, staff: Array<Employee>, employee: Employee): number | string {
	if (employee.fullTime) {
		return "-";
	} else if (project.numberOfRequiredStaff === 0) {
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
		} else if (isNaN(setPointOfDeployments) || setPointOfDeployments < 0) {
			return "0";
		} else {
			return setPointOfDeployments;
		}
	}
}

export function writePdfForEachEmployee(project: Project): void {
	const staff = store.state.staff;

	project.staff.forEach((employeeId) => {
		const employee = staff.find((e) => e.id === employeeId);
		const deployedProjectDays: Array<{ date: string; time: string; participant: string; reserve: string }> = [];

		project.projectDays.forEach((projectDay) => {
			const deployedProjectDay = projectDay.staffAvailability.find((e) => e.employeeId === employeeId && (e.deployed === Deployed.TRUE || e.deployed === Deployed.RESERVE));

			if (deployedProjectDay) {
				const splittedDate = projectDay.date.toString().split("-");
				const formattedDate = `${splittedDate[2]}.${splittedDate[1]}.${splittedDate[0]}`;
				const reserve = deployedProjectDay?.deployed === Deployed.RESERVE ? "Ja" : "-";

				deployedProjectDays.push({ date: formattedDate, time: projectDay.time, participant: projectDay.participant, reserve: reserve });
			}
		});

		if (deployedProjectDays.length > 0 && employee?.lastName) {
			const doc = new jsPDF({ format: "a4", orientation: "p", unit: "mm" });
			doc.setFontSize(20);
			doc.text(project.title, 105, 25, { align: "center", maxWidth: 160 });
			doc.setFontSize(14);
			doc.text(`Name: ${employee?.firstName} ${employee?.lastName}`, 25, 45);

			doc.table(
				25,
				55,
				deployedProjectDays,
				[
					{ name: "date", prompt: "Datum", align: "center", padding: 0, width: 38 },
					{ name: "time", prompt: "Uhrzeit", align: "center", padding: 0, width: 42 },
					{ name: "participant", prompt: "Teilnehmer", align: "center", padding: 0, width: 92 },
					{ name: "reserve", prompt: "Reserve?", align: "center", padding: 0, width: 38 },
				],
				{ padding: 3, printHeaders: true, autoSize: false },
			);

			doc.save(`${employee?.lastName.replaceAll(" ", "_")}_${employee?.firstName.replaceAll(" ", "_")}_-_${project.title.replaceAll(" ", "_")}.pdf`);
		}
	});
}
