import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { format } from 'date-fns';
import { store } from "./store";
import { Profile } from "../models/profile";

// Определяем хранилище состояний для Activity
export default class ActivityStore {

    // Состояния доступные для чтения
    activityRegistry = new Map<string, Activity>();
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

    // "Вычисляемое значение" (getter) возвращает список Activities 
    // отсортированных по дате
    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
            a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string]: Activity[]})
        )
    }

    // Метод, посредством которого осуществляется начальная инициализация 
    // списка Activities
    loadActivities = async () => {
        this.loadingInitial = true;
        try { 

            const activities = await agent.Activities.list();   
            activities.forEach(activity => {
                this.setActivity(activity);
            });

            this.setLoadingInitial(false);

        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    // Метод, который позволяет получить Activity по идентификатору
    // из реестра, или загрузить их через API
    loadActivity = async (id: string) => {

        let activity = this.getActivity(id);
        if (activity) {
            
            // Получаем описание Activity из реестра
            this.selectedActivity = activity;
            return activity;

        } else {

            // Ситуация, в которой у нас может не оказаться в списке
            // Activities нужной нам Activity с указанным id - это
            // перезагрузка страницы со свойствами конкретной Activity
            // кнопкой "Refresh". В этой ситуации мы может только для
            // загрузить данные текущей Activity через API
            this.loadingInitial = true;
            try {

                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                });
                this.setLoadingInitial(false);
                return activity;

            } catch(error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    // Метод настраивает параметры отображаемой Activity,
    // в процессе взаимодействия с API
    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;

        if (user) {
            activity.isGoing = activity.attendees?.some(
                a => a.username === user.username
            );
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);
        }

        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    // Вспомогательный private-метод
    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    // Action-метод, через который можно изменять состояние loadingInitial
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    // Action-метод позволяет создать новую Activity через API
    // и включить её в список локальных activities
    createActivity = async (activity: ActivityFormValues) => {

        const user = store.userStore.user;
        const attendee = new Profile(user!);

        try {
            await agent.Activities.create(activity);

            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);

            // Поскольку предыдущая операция была асинхронной (await),
            // нижеследуюшщий код следует выполнять внутри wrapper-а runInAction()
            runInAction(() => {
                this.selectedActivity = newActivity;
            })
        } catch (error) {
            console.log(error);
        }
    }

    // Action-метод позволяет изменить Activity через API
    // и обновить её в списке локальных activities
    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(activity);
            runInAction(() => {

                if (activity.id) {
                    let updatedActivity = {...this.getActivity(activity.id), ...activity}
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    // Action-метод позволяет удалить Activity через API, а также
    // удалить её из списка локальных activities
    deleteActivity = async (id: string) => {
        this.loading = true;

        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees = 
                        this.selectedActivity.attendees?.filter(a => a.username !== user?.username);
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }

                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        }
        catch (error) {
            
            console.log(error);
        }
        finally {
            // Для асинхронныъ операций необходимо оборачивать код
            // вызовом runInAction()
            runInAction(() => this.loading = false);
        }
    }

    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }
}
