using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using AtosHappyMeter.Attributes;
using AtosHappyMeter.ControllerModel;
using AtosHappyMeter.Models;

namespace AtosHappyMeter.Controllers
{
	public class EmotionalStateController : ApiController
	{
		[HttpGet]
		[ResponseType(typeof(List<ReducedEmotionalState>))]
		public async Task<IHttpActionResult> DailyEmotionalStates()
		{
			using (var dbContext = new HappyMeterDatabaseContext())
			{
				var currentDate = DateTime.Now.Date;
				var data = await dbContext.EmotionalStates
					.Where(e => e.Emotion.IsActive && e.CreatedDate == currentDate)
					.Select(e => new ReducedEmotionalState
					{
						Comment = e.Comment,
						CreatedDate = e.CreatedDate,
						EmotionId = e.EmotionId
					})
					.ToListAsync();
				return Ok(data);
			}
		}

		[HttpGet]
		[ResponseType(typeof(List<GroupedEmotionalState>))]
		[AuthorizeAdministrator]
		public async Task<IHttpActionResult> GroupedEmotionalStatesWithinRange([Required] DateTime from, [Required] DateTime to)
		{
			// Validate parameters
			if (!ModelState.IsValid || from > to)
			{
				return BadRequest();
			}

			using (var dbContext = new HappyMeterDatabaseContext())
			{
				var data = await dbContext.EmotionalStates
					.Where(e => e.CreatedDate >= from.Date && e.CreatedDate <= to.Date)
					.GroupBy(e => new { e.EmotionId, e.CreatedDate })
					.Select(group => new GroupedEmotionalState
					{
						CreatedDate = group.Key.CreatedDate,
						EmotionId = group.Key.EmotionId,
						Count = group.Count()
					})
					.ToListAsync();
				return Ok(data);
			}
		}

		[HttpPost]
		[ResponseType(typeof(void))]
		public async Task<IHttpActionResult> AddEmotionalState([FromBody] AddEmotionalStateDto addEmotionalStateDto)
		{
			// Validate parameters
			if (!ModelState.IsValid || addEmotionalStateDto == null)
			{
				return BadRequest();
			}

			using (var dbContext = new HappyMeterDatabaseContext())
			{
				// The provided Emotion has to exist and be active
				if (!await dbContext.Emotions.AnyAsync(e => e.Id == addEmotionalStateDto.EmotionId && e.IsActive))
				{
					return BadRequest();
				}


				dbContext.EmotionalStates.Add(new EmotionalState
				{
					EmotionId = addEmotionalStateDto.EmotionId,
					Comment = addEmotionalStateDto.Comment,
					CreatedDate = DateTime.Now.Date
				});

				await dbContext.SaveChangesAsync();

				return StatusCode(HttpStatusCode.NoContent);
			}
		}
	}
}