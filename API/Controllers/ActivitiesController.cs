using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Domain;
using Application.Activities;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivitiesController : BaseApiController
    {
        // Следует обратить внимание, что член класса Mediator инициализируется
        // в базовом классе BaseApiController и это позволяет не определять в каждом
        // производном классе-контроллере конструктор для инициализации
        // медиатора через Dependency Injection
        
        [HttpGet]   // GET api/activities
        public async Task<ActionResult<IEnumerable<Activity>>> GetActivities()
        {
            // Переадрессуем запрос в подкласс класса List из пространства имён
            // Application.Activities
            var values = await Mediator.Send(new List.Query());

            // Возвращаем успешный Http Status Code и полученные данные
            return Ok(values);
        }

        [HttpGet("{id}")]   // GET api/activities/8920408c-6588-44c1-8363-88575735e57e
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            return await Mediator.Send(new Details.Query{Id = id});
        }
/*
        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
*/
    }
}
