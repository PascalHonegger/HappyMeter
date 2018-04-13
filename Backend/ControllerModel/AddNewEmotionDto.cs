﻿using System.ComponentModel.DataAnnotations;

namespace AtosHappyMeter.ControllerModel
{
	public class AddNewEmotionDto
	{
		[Required]
		[MaxLength(25)]
		public string NewSmileyCode { get; set; }
	}
}