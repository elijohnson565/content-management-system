DROP DATABASE IF EXISTS companyDb;
CREATE DATABASE companyDb;

USE companyDb;

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY(id)
);

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

INSERT INTO department
(name) VALUES 
("Sales"),
("Engineering"),
("Finance"),
("Legal"),
("Marketing");

INSERT INTO role
(title, salary, department_id) VALUES 
("CEO", 89000, 1),
("Manager", 30000, 2);

INSERT INTO employee
(first_name, last_name, role_id, manager_id) VALUES
("Jake", "Columbus", 5, null),
("Richard", "Smith", 2, 1);


