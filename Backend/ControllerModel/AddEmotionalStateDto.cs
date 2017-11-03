using System.ComponentModel.DataAnnotations;
using AtosHappyMeter.Constants;

namespace AtosHappyMeter.ControllerModel
{
	public class AddEmotionalStateDto
	{
		[Required]
		public int EmotionId { get; set; }

		[MaxLength(250)]
		[RegularExpression(RegularExpressions.NoFunkyCharactersRegex)]
		public string Comment { get; set; }

		//TODO Ort: Add Location Id
	}
}