using System.Data.Entity;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using AtosHappyMeter.Attributes;
using AtosHappyMeter.Constants;
using AtosHappyMeter.ControllerModel;
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
		public async Task<IHttpActionResult> SetNewUsername([FromBody] SetUsernameDto setUsernameDto)
		{
			// Validate parameters
			if (!ModelState.IsValid || setUsernameDto == null)
			{
				return BadRequest();
			}

			var autorisedAdministrator =
				(Administrator) ActionContext.Request.Properties[AuthorizationConstants.UserInformationKey];

			using (var dbContext = new HappyMeterDatabaseContext())
			{
				if (await dbContext.Administrators.AnyAsync(a => a.Username == setUsernameDto.NewUsername))
				{
					return BadRequest();
				}

				dbContext.Administrators.Attach(autorisedAdministrator);

				autorisedAdministrator.UpdateUsername(setUsernameDto.NewUsername);

				await dbContext.SaveChangesAsync();

				return Ok();
			}
		}

		[HttpPost]
		[ResponseType(typeof(void))]
		public async Task<IHttpActionResult> SetNewPassword([FromBody] SetPasswordDto setPasswordDto)
		{
			// Validate parameters
			if (!ModelState.IsValid || setPasswordDto == null)
			{
				return BadRequest();
			}

			var autorisedAdministrator =
				(Administrator) ActionContext.Request.Properties[AuthorizationConstants.UserInformationKey];

			using (var dbContext = new HappyMeterDatabaseContext())
			{
				dbContext.Administrators.Attach(autorisedAdministrator);

				autorisedAdministrator.UpdatePassword(setPasswordDto.NewPassword);

				await dbContext.SaveChangesAsync();

				return Ok();
			}
		}
	}
}