using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        // Базовый класс BaseApiController создан для того, чтобы исключить
        // из кода всех контроллеров конструктор, необходимый лишь для
        // инициализации медиатора.
        
        private IMediator _mediator;
        
        // Используем конструкцию похожую на Singleton: если член класса нулевой,
        // то он инициализируется (см. ??=) ссылкой на экземпляр сервиса IMediator
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices
            .GetService<IMediator>();
    }
}