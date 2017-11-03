using System.ComponentModel.DataAnnotations;

namespace AtosHappyMeter.ControllerModel
{
	public class ChangeEmotionSmileyDto
	{
		[Required]
		public int EmotionId { get; set; }

		[Required]
		[MaxLength(6)]
		public string NewSmileyCode { get; set; }
	}
}