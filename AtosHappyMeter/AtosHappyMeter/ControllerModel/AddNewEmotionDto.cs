using System.ComponentModel.DataAnnotations;

namespace AtosHappyMeter.ControllerModel
{
	public class AddNewEmotionDto
	{
		[Required]
		[MaxLength(6)]
		public string NewSmileyCode { get; set; }
	}
}