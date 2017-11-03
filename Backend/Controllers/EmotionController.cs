using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using AtosHappyMeter.Attributes;
using AtosHappyMeter.ControllerModel;
using AtosHappyMeter.Models;

namespace AtosHappyMeter.Controllers
{
	public class EmotionController : ApiController
	{
		[HttpGet]
		[ResponseType(typeof(List<ReducedEmotion>))]
		public async Task<IHttpActionResult> ActiveEmotions()
		{
			using (var dbContext = new AtosDatabaseContext())
			{
				var data = await dbContext.Emotions
					.Where(e => e.IsActive)
					.Select(e => new ReducedEmotion(e))
					.ToListAsync();
				return Json(data);
			}
		}

		[HttpGet]
		[ResponseType(typeof(List<Emotion>))]
		[AuthorizeAdministrator]
		public async Task<IHttpActionResult> AllEmotions()
		{
			using (var dbContext = new AtosDatabaseContext())
			{
				var data = await dbContext.Emotions.ToListAsync();
				return Json(data);
			}
		}

		[HttpPost]
		[ResponseType(typeof(void))]
		[AuthorizeAdministrator]
		public async Task<IHttpActionResult> SetActiveForEmotion([FromBody] ChangeEmotionIsActiveDto changeEmotionIsActiveDto)
		{
			// Validate parameters
			if (!ModelState.IsValid || changeEmotionIsActiveDto == null)
			{
				return BadRequest();
			}

			using (var dbContext = new AtosDatabaseContext())
			{
				var data = await dbContext.Emotions.FindAsync(changeEmotionIsActiveDto.EmotionId);

				if (data == null)
				{
					return NotFound();
				}

				data.IsActive = changeEmotionIsActiveDto.IsActive;

				await dbContext.SaveChangesAsync();

				return Ok();
			}
		}

		[HttpPost]
		[ResponseType(typeof(void))]
		[AuthorizeAdministrator]
		public async Task<IHttpActionResult> SetSmileyForEmotion([FromBody] ChangeEmotionSmileyDto changeEmotionSmileyDto)
		{
			// Validate parameters
			if (!ModelState.IsValid || changeEmotionSmileyDto == null)
			{
				return BadRequest();
			}

			using (var dbContext = new AtosDatabaseContext())
			{
				if (await dbContext.Emotions.AnyAsync(e => e.Smiley == changeEmotionSmileyDto.NewSmileyCode))
				{
					return BadRequest();
				}

				var data = await dbContext.Emotions.FindAsync(changeEmotionSmileyDto.EmotionId);

				if (data == null)
				{
					return NotFound();
				}

				data.Smiley = changeEmotionSmileyDto.NewSmileyCode;

				await dbContext.SaveChangesAsync();

				return Ok();
			}
		}

		[HttpPost]
		[ResponseType(typeof(void))]
		[AuthorizeAdministrator]
		public async Task<IHttpActionResult> AddNewEmotion([FromBody] AddNewEmotionDto addNewEmotionDto)
		{
			// Validate parameters
			if (!ModelState.IsValid || addNewEmotionDto == null)
			{
				return BadRequest();
			}

			using (var dbContext = new AtosDatabaseContext())
			{
				if (await dbContext.Emotions.AnyAsync(e => e.Smiley == addNewEmotionDto.NewSmileyCode))
				{
					return BadRequest();
				}

				dbContext.Emotions.Add(new Emotion
				{
					Smiley = addNewEmotionDto.NewSmileyCode
				});

				await dbContext.SaveChangesAsync();

				return Ok();
			}
		}
	}
}