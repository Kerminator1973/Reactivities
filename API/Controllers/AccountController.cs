using System.Threading.Tasks;
using API.DTOs;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            // Проверяем, есть ли в базе данных пользователь с указанным
            // адресом электронной почты. Если есть, то получаем информацию
            // об этом пользователе
            var user = await _userManager.FindByEmailAsync(loginDto.EMail);
            if (null == user) return Unauthorized();

            // Проверяем пароль и если пароль корректен, то изменяем состояние
            // пользователя на "аутентифицирован"
            var result = await _signInManager.CheckPasswordSignInAsync(user, 
                loginDto.Password, false);

            if (result.Succeeded) {

                // Если всё хорошо, то возвращаем в клиентский код данные 
                // пользователя, а также JWT
                return new UserDto
                {
                    DisplayName = user.DisplayName,
                    Image = null,
                    Token = "This will be a token",
                    Username = user.UserName
                };
            }

            return Unauthorized();
        }
    }
}