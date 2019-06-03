import { Component, OnInit } from '@angular/core';
import * as RouterActions from './../../../core/+store/router/router.actions';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, TasksState, getTasksState, getTasksData, getTasksError } from './../../../core/+store';
import * as TasksActions from './../../../core/+store/tasks/tasks.actions';

import { TaskModel } from './../../models/task.model';

@Component({
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<ReadonlyArray<TaskModel>>;
  tasksError$: Observable<Error | string>;

  constructor(
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    console.log('We have a store! ', this.store);

    this.tasks$ = this.store.pipe(select(getTasksData));
    this.tasksError$ = this.store.pipe(select(getTasksError));
  }

  onCreateTask() {
    this.store.dispatch(new RouterActions.Go({
      path: ['/add']
    }));
  }

  onCompleteTask(task: TaskModel): void {
    const doneTask = {...task, done: true};
    this.store.dispatch(new TasksActions.UpdateTask(doneTask));
  }

  onEditTask(task: TaskModel): void {
    const link = ['/edit', task.id];
    this.store.dispatch(new RouterActions.Go({
      path: link
    }));
  }

  onDeleteTask(task: TaskModel) {
    this.store.dispatch(new TasksActions.DeleteTask(task));
  }

}
