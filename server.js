const Inquirer = require("inquirer");
const DB = require("./config/connection");
const Employee = require("./lib/Employee.js");
const Role = require("./lib/Role.js");
const Department = require("./lib/Department.js");
let employee = new Employee(DB);
let role = new Role(DB);
let department = new Department(DB);

function start() {
    let question = "What would you like to do?";
    let options = [
        "View All Employees",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Roles",
        "Add Role",
        "Remove Role",
        "View All Departments",
        "Add Department",
        "Remove Department",
        "Exit"
    ];
    Inquirer.prompt(
        {
            name: "choice",
            type: "list",
            message: question,
            choices: options
        }
    ).then((data) => {
        switch (data.choice) {
            case "View All Employees":
                employee.printEmployees();
                start();
                break;
            case "View All Roles":
                role.printRoles();
                start();
                break;
            case "View All Departments":
                department.printDepartments();
                start();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Update Employee Manager":
                updateEmployeeManager();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Remove Role":
                removeRole();
                break;
            case "Remove Department":
                removeDepartment();
                break;
            case "Exit":
                break;
            default:
                console.log(`Please enter a valid choice`);
                start();
                break;
        }
    });
}

function addDepartment() {
    let question = "Please add a department";
    Inquirer.prompt(
        {
            name: "department",
            type: "input",
            message: question
        }
    ).then((data) => {
        department.insertDepartment(data.department);
        start();
    });
}

function addRole() {
    let departments = []; 
    DB.query("SELECT * FROM department",
        function (err, res) {
            if (err) console.log(err);
            for (let i = 0; i < res.length; i++) {
                if (res[i].name) {
                    departments.push(res[i].name);
                }
            }

            let questions = [
                "Please add a title for the role",
                "Please add a salary for the role",
                "Please add a department for the role"];
            Inquirer.prompt([
                {
                    name: "title",
                    type: "input",
                    message: questions[0]
                },
                {
                    name: "salary",
                    type: "number",
                    message: questions[1]
                },
                {
                    name: "department",
                    type: "list",
                    message: questions[2],
                    choices: departments
                }
            ]).then((data) => {
                let departmentId = null;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].name === data.department) {
                        departmentId = res[i].id;
                        break;
                    }
                }
                role.insertRole(data.title, data.salary, departmentId);
                start();
            });

        }
    );
}

function addEmployee() {
    let roles = [];
    let managers = [];  
    DB.query("SELECT * FROM role",
        function (err, roleRes) {
            if (err) console.log(err);
            for (let i = 0; i < roleRes.length; i++) {
                if (roleRes[i].title) {
                    roles.push(roleRes[i].title);
                }
            }

            DB.query("SELECT * from employee",
                function (err, empRes) {
                    if (err) console.log(err);
                    for (let i = 0; i < empRes.length; i++) {
                        if (empRes[i].first_name) {
                            managers.push(empRes[i].first_name + " " + empRes[i].last_name);
                        }
                    }
                    
                    let questions = [
                        "Please enter a first name for the employee",
                        "Please enter a last name for the employee",
                        "Please enter a role for the employee",
                        "Please enter the employees manager"];
                    Inquirer.prompt([
                        {
                            name: "firstName",
                            type: "input",
                            message: questions[0]
                        },
                        {
                            name: "lastName",
                            type: "input",
                            message: questions[1]
                        },
                        {
                            name: "role",
                            type: "list",
                            message: questions[2],
                            choices: roles
                        },
                        {
                            name: "manager",
                            type: "list",
                            message: questions[3],
                            choices: managers
                        }
                    ]).then((data) => {
                        let roleId = null;
                        for (let i = 0; i < roleRes.length; i++) {
                            if (roleRes[i].title === data.role) {
                                roleId = roleRes[i].id;
                                break;
                            }
                        }
                        let managerId = null;
                        for (let i = 0; i < empRes.length; i++) {
                            if (empRes[i].first_name + " " + empRes[i].last_name === data.manager) {
                                managerId = empRes[i].id;
                                break;
                            }
                        }
                        employee.insertEmployee(data.firstName, data.lastName, roleId, managerId);
                        start();
                    });

                }
            );
        }
    );
}

