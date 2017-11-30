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
		[ResponseType(typeof(List<EmotionalStateHistoryItem>))]
		public async Task<IHttpActionResult> GroupedEmotionalStatesWithinRange([Required] DateTime from, [Required] DateTime to, int utcOffsetInMinutes)
		{
			from = from.AddMinutes(-utcOffsetInMinutes);
			to = to.AddMinutes(-utcOffsetInMinutes);
			// Validate parameters
			if (!ModelState.IsValid || from > to)
			{
				return BadRequest();
			}

			using (var dbContext = new HappyMeterDatabaseContext())
			{
				var data = await dbContext.EmotionalStates
					.Where(e => e.CreatedDate >= from && e.CreatedDate < to)
					.Select(e => new { e.Id, e.CreatedDate, e.Comment, e.Emotion.Smiley })
					.ToListAsync();

				var groupedData = data
					.GroupBy(e => new { Date = e.CreatedDate.AddMinutes(-utcOffsetInMinutes).Date.AddMinutes(utcOffsetInMinutes) })
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
					CreatedDate = DateTime.UtcNow
				});

				await dbContext.SaveChangesAsync();

				return StatusCode(HttpStatusCode.NoContent);
			}
		}
	}
}