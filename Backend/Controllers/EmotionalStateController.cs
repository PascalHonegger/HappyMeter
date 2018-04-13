using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Linq;
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
		public async Task<IHttpActionResult> GroupedEmotionalStatesWithinRange([Required] DateTimeOffset from, [Required] DateTimeOffset to)
		{
			// Validate parameters
			if (!ModelState.IsValid || from > to || from.Offset != to.Offset)
			{
				return BadRequest();
			}

			using (var dbContext = new HappyMeterDatabaseContext())
			{
				var data = await dbContext.EmotionalStates
					.Where(e => e.CreatedDate >= from.UtcDateTime && e.CreatedDate <= to.UtcDateTime)
					.Select(e => new { e.Id, e.CreatedDate, e.Comment, e.Emotion.Smiley })
					.ToListAsync();

				var offset = from.Offset;

				var groupedData = data
					.GroupBy(e => e.CreatedDate.Add(offset).Date)
					.Select(dateGroup => new EmotionalStateHistoryItem
					{
						Date = new DateTimeOffset(dateGroup.Key, offset),
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

				return Ok();
			}
		}

		[HttpPost]
		[ResponseType(typeof(void))]
		public async Task<IHttpActionResult> AddEmojiFromFaceAnalysis([FromBody] AddEmojiFromFaceAnalysisDto addEmojiFromFaceAnalysisDto)
		{
			// Validate parameters
			if (!ModelState.IsValid || addEmojiFromFaceAnalysisDto == null)
			{
				return BadRequest();
			}

			using (var dbContext = new HappyMeterDatabaseContext())
			{
				// The provided Emotion has to exist (but doesn't have to be active)
				var fittingEmoji =
					await dbContext.Emotions.FirstOrDefaultAsync(e => e.Smiley == addEmojiFromFaceAnalysisDto.EmojiCode);
				if (fittingEmoji == null)
				{
					return BadRequest();
				}

				dbContext.EmotionalStates.Add(new EmotionalState
				{
					EmotionId = fittingEmoji.Id,
					CreatedDate = DateTime.UtcNow
				});

				await dbContext.SaveChangesAsync();

				return Ok();
			}
		}
	}
}