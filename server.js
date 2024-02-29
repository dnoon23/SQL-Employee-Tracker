//mysql -u root -p
const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'abc123',
    database: 'employee'
  },
  console.log(`Connected to the employee_db database.`)
);

main();

async function main() {
  await inquirer
    .prompt(
      {
        name: 'main',
        type: 'list',
        message: "What would you like to do?",
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      })

    .then((answer) => {
      switch (answer.main) {
        case 'View all departments':
          db.query('SELECT * FROM department', (err, results) => {
            console.table(results);
            main();
          });
          break;
        case 'View all roles':
          db.query('SELECT * FROM department_role', (err, results) => {
            console.table(results);
            main();
          });
          break;
        case 'View all employees':
          db.query('SELECT * FROM employee', (err, results) => {
            console.table(results);
            main();
          });
          break;
        case 'Add a department':
          inquirer
            .prompt([
              {
                type: "input",
                message: "Enter new department name:",
                name: "newDept",
              },
            ])
            .then((answer) => {
              db.query(
                "INSERT INTO department (deptartment_name) VALUES (?)",
                [answer.newDept],
                (err, res) => {
                  main();
                }
              );
            });
          break;
        case 'Add a role':
          inquirer
            .prompt([
              {
                type: "input",
                message: "Enter new role:",
                name: "newRole",
              },
              {
                type: "input",
                message: "Enter new role salary:",
                name: "newRoleSal",
              },
              {
                type: "input",
                message: "Enter new role department number:",
                name: "newRoleId",
              },
            ])
            .then((answer) => {
              db.query(
                "INSERT INTO department_role (title, salary, department_id) VALUES (?, ?, ?)",
                [answer.newRole, answer.newRoleSale, answer.newRoleId],
                (err, res) => {
                  main();
                }
              );
            });
          break;
        case 'Add an employee':
          inquirer
            .prompt([
              {
                type: "input",
                message: "Enter new employee first name:",
                name: "newEmF",
              },
              {
                type: "input",
                message: "Enter new employee last name:",
                name: "newEmL",
              },
              {
                type: "input",
                message: "Enter new employee id:",
                name: "newEmId",
              },
              {
                type: "input",
                message: "Enter new employee's manager id:",
                name: "newEmMaId",
              },
            ])
            .then((answer) => {
              db.query(
                "INSERT INTO employee (first_name, last_name, employee_id, manager_id) VALUES (?, ?, ?, ?)",
                [answer.newEmF, answer.newEmL, answer.newEmId, answer.newEmMaId],
                (err, res) => {
                  main();
                }
              );
            });
          break;
        case 'Update an employee role':
          let employees = [];
          db.query('SELECT first_name, last_name FROM employee', (err, results) => {
            results.forEach((element) => { employees.push(`${element.first_name} ${element.last_name}`,) });
          });
          let roles = [];
          db.query('SELECT title FROM department_role', (err, results) => {
            results.forEach((element) => { roles.push(`${element.id} ${element.title}`,) })
          });
          inquirer
            .prompt([
              {
                type: "list",
                message: "Choose employee to update:",
                name: employees,
              },
              {
                type: "list",
                message: "Choose new roll:",
                name: roles,
              },
            ])
            .then((answer) => {
              db.query(
                "UPDATE employee SET role_id(, manager_id) VALUES (?, ?, ?, ?)",
                [answer.newEmF, answer.newEmL, answer.newEmId, answer.newEmMaId],
                (err, res) => {
                  main();
                }
              );
            });
          break;
        case 'Exit':
          process.exit();
      };
    });
};

