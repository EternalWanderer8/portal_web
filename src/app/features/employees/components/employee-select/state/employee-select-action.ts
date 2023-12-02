import { DepartmentEntity } from "../../department/department.component"
import { EmployeeItemEntity } from "../../employee-item/employee-item.component"

export type EmployeeSelectAction = InitDataAction
    | SelectEmployeeAction
    | SelectDepartmentAction
    | UnselectAllAction
    | RouteToDepartmentAction
    | MoveToDepartmentAction
    | MoveToDepartmentCloseAction
    | NewDepartmentAction
    | DeleteAction

export enum EmployeeSelectActionTypes {
    INIT_DATA,
    SELECT_EMPLOYEE,
    SELECT_DEPARTMENT,
    UNSELECT_ALL,
    ROUTE_TO_DEPARTMENT,
    MOVE_TO_DEPARTMENT,
    MOVE_TO_DEPARTMENT_CLOSE,
    NEW_DEPARTMENT,
    DELETE,
}

export interface InitDataAction {
    readonly type: EmployeeSelectActionTypes.INIT_DATA
    readonly employees: EmployeeItemEntity[]
    readonly departments: DepartmentEntity[]
}

export interface SelectEmployeeAction {
    readonly type: EmployeeSelectActionTypes.SELECT_EMPLOYEE
    readonly employee: EmployeeItemEntity
}

export interface SelectDepartmentAction {
    readonly type: EmployeeSelectActionTypes.SELECT_DEPARTMENT
    readonly department: DepartmentEntity
}

export interface UnselectAllAction {
    readonly type: EmployeeSelectActionTypes.UNSELECT_ALL
}

export interface MoveToDepartmentAction {
    readonly type: EmployeeSelectActionTypes.MOVE_TO_DEPARTMENT
}

export interface RouteToDepartmentAction {
    readonly type: EmployeeSelectActionTypes.ROUTE_TO_DEPARTMENT,
    readonly id: number
}

export interface MoveToDepartmentCloseAction {
    readonly type: EmployeeSelectActionTypes.MOVE_TO_DEPARTMENT_CLOSE
}

export interface NewDepartmentAction {
    readonly type: EmployeeSelectActionTypes.NEW_DEPARTMENT
}

export interface DeleteAction {
    readonly type: EmployeeSelectActionTypes.DELETE
}