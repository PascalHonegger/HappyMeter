using System.ComponentModel.DataAnnotations;

namespace AtosHappyMeter.ControllerModel
{
	public class AddNewEmotionDto
	{
		[Required]
		public string NewSmileyCode { get; set; }
	}
}