import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import {v4 as uuid} from 'uuid';

export default observer (function ActivityForm() {

    // Хук useHistory позволяет получить объект для управления переходами
    // между Routes
    const history = useHistory();

    const {activityStore} = useStore();
    const {createActivity, updateActivity, 
        loading, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams<{id: string}>();

    // Определяем состояние, как объект состоящий из нескольких полей
    const [activity, setActivity] = useState({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    // В чтсле параметров хука используется список состоящий из переменных
    // [id, loadActivity]. Этот список называется "зависимостями" (dependancies).
    // Смысл термина «зависимости» состоит именно в том, что код, находящийся внутри
    // хука, зависит от изменения значений этих двух переменных
    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!))
    }, [id, loadActivity]);

    // В обработчике нажатия на кнопку "Submit", в зависимости от установленного режима,
    // по разному устанавливаем адрес возврата к предыдущей форме
    function handleSubmit() {

        if (activity.id.length === 0) {
            
            // Добавляем к объекту с ещё не введёнными значениями сгенерированный uuid
            let newActivity = {
                ...activity,
                id: uuid()
            };

            // Создаём новую Activity через API и переходим на Route
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));

        } else {

            // Изменяем уже существующую Activity и переходим на Route
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        }
    }

    // Функция обрабатываем событие об изменении содержимого Input и TextArea.
    // При получении события в словарь полей (activity) изменяется значение поля
    // "name" на указанное в "value". Изменение осуществляется посредством spread-оператор
    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setActivity({...activity, [name]: value});
    }

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder="Title" value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea placeholder="Description" value={activity.description} name='description' onChange={handleInputChange} />
                <Form.Input placeholder="Category" value={activity.category} name='category' onChange={handleInputChange} />
                <Form.Input type='date' placeholder="Date" value={activity.date} name='date' onChange={handleInputChange} />
                <Form.Input placeholder="City" value={activity.city} name='city' onChange={handleInputChange} />
                <Form.Input placeholder="Venue" value={activity.venue} name='venue' onChange={handleInputChange} />
                <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                <Button floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
})