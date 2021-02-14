using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    public class BaseApiController : ControllerBase
    {
        // Используем механизм Dependency Injection, чтобы сохранить
        // ссылку на медиатор, через который мы передаёт управление
        // классу, который будет выполнять команду, либо извлекать
        // данные из СУБД
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices
            .GetService<IMediator>();
        
        /*
        public BaseApiController(IMediator mediator)
        {
            this._mediator = mediator;
        }
        */
    }
}