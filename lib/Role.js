class Role {

    constructor(connection, id = 0, title = "", salary = 0.00, departmentId = 0) {
        this.connection = connection;
        this.id = id;
        this.title = title;
        this.salary = salary;
        this.department_id = departmentId;
    }

    setProperties(data) {
        Object.getOwnPropertyNames(this).forEach((property) => {
            if(property !== "connection"){
                this[property] = data[property];
            }
        });
    }

    printRoles(){
        this.connection.query(
            "SELECT r.id, r.title, d.name, r.salary " +
            "FROM role r " +
            "LEFT JOIN department d ON r.department_id = d.id ",
            function (err, res) {
                if (err) console.log(err);
                console.log("\n");
                console.table(res);
            }
        );
    }

    insertRole(title = this.title, salary = this.salary, departmentId = this.department_id){
        this.connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [ title, salary, departmentId],
            function (err, res){
                if (err) console.log(err);
            }
        );
    }

    updateRole(){
        this.connection.query("UPDATE role SET ? WHERE ?", { title: this.title, salary: this.salary, departmentId: this.departmentId}, { id: this.id},
            function(err, res){
                if (err) console.log(err);
            }
        );
    }

    deleteRole(){
        this.connection.query("DELETE FROM role WHERE ?", {id: this.id},
            function(err,res){
                if (err) console.log(err);
            }
        );
    }
}

module.exports = Role;