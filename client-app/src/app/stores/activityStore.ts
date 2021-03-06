import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from 'uuid';

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

    // Action-метод позволяет создать новую Activity через API
    // и включить её в список локальных activities
    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();

        try {
            await agent.Activities.create(activity);

            // Поскольку предыдущая операция была асинхронной (await),
            // нижеследуюшщий код следует выполнять внутри wrapper-а runInAction()
            runInAction(() => {
                this.activities.push(activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    // Action-метод позволяет изменить Activity через API
    // и обновить её в списке локальных activities
    updateActivity = async (activity: Activity) => {
        this.loading = true;

        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                // Используем spread-оператор для того, чтобы создать новый массив
                // на базе существующих activities. Используем filter(), чтобы
                // исключить из нового массива текущий устаревший activity по id.
                // Затем мы добавляем обновлённый activity в новый массив
                this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];

                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    // Action-метод позволяет удалить Activity через API, а также
    // удалить её из списка локальных activities
    deleteActivity = async (id: string) => {
        this.loading = true;

        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activities = [...this.activities.filter(a => a.id !== id)];

                // Если мы удалили текущую активную Activity, то отменям
                // блок редактирования
                if (this.selectedActivity?.id === id)
                    this.cancelSelectedActivity();

                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}