function updateEmployeeRole() {
    let roles = [];
    let employees = []; 
    DB.query("SELECT * FROM role",
        function (err, roleRes) {
            if (err) console.log(err);
            for (let i = 0; i < roleRes.length; i++) {
                if (roleRes[i].title) {
                    roles.push(roleRes[i].title);
                }
            }

            DB.query("SELECT * from employee",
                function (err, empRes) {
                    if (err) console.log(err);
                    for (let i = 0; i < empRes.length; i++) {
                        if (empRes[i].first_name) {
                            employees.push(empRes[i].first_name + " " + empRes[i].last_name);
                        }
                    }

                    let questions = [
                        "Please enter the role you wish to update",
                        "Please enter the new role"];
                    Inquirer.prompt([
                        {
                            name: "employee",
                            type: "list",
                            message: questions[0],
                            choices: employees
                        },
                        {
                            name: "role",
                            type: "list",
                            message: questions[1],
                            choices: roles
                        }
                    ]).then((data) => {
                        let roleId = null;
                        for (let i = 0; i < roleRes.length; i++) {
                            if (roleRes[i].title === data.role) {
                                roleId = roleRes[i].id;
                                break;
                            }
                        }
                        for (let i = 0; i < empRes.length; i++) {
                            if (empRes[i].first_name + " " + empRes[i].last_name === data.employee) {
                                employee.setProperties(empRes[i]);
                                employee.role_id = roleId;
                                employee.updateEmployee();
                                break;

                            }
                        }
                        start();
                    });

                }
            );
        }
    );
}

function updateEmployeeManager() {
    let managers = [];
    let employees = [];
    DB.query("SELECT * FROM employee",
        function (err, res) {
            if (err) console.log(err);
            for (let i = 0; i < res.length; i++) {
                if (res[i].first_name) {
                    employees.push(res[i].first_name + " " + res[i].last_name);
                    managers.push(res[i].first_name + " " + res[i].last_name);
                }
            }

            let questions = [
                "Please enter the manager you would like to update",
                "Please enter the new manager"];
            Inquirer.prompt([
                {
                    name: "employee",
                    type: "list",
                    message: questions[0],
                    choices: employees
                },
                {
                    name: "manager",
                    type: "list",
                    message: questions[1],
                    choices: managers
                }
            ]).then((data) => {
                let managerId = null;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].first_name + " " + res[i].last_name === data.manager) {
                        managerId = res[i].id;
                        break;
                    }
                }
                for (let i = 0; i < res.length; i++) {
                    if (res[i].first_name + " " + res[i].last_name === data.employee) {
                        employee.setProperties(res[i]);
                        employee.manager_id = managerId;
                        employee.updateEmployee();
                        break;
                    }
                }
                start();
            });
        }
    );
}

function removeEmployee() {
    let employees = []; 
    DB.query("SELECT * FROM employee",
        function (err, res) {
            if (err) console.log(err);
            for (let i = 0; i < res.length; i++) {
                if (res[i].first_name && res[i].last_name) {
                    employees.push(res[i].first_name + " " + res[i].last_name);
                }
            }
            let question = "Please enter the employee you wish to remove";
            Inquirer.prompt([
                {
                    name: "employee",
                    type: "list",
                    message: question,
                    choices: employees
                }
            ]).then((data) => {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].first_name + " " + res[i].last_name === data.employee) {
                        employee.setProperties(res[i]);
                        employee.deleteEmployee();
                        break;
                    }
                }
                start();
            });

        }
    );
}

function removeRole() {
    let roles = [];   
    DB.query("SELECT * FROM role",
        function (err, res) {
            if (err) console.log(err);
            for (let i = 0; i < res.length; i++) {
                if (res[i].title) {
                    roles.push(res[i].title);
                }
            }
            let question = "Please enter the role you wish to remove";
            Inquirer.prompt([
                {
                    name: "role",
                    type: "list",
                    message: question,
                    choices: roles
                }
            ]).then((data) => {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].title === data.role) {
                        role.setProperties(res[i]);
                        role.deleteRole();
                        break;
                    }
                }
                start();
            });

        }
    );
}

function removeDepartment() {
    let departments = []; 
    DB.query("SELECT * FROM department",
        function (err, res) {
            if (err) console.log(err);
            for (let i = 0; i < res.length; i++) {
                if (res[i].name) {
                    departments.push(res[i].name);
                }
            }
            let question = "Please enter the department you wish to remove";
            Inquirer.prompt([
                {
                    name: "department",
                    type: "list",
                    message: question,
                    choices: departments
                }
            ]).then((data) => {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].name === data.department) {
                        department.setProperties(res[i]);
                        department.deleteDepartment();
                        break;
                    }
                }
                start();
            });

        }
    );
}

start();
