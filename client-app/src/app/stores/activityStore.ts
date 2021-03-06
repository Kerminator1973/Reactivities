import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";

// Определяем хранилище состояний для Activity
export default class ActivityStore {

    // Состояния доступные для чтения
    activities: Activity[] = [];
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        // Метод для автоматического определения переменных состояния
        // и методов для их изменения. Это альтернатива вызову
        // метода с makeObservable() с их явным указанием
        makeAutoObservable(this);
    }

    // Метод, посредством которого осуществляется начальная инициализация 
    // списка Activities
    loadActivities = async () => {

        this.setLoadingInitial(true);

        try { 

            const activities = await agent.Activities.list();   

            // Обрабатываем полученные данные с целью корректировки формата
            // представления данных. Мы получаем данные в виде строк: 
            //    2021-01-13T19:08:55.7992459
            // React умеет обрабатывать строку в виде "2021-01-13"
            activities.forEach(activity => {

                // Отделяем дату от времени
                activity.date = activity.date.split('T')[0];

                // В отличие от Redux, MobX позволяет использовать
                // mutation - изменение переменных внутри метода класса
                this.activities.push(activity);
            });

            this.setLoadingInitial(false);

        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    // Action-метод, через который можно изменять состояние loadingInitial
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    // Action-метод позволяет указать выбранную Activity
    selectActivity = (id: string) => {
        this.selectedActivity = this.activities.find(a => a.id === id);
    }

    // Action-метод позволяет отменить ранее выполненный выбор Activity
    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    // Action-метод позволяет установить режим редактирования конкретной Activity
    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    // Action-метод позволяет выйти из режима редактирования параметров формы
    closeForm = () => {
        this.editMode = false;
    }
}
