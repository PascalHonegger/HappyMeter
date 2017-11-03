using System.Web.Http;
using System.Web.Http.Cors;

namespace AtosHappyMeter
{
	public static class WebApiConfig
	{
		public static void Register(HttpConfiguration config)
		{
			// Web API configuration and services
			var enableForAllAttribute = new EnableCorsAttribute("*", "*", "*");
			config.EnableCors(enableForAllAttribute);

			// Web API routes
			config.MapHttpAttributeRoutes();

			config.Routes.MapHttpRoute(
				"DefaultApi",
				"api/{controller}/{action}",
				new {controller = "Home", action = "Index"}
			);
		}
	}
}