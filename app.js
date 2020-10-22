const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const util = require("util");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");

const writeFileAsync = util.promisify(fs.writeFile);

const allEmployees = [];



const generalQuestions = [
    {
        name: "name",
        type: "input",
        message: "Enter employee name: "
    },
    {
        name: "id",
        type: "input",
        message: "Enter employee id: "
    },
    {
        name: "email",
        type: "input",
        message: "Enter employee email: "
    },
    {
        name: "role",
        type: "list",
        message: "Pick employee role: ",
        choices: ["Employee", "Engineer", "Manager", "Intern"]
    },

];


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)


async function getNextEmployee() {

    try {
        // console.log("waiting");
        const employee = await inquirer.prompt(generalQuestions);
        // console.log("not waiting");


        switch (employee.role) {
            case "Manager":
                const officeNumber = await inquirer.prompt({
                    name: "value",
                    type: "input",
                    message: "Enter manager office number: "
                });
                allEmployees.push(new Manager(employee.name, employee.id, employee.email, officeNumber.value));
                break;
            case "Engineer":
                const github = await inquirer.prompt({
                    name: "value",
                    type: "input",
                    message: "Enter engineer github account: "
                });
                allEmployees.push(new Engineer(employee.name, employee.id, employee.email, github.value));
                break;
            case "Intern":
                const school = await inquirer.prompt({
                    name: "value",
                    type: "input",
                    message: "Enter intern school: "
                });
                allEmployees.push(new Intern(employee.name, employee.id, employee.email, school.value));
                break;
            default:
                allEmployees.push(new Employee(employee.name, employee.id, employee.email));
                break;
        }

    } catch (error) {
        throw Error(error);
    }

}


async function init() {

    try {
        console.log("Please enter employee info");
        let anotherEmployee = true;
        while (anotherEmployee) {
            await getNextEmployee();
            const continueSelection = await inquirer.prompt({
                name: "selection",
                type: "list",
                message: "Would you like to add another employee? ",
                choices: ["Yes", "No"]
            });

            switch (continueSelection.selection) {
                case "No": anotherEmployee = false;
                    const finalFile = await render(allEmployees);
                    await writeFileAsync(outputPath, finalFile);
                    break;
                default:
                    break;
            }
        }

    } catch (error) {
        throw Error(error);
    }

}
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```


init();