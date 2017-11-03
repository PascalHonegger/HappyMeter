using System.Linq;
using System.Web.Http;
using AtosHappyMeter.Models;

namespace AtosHappyMeter.Controllers
{
	public class HomeController : ApiController
	{
		[HttpGet]
		[Route("")]
		public IHttpActionResult Index()
		{
			using (var dbContext = new AtosDatabaseContext())
			{
				return Json(dbContext.EmotionalStates.Include(nameof(EmotionalState.Emotion)).ToList());
			}
		}
	}
}