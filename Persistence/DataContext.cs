using Domain;                           // Определение структуры (объекта) Value
using Microsoft.EntityFrameworkCore;    // Определение DbContext

namespace Persistence
{
    // DbContext представляет интерфейс для доступа к базе данных
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        // Указываем на необходимость включения в базу данных таблицы Values
        public DbSet<Activity> Activities { get; set; }

        // Добавляем Seed - стартовые данные, без которых нормальная работа
        // приложения может быть затруднена. Обычно Seed содержат редко
        // изменяемые справочники
        protected override void OnModelCreating(ModelBuilder builder)
        {
            /*
            // В первоначальной версии курса, SeedData добавлялись так:

            builder.Entity<Activity>()
                .HasData(
                    new Value {Id = 1, Name = "Value 101"},
                    new Value {Id = 2, Name = "Value 102"},
                    new Value {Id = 3, Name = "Value 103"}
                );
            */
        }
    }
}
