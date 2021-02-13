using System.Collections.Generic;
using Domain;
using MediatR;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<Activity>> {}
    }
}