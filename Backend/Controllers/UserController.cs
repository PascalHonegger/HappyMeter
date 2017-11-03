﻿using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using AtosHappyMeter.Attributes;
using AtosHappyMeter.Constants;
using AtosHappyMeter.Models;
using AtosHappyMeter.Services;

namespace AtosHappyMeter.Controllers
{
	[AuthorizeAdministrator]
	public class UserController : ApiController
	{
		[HttpGet]
		[ResponseType(typeof(void))]
		public IHttpActionResult TestCredentials()
		{
			// Authorization is done through the Attribute
			return Ok();
		}

		[HttpPost]
		[ResponseType(typeof(void))]
		public async Task<IHttpActionResult> SetNewUsername([FromBody] [MinLength(1)] [MaxLength(100)] string newUsername)
		{
			// Validate parameters
			if (!ModelState.IsValid)
			{
				return BadRequest();
			}

			var autorisedAdministrator = (Administrator) ActionContext.Request.Properties[AuthorizationConstants.UserInformationKey];

			using (var dbContext = new AtosDatabaseContext())
			{
				dbContext.Administrators.Attach(autorisedAdministrator);

				autorisedAdministrator.UpdateUsername(newUsername);

				await dbContext.SaveChangesAsync();

				return Ok();
			}
		}

		[HttpPost]
		[ResponseType(typeof(void))]
		public async Task<IHttpActionResult> SetNewPassword([FromBody] [MinLength(3)] [MaxLength(100)] string newPassword)
		{
			// Validate parameters
			if (!ModelState.IsValid)
			{
				return BadRequest();
			}

			var autorisedAdministrator = (Administrator)ActionContext.Request.Properties[AuthorizationConstants.UserInformationKey];

			using (var dbContext = new AtosDatabaseContext())
			{
				dbContext.Administrators.Attach(autorisedAdministrator);

				autorisedAdministrator.UpdatePassword(newPassword);

				await dbContext.SaveChangesAsync();

				return Ok();
			}
		}
	}
}