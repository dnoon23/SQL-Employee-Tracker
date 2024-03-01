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
  console.log(`Connected to the employee database.`)
);

//Launches the questions on startup
main();

//Creates the main question list
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

      //Creates a table for departments, roles, and employees
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
          db.query('SELECT * FROM employees', (err, results) => {
            console.table(results);
            main();
          });
          break;

          //Adds a department
        case 'Add a department':
          inquirer
            .prompt([
              {
                type: "input",
                message: "Enter new department name:",
                name: "newDept",
              },
            ])
            //Creates a new department
            .then((answer) => {
              db.query('INSERT INTO department (department_name) VALUES (?)', [answer.newDept], (err, results) => {
                main();
              });
            });
          break;

          //Adds Role
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
            //Uses the choices to create a new role with selected parameters
            .then((answer) => {
              db.query('INSERT INTO department_role (title, salary, department_id) VALUES (?, ?, ?)', [answer.newRole, answer.newRoleSal, answer.newRoleId], (err, results) => {
                main();
              });
            });
          break;

            //Adds employee
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
            //Uses the choices to create a new employee with selected parameters
            .then((answer) => {
              db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answer.newEmF, answer.newEmL, answer.newEmId, answer.newEmMaId], (err, results) => {
                main();
              });
            });
          break;

        //Employee role update
        case 'Update an employee role':
          //Gets all employees and sets them as the choices
          db.query('SELECT * FROM employees', (err, results) => {
            const employees = results.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
            inquirer
              .prompt([
                {
                  type: "list",
                  message: "Select employee to update:",
                  name: "employee",
                  choices: employees,
                },
              ])
              //pushes the selected employees id to an array
              .then((answer) => {
                const em = answer.employee;
                const roleChange = [];
                roleChange.push(em);

                //Gets all role and sets them as the choices
                db.query('SELECT * FROM department_role', (err, results) => {
                  const role = results.map(({ id, title }) => ({ name: title, value: id }));
                  inquirer
                    .prompt([
                      {
                        type: "list",
                        message: "Select new employee position:",
                        name: "newRole",
                        choices: role,
                      },
                    ])
                    .then((answer) => {
                      //Pushes the selected role id to the array holding the selected employee id
                      const ro = answer.newRole;
                      roleChange.push(ro);

                      //Rearranges the ids in the array so they are in the proper order to update
                      let em = roleChange[0]
                      roleChange[0] = ro
                      roleChange[1] = em

                      db.query('UPDATE employees SET role_id = ? WHERE id = ?', roleChange, (err, results) => {
                        main();
                      })
                    });
                })
              });
          })
          break;

          //Exits the program
        case 'Exit':
          process.exit();
      };
    });
};