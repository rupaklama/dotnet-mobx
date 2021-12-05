using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extensions
{
  public static class IdentityServiceExtensions
  {
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
    {
      services.AddIdentityCore<AppUser>(opt =>
          {
            opt.Password.RequireNonAlphanumeric = false;
            // opt.SignIn.RequireConfirmedEmail = true;

          })
          .AddEntityFrameworkStores<DataContext>()
          .AddSignInManager<SignInManager<AppUser>>();

      // note - If somebody sends a token to our API that has a key which does not match
      // what we storing here - secret key, then they will get unauthorized back from our api
      // We will have two keys - one for dev & one for prod. dev key can by public but not the prod key
      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
         .AddJwtBearer(opt =>
                {
                  opt.TokenValidationParameters = new TokenValidationParameters
                  {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    // ValidateLifetime = true,
                    // ClockSkew = TimeSpan.Zero
                  };
                  opt.Events = new JwtBearerEvents
                  {
                    OnMessageReceived = context =>
                    {
                      var accessToken = context.Request.Query["access_token"];
                      var path = context.HttpContext.Request.Path;
                      if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                      {
                        context.Token = accessToken;
                      }
                      return Task.CompletedTask;
                    }
                  };
                });

      services.AddScoped<TokenService>();

      return services;
    }
  }
}
