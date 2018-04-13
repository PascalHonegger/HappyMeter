using System.ComponentModel.DataAnnotations;

namespace AtosHappyMeter.ControllerModel
{
	public class AddEmojiFromFaceAnalysisDto
	{
		[Required]
		[MaxLength(25)]
		public string EmojiCode { get; set; }
	}
}