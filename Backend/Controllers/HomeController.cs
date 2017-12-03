using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace AtosHappyMeter.Controllers
{
	public class HomeController : ApiController
	{
		[HttpGet]
		[Route("")]
		public HttpResponseMessage Index()
		{
			HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.MovedPermanently);
			response.Headers.Location = new Uri("client/index.html", UriKind.Relative);
			response.Headers.CacheControl = CacheControlHeaderValue.Parse("no-cache, no-store, must-revalidate");
			return response;
		}
	}
}