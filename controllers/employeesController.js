import employeeJSON from "../model/employees.json" assert { type: "json" };

const data = {};
data.employee = employeeJSON;

export const getAllEmployees = (req, res) => {
  res.json(data.employee);
};

export const createNewEmployee = (req, res) => {
  const { body } = req;
  data.employee.push({
    id: data.employee[data.employee.length - 1]?.id + 1 || 1,
    ...body,
  });
  res.status(200).send("Yay you are successfully push data!");
};

export const updateEmployee = (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const IdX = data.employee.findIndex((emp) => emp.id === Number(id));
  if (IdX !== -1) {
    data.employee[IdX] = { id: data.employee[IdX].id, ...body };
    res.status(200).send("Successfully updated!");
  }
};

export const deleteEmployee = (req, res) => {
  const {
    params: { id },
  } = req;
  const findUserById = data.employee.findIndex((emp) => emp.id === Number(id));
  if (findUserById === -1) {
    res.status(404).json({ err: "User Not Found" });
  }
  data.employee.splice(findUserById, 1);
  res.send("Success");
};

export const getEmployeeById = (req, res) => {
  const {
    params: { id },
  } = req;
  const findUserById = data.employee.find((emp) => emp.id === Number(id));
  if (!findUserById) {
    res.status(404).json({ err: "User Not Found" });
  }
  res.send(findUserById);
};
