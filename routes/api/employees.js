import { Router } from "express";
import employeeJSON from "../../data/employees.json" assert { type: "json" };

const data = {};
data.employee = employeeJSON;

const router = Router();

router
  .route("/")
  .get((req, res) => {
    res.json(data.employee);
  })
  .post((req, res) => {
    const { body } = req;
    data.employee.push({ ...body });
    res.status(200).send("Yay you are successfully push data!");
  })
  .put((req, res) => {
    res.json({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
  });

router
  .route("/:id")
  .get((req, res) => {
    const {
      params: { id },
    } = req;
    const findUserById = data.employee.find((emp) => emp.id === Number(id));
    if (!findUserById) {
      res.status(404).json({ err: "User Not Found" });
    }
    res.send(findUserById);
  })
  .delete((req, res) => {
    const {
      params: { id },
    } = req;
    const findUserById = data.employee.findIndex(
      (emp) => emp.id === Number(id)
    );
    if (findUserById === -1) {
      res.status(404).json({ err: "User Not Found" });
    }
    data.employee.splice(findUserById, 1);
    res.send("Success");
  });

export default router;
