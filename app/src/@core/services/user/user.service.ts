import { Injectable, signal, WritableSignal } from '@angular/core';
import { getUniqueId } from '@core/utils/unique.utils';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _deviceId: WritableSignal<string>;
  private _currentGroupId: WritableSignal<number>;

  constructor() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = getUniqueId();
      localStorage.setItem('deviceId', deviceId);
    }

    const groupId = localStorage.getItem('groupId');
    this._currentGroupId = signal(groupId ? parseInt(groupId) : -1);

    this._deviceId = signal(deviceId);
  }

  setCurrentGroupId(groupId: number) {
    this._currentGroupId.set(groupId);
    localStorage.setItem('groupId', groupId.toString());
  }

  get groupId() {
    return this._currentGroupId.asReadonly();
  }

  get deviceId() {
    return this._deviceId.asReadonly();
  }
}
