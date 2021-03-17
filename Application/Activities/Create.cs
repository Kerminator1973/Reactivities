using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        // Тип Unit означает, что ничего возвращать не нужно - это placeholder
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        // Создаём класс-валидатор полей сущности Activity, который будет применяться
        // при обработке параметров запроса Create
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator() 
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // Включаем изменение (добавление новых данных) в контекст базы данных
                _context.Activities.Add(request.Activity);

                // Фактически сохраняем данные в таблицу базу данных
                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to create activity");

                // Фактически, мы ничего не делаем, но эта конструкция позволяет уведомить
                // вызывающий класс, что команда была успешно выполнена
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}