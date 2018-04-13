using System.ComponentModel.DataAnnotations;

namespace AtosHappyMeter.ControllerModel
{
	public class ChangeEmotionSmileyDto
	{
		[Required]
		public int EmotionId { get; set; }

		[Required]
		[MaxLength(25)]
		public string NewSmileyCode { get; set; }
	}
}