using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Domain;
using Application.Activities;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        // Следует обратить внимание, что член класса Mediator инициализируется
        // в базовом классе BaseApiController и это позволяет не определять в каждом
        // производном классе-контроллере конструктор для инициализации
        // медиатора через Dependency Injection
        
        [HttpGet]           // GET api/activities
        public async Task<ActionResult<IEnumerable<Activity>>> GetActivities()
        {
            // Переадрессуем запрос в подкласс класса List из пространства имён
            // Application.Activities
            var values = await Mediator.Send(new List.Query());

            // Возвращаем успешный Http Status Code и полученные данные
            return Ok(values);
        }

        [HttpGet("{id}")]   // GET api/activities/8920408c-6588-44c1-8363-88575735e57e
        public async Task<IActionResult> GetActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query {Id = id}));
        }

        [HttpPost]          // POST api/activities
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return Ok(await Mediator.Send(new Create.Command {Activity = activity}));
        }
        
        [HttpPut("{id}")]   // PUT api/activities/8920408c-6588-44c1-8363-88575735e57e
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            // В форме Activity может не быть установлено поле Id - в соответствии
            // с правилами RESTful, его нужно брать из http-запроса. Следует обратить
            // внимание, что {id} и параметр Guid id - это одна и та же сущность
            activity.Id = id;
            return Ok(await Mediator.Send(new Edit.Command {Activity = activity}));
        }

        [HttpDelete("{id}")]    // DELETE api/activities/8920408c-6588-44c1-8363-88575735e57e
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return Ok(await Mediator.Send(new Delete.Command {Id = id}));
        }
    }
}
