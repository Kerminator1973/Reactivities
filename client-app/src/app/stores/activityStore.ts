import { makeAutoObservable } from "mobx";

// Определяем хранилище состояний для Activity
export default class ActivityStore {

    // Состояние доступное для чтения
    title = 'Hello from MobX!';

    constructor() {
        // Метод для автоматического определения переменных состояния
        // и методов для их изменения. Это альтернатива вызову
        // метода с makeObservable() с их явным указанием
        makeAutoObservable(this);
    }

    // Метод для изменения состояния
    setTitle = () => {
        this.title = this.title + '!';
    }
}
