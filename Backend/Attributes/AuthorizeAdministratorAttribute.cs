using System.Linq;
using System.Web.Http;
using System.Web.Http.Controllers;
using AtosHappyMeter.Constants;
using AtosHappyMeter.Services;

namespace AtosHappyMeter.Attributes
{
	public class AuthorizeAdministratorAttribute : AuthorizeAttribute
	{
		protected override bool IsAuthorized(HttpActionContext actionContext)
		{
			var headers = actionContext.Request.Headers;
			if (!headers.Contains(AuthorizationConstants.UsernameKey) || !headers.Contains(AuthorizationConstants.PasswordKey))
			{
				// No credentials provided
				return false;
			}

			var username = headers.GetValues(AuthorizationConstants.UsernameKey).First();
			var password = headers.GetValues(AuthorizationConstants.PasswordKey).First();

			var (isAuthorized, foundUser) = LoginService.AuthorizeUser(username, password);

			if (!isAuthorized)
			{
				return false;
			}

			actionContext.Request.Properties[AuthorizationConstants.UserInformationKey] = foundUser;
			return true;
		}
	}
}