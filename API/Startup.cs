using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using Application.Activities;
using Application.Core;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace API
{
    public class Startup
    {
        public IConfiguration _config { get; }
        public Startup(IConfiguration configuration)
        {
            _config = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Подключаем контроллеры
            services.AddControllers().AddFluentValidation(config => {
                config.RegisterValidatorsFromAssemblyContaining<Create>();
            });

            // Добавляем остальные сервисы
            services.AddApplicationServices(_config);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }

            // В случае демонстрационного приложения передрессация http в https не нужна.
            // В промышленном применении, когда приложение стоит за полноценным web-сервером,
            // этот функционал вообще не нужен, т.к. внешний сервер принимает http-запросы,
            // проверяет сертификаты и переадрессует эти запросы нашему приложению по http
            // app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            // Применяем ранее созданную CORS Policy, активируя соответствующий Middleware
            app.UseCors("CorsPolicy");

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
