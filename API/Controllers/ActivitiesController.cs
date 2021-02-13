using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        // Используем механизм Dependency Injection, чтобы сохранить
        // ссылку на копию сервиса работы с базой данных
        private readonly IMediator _mediator;
        public ActivitiesController(IMediator mediator)
        {
            this._mediator = mediator;
        }

        // GET api/values
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Activity>>> GetActivities()
        {
            // Выполяет SQL-запрос к базе данных, используя LINQ
            var values = await _mediator.Send(new List.Query());

            // Возвращаем успешный Http Status Code и полученные данные
            return Ok(values);
        }

        // GET api/values/5
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
