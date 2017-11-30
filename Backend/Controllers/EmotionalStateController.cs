using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
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
				// earliest time today 
				var today = DateTime.Today;
				// earliest time tomorrow
				var tomorrow = DateTime.Today.AddDays(1);

				var data = await dbContext.EmotionalStates
					.Where(e => e.Emotion.IsActive && e.CreatedDate >= today && e.CreatedDate < tomorrow)
					.OrderBy(e => e.CreatedDate)
					.ThenBy(e => e.Id)
					.Select(e => new ReducedEmotionalState
					{
						Id = e.Id,
						Comment = e.Comment,
						CreatedDate = e.CreatedDate,
						EmotionId = e.EmotionId
					})
					.ToListAsync();
				return Ok(data);
			}
		}

		[HttpGet]
		[ResponseType(typeof(List<EmotionalStateHistoryItem>))]
		public async Task<IHttpActionResult> GroupedEmotionalStatesWithinRange([Required] DateTime from, [Required] DateTime to)
		{
			// Validate parameters
			if (!ModelState.IsValid || from > to)
			{
				return BadRequest();
			}

			var fromDate = from.Date;
			// Add a day to the target as we'll check if the dates are smaller than specified
			var toDate = to.Date.AddDays(1);

			using (var dbContext = new HappyMeterDatabaseContext())
			{
				var data = await dbContext.EmotionalStates
					.Where(e => e.CreatedDate >= fromDate && e.CreatedDate < toDate)
					.Select(e => new { e.Id, e.CreatedDate, e.Comment, e.Emotion.Smiley })
					.ToListAsync();

				var groupedData = data
					.GroupBy(e => new { e.CreatedDate.Date })
					.Select(dateGroup => new EmotionalStateHistoryItem
					{
						Date = dateGroup.Key.Date,
						EmotionalStates = dateGroup.GroupBy(e => e.Smiley).OrderBy(g => g.Key).Select(g => new GroupedEmotionalState
						{
							SmileyCode = g.Key,
							Comments = g.Where(e => !string.IsNullOrWhiteSpace(e.Comment)).Select(e => new CommentWithPostdate
							{
								Id = e.Id,
								PostDate = e.CreatedDate,
								Comment = e.Comment
							}).ToList(),
							Count = g.Count()
						}).ToList()
					});

				return Ok(groupedData);
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
					CreatedDate = DateTime.Now
				});

				await dbContext.SaveChangesAsync();

				return StatusCode(HttpStatusCode.NoContent);
			}
		}
	}
}