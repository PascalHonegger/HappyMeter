using System.ComponentModel.DataAnnotations;
using AtosHappyMeter.Constants;

namespace AtosHappyMeter.ControllerModel
{
	public class SetUsernameDto
	{
		[MinLength(1)]
		[MaxLength(100)]
		[RegularExpression(RegularExpressions.NoFunkyCharactersRegex)]
		public string NewUsername { get; set; }
	}
}