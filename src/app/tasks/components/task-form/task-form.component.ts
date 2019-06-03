import { Component, OnInit } from '@angular/core';
import * as RouterActions from './../../../core/+store/router/router.actions';

import { Store, select } from '@ngrx/store';
import { AppState, TasksState, getTasksState, getSelectedTaskByUrl } from './../../../core/+store';
import * as TasksActions from './../../../core/+store/tasks/tasks.actions';

import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from './../../../core';

import { TaskModel } from './../../models/task.model';

@Component({
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
@AutoUnsubscribe()
export class TaskFormComponent implements OnInit {
  task: TaskModel;

  private sub: Subscription;

  constructor(
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.sub = this.store
      .pipe(select(getSelectedTaskByUrl))
      .subscribe(task => this.task = task);
  }

  onSaveTask() {
    const task = { ...this.task };

    if (task.id) {
      this.store.dispatch(new TasksActions.UpdateTask(task));
    } else {
      this.store.dispatch(new TasksActions.CreateTask(task));
    }
  }

  onGoBack(): void {
    this.store.dispatch(new RouterActions.Go({
      path: ['/home']
    }));
  }
}
