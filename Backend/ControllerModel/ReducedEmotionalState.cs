using System;
using AtosHappyMeter.Models;

namespace AtosHappyMeter.ControllerModel
{
	public class ReducedEmotionalState
	{
		public ReducedEmotionalState(EmotionalState emotionalState)
		{
			EmotionId = emotionalState.Id;
			CreatedDate = emotionalState.CreatedDate;
			Comment = emotionalState.Comment;
		}

		public int EmotionId { get; }

		public DateTime CreatedDate { get; }

		public string Comment { get; }

		//TODO Ort: Add Location Id
	}
}