using System.ComponentModel.DataAnnotations;

namespace AtosHappyMeter.ControllerModel
{
	public class ChangeEmotionIsActiveDto
	{
		[Required]
		public int EmotionId { get; set; }

		[Required]
		public bool IsActive { get; set; }
	}
}