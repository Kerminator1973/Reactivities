using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Persistence;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Указываем, что движком СУБД будет Sqlite с указанными параметрами подключения
            services.AddDbContext<DataContext>(opt => {
                opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });

            // Определяем CORS policy, в которой мы принимаем все заголовки в
            // любых методах, если запрос пришёл от http://localhost:3000
            services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy", policy => {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
                });
            });

            // Подключаем контроллеры
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });

            // Подключаем сервис MediatR
            services.AddMediatR(typeof(List.Handler).Assembly);

            // Добавляем сервис AutoMapper
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
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
