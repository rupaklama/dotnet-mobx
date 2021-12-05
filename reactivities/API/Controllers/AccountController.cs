using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  [AllowAnonymous]
  [ApiController]
  [Route("api/[controller]")]
  public class AccountController : ControllerBase
  {
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly TokenService _tokenService;
    public AccountController(UserManager<AppUser> userManager,

        SignInManager<AppUser> signInManager, TokenService tokenService)
    {
      _tokenService = tokenService;
      _signInManager = signInManager;
      _userManager = userManager;

    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
      var user = await _userManager.FindByEmailAsync(loginDto.Email);

      if (user == null) return Unauthorized("Invalid email");

      //   if (user.UserName == "bob") user.EmailConfirmed = true;

      //   if (!user.EmailConfirmed) return Unauthorized("Email not confirmed");

      var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

      if (result.Succeeded)
      {
        //   await SetRefreshToken(user);
        //   return CreateUserObject(user);
        return CreateUserObject(user);
      }

      return Unauthorized("Invalid password");
    }

    // [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
      if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
      {
        // ModelState.AddModelError("email", "Email taken");
        // return ValidationProblem();
        return BadRequest("Email taken");
      }
      if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
      {
        // ModelState.AddModelError("username", "Username taken");
        // return ValidationProblem();
        return BadRequest("Username taken");
      }

      var user = new AppUser
      {
        DisplayName = registerDto.DisplayName,
        Email = registerDto.Email,
        UserName = registerDto.Username
      };

      var result = await _userManager.CreateAsync(user, registerDto.Password);

      if (!result.Succeeded) return BadRequest("Problem registering user");

      {
        return CreateUserObject(user);
      };

      return BadRequest("Problem registering user");

      // var origin = Request.Headers["origin"];
      // var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
      // token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

      // var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";
      // var message = $"<p>Please click the below link to verify your email address:</p><p><a href='{verifyUrl}'>Click to verify email</a></p>";

      // await _emailSender.SendEmailAsync(user.Email, "Please verify email", message);

      // return Ok("Registration success - please verify email");

    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
      var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
      // var user = await _userManager.Users.Include(p => p.Photos)
      //     .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));
      // await SetRefreshToken(user);
      return CreateUserObject(user);
    }

    private UserDto CreateUserObject(AppUser user)
    {
      return new UserDto
      {
        DisplayName = user.DisplayName,
        Image = null,
        Token = _tokenService.CreateToken(user),
        Username = user.UserName
      };
    }
  }
}
