using System.ComponentModel.DataAnnotations;

namespace AtosHappyMeter.ControllerModel
{
	public class SetPasswordDto
	{
		[MinLength(3)]
		[MaxLength(100)]
		public string NewPassword { get; set; }
	}
}