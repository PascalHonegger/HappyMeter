using System;

namespace AtosHappyMeter.ControllerModel
{
	public class ReducedEmotionalState
	{
		public int EmotionId { get; set; }

		public DateTime CreatedDate { get; set; }

		public string Comment { get; set; }

		//TODO Ort: Add Location Id
	}
}