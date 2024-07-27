import { Router } from "express";
import {
  createNewEmployee,
  deleteEmployee,
  getAllEmployees,
  updateEmployee,
  getEmployeeById,
} from "../../controllers/employeesController.js";

const router = Router();

router.route("/").get(getAllEmployees).post(createNewEmployee);

router
  .route("/:id")
  .get(getEmployeeById)
  .delete(deleteEmployee)
  .put(updateEmployee);

export default router;
