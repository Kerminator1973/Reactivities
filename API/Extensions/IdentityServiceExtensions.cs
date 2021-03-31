using API.Services;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, 
            IConfiguration config) 
        {
            // Определяем стратегию паролей. В конкретном случае указываем,
            // что можно обойтись алфавитно-цифровым паролем, без спец.символов
            services.AddIdentityCore<AppUser>(opt => 
            {
                opt.Password.RequireNonAlphanumeric = false;
            })
            .AddEntityFrameworkStores<DataContext>()
            .AddSignInManager<SignInManager<AppUser>>();

            services.AddAuthentication();

            // Добавляем сервис генерирующий JWT в список доступных 
            // для Dependency Injection
            services.AddScoped<TokenService>();

            return services;
        }
    }
}