using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;

using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivitiesController : BaseApiController
    {
        // GET api/activities
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Activity>>> GetActivities()
        {
            // Переадрессует запрос в подкласс класса List из пространства имён
            // Application.Activities
            var values = await Mediator.Send(new List.Query());

            // Возвращаем успешный Http Status Code и полученные данные
            return Ok(values);
        }

        // GET api/activity/8920408c-6588-44c1-8363-88575735e57e
        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            return Ok();
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
