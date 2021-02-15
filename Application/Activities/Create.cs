using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // Включаем изменение (добавление новых данных) в контекст базы данных
                _context.Activities.Add(request.Activity);

                // Фактически сохраняем данные в таблицу базу данных
                await _context.SaveChangesAsync();

                // Фактически, мы ничего не делаем, но эта конструкция позволяет уведомить
                // вызывающий класс, что команда была успешно выполнена
                return Unit.Value;
            }
        }
    }
}