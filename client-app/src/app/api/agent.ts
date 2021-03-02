import axios, { AxiosResponse } from 'axios';
import { Activity } from '../models/activity';

// Добавляем функцию, которая будет имитировать задержку при загрузке
// данных через API. Эта функция нужна только для проверки функционала
// Progress Bar
const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

// Фиксируем базовый URL разработанного нами API
axios.defaults.baseURL = 'http://localhost:5000/api';

// Разрабатываем функцию interceptor, которая будет вызываться
// при каждом выполнении запроса к API и будет задерживать обработку
// ответа API выполнение на одну секунду
axios.interceptors.response.use(async response => {
    try { 
        await sleep(1000);
        return response;
    }
    catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
});

// Определяем вспомогательную функцию, которая получает на входе объект
// типа AxiosResponse, а возвращает значение поле "data" (результат запроса).
// Если бы на написали строку вот так, то она была бы не "type safety", 
// т.к. принимала бы значение типа "any":
//      const responseBody = (response: AxiosResponse) => response.data;
// Для добавления "type safity" добавляем generic type:
const responseBody = <T> (response: AxiosResponse<T>) => response.data;

// Определяем внутренний объект requests, в котором определяем запросы к API
// в терминах RESTful. В определении функций используем generic type <T>,
// фактическое значение которого будет взято при определении высокоуровненых
// функций-wrapper-ов, в частности: Activities.list()
const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

// Определяем высокоуровневые функции-wrapper-ы
const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => axios.post<void>('/activities', activity),
    update: (activity: Activity) => axios.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => axios.delete<void>(`/activities/${id}`)
}

// Определяем proxy-объект, через который будет предоставляться доступ
// к методам API
const agent = {
    Activities
}

export default agent;