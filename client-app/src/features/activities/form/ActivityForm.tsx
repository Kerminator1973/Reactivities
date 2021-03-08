import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';

export default observer (function ActivityForm() {

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

    //
    function handleSubmit() {
        activity.id ? updateActivity(activity) : createActivity(activity);
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