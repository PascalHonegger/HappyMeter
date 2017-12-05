using System.Web.Http;
#if DEBUG
using System.Web.Http.Cors;
#endif

namespace AtosHappyMeter
{
	public static class WebApiConfig
	{
		public static void Register(HttpConfiguration config)
		{
#if DEBUG
			// For debugging allow all sources
			var enableForAllAttribute = new EnableCorsAttribute("*", "*", "*");
			config.EnableCors(enableForAllAttribute);
#endif

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