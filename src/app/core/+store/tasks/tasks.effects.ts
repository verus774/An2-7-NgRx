import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap, pluck, concatMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { TaskPromiseService } from './../../../tasks/services';
import * as TasksActions from './tasks.actions';
import { TaskModel } from '../../../tasks/models/task.model';

@Injectable()
export class TasksEffects {

  constructor(
    private actions$: Actions,
    private taskPromiseService: TaskPromiseService,
    private router: Router,
  ) {
    console.log('[TASKS EFFECTS]');
  }

  @Effect()
  getTasks$: Observable<Action> = this.actions$.pipe(
    // Instead of ofType<TasksActions.GetTasks>(...) you can use ofType(...)
    // It's optional.
    // Specify the action type to allow type-safe mapping to other data on the action,
    // including payload
    ofType<TasksActions.GetTasks>(TasksActions.TasksActionTypes.GET_TASKS),
    switchMap((action: TasksActions.GetTasks) =>
      this.taskPromiseService
        .getTasks()
        .then(tasks => new TasksActions.GetTasksSuccess(tasks))
        .catch(err => new TasksActions.GetTasksError(err))
    )
  );

  @Effect()
  updateTask$: Observable<Action> = this.actions$.pipe(
    ofType<TasksActions.UpdateTask>(TasksActions.TasksActionTypes.UPDATE_TASK),
    pluck('payload'),
    concatMap((payload: TaskModel) =>
      this.taskPromiseService
        .updateTask(payload)
        .then(task => {
          this.router.navigate(['/home']);
          return new TasksActions.UpdateTaskSuccess(task);
        })
        .catch(err => new TasksActions.UpdateTaskError(err))
    )
  );

  @Effect()
  createTask$: Observable<Action> = this.actions$.pipe(
    ofType<TasksActions.CreateTask>(TasksActions.TasksActionTypes.CREATE_TASK),
    pluck('payload'),
    concatMap((payload: TaskModel) =>
      this.taskPromiseService
        .createTask(payload)
        .then(task => {
          this.router.navigate(['/home']);
          return new TasksActions.CreateTaskSuccess(task);
        })
        .catch(err => new TasksActions.CreateTaskError(err))
    )
  );

  @Effect()
  deleteTask$: Observable<Action> = this.actions$.pipe(
    ofType<TasksActions.DeleteTask>(TasksActions.TasksActionTypes.DELETE_TASK),
    pluck('payload'),
    concatMap((payload: TaskModel) =>
      this.taskPromiseService
        .deleteTask(payload)
        .then(
          (/* method delete for this API returns nothing, so we will use payload */) => {
            return new TasksActions.DeleteTaskSuccess(payload);
          }
        )
        .catch(err => new TasksActions.DeleteTaskError(err))
    )
  );

}
