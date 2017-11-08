using System.Net.Http.Formatting;
using System.Web;
using System.Web.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace AtosHappyMeter
{
	public class WebApiApplication : HttpApplication
	{
		protected void Application_Start()
		{
			GlobalConfiguration.Configure(WebApiConfig.Register);

			var config = GlobalConfiguration.Configuration;

			config.Formatters.Clear();
			config.Formatters.Add(new JsonMediaTypeFormatter());
			config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
			config.Formatters.JsonFormatter.SerializerSettings.Formatting = Formatting.Indented;
			config.Formatters.JsonFormatter.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
			config.Formatters.JsonFormatter.UseDataContractJsonSerializer = false;
		}
	}
}