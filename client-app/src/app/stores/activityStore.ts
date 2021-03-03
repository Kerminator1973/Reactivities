import { makeObservable, observable } from "mobx";

// Определяем хранилище состояний для Activity
export default class ActivityStore {
    title = 'Hello from MobX!';

    constructor() {
        makeObservable(this, {
            title: observable
        });
    }
}
