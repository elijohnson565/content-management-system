const Department = require("./Department.js");
const Role = require("./Role.js");

class Employee {

    constructor(connection, id = 0, firstName = "", lastName = "", roleId = 0, managerId = 0) {
        this.connection = connection;
        this.id = id;
        this.first_name = firstName;
        this.last_name = lastName;
        this.role_id = roleId;
        this.manager_id = managerId;
    }

    setProperties(data) {
        Object.getOwnPropertyNames(this).forEach((property) => {
            if (property !== "connection") {
                this[property] = data[property];
            }
        });
    }

    printEmployees() {
        this.connection.query(
            "SELECT first_name, last_name, role_id, manager_id " +
            "FROM employee",    
            function (err, res) {
                if (err) console.log(err);
                console.log("\n");
                console.table(res);
            }
        );
    }

    insertEmployee(firstName = this.first_name, lastName = this.last_name, roleId = this.role_id, managerId = this.manager_id) {
        this.connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [ firstName, lastName, roleId, managerId ],
            function (err, res) {
                if (err) console.log(err);
            }
        );
    }

    updateEmployee(id = this.id, firstName = this.first_name, lastName = this.last_name, roleId = this.role_id, managerId = this.manager_id) {
        this.connection.query("UPDATE employee SET ? WHERE ?", [{ first_name: firstName, last_name: lastName, role_id: roleId, manager_id: managerId }, { id: id }],
            function (err, res) {
                if (err) console.log(err);
            }
        );
    }

    deleteEmployee() {
        this.connection.query("DELETE FROM employee WHERE ?", { id: this.id },
            function (err, res) {
                if (err) throw err;
            }
        );
    }
}

module.exports = Employee;