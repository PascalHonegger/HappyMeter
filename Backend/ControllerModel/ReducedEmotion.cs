using AtosHappyMeter.Models;

namespace AtosHappyMeter.ControllerModel
{
	public class ReducedEmotion
	{
		public ReducedEmotion(Emotion emotion)
		{
			Id = emotion.Id;
			SmileyCode = emotion.Smiley;
		}

		public int Id { get; }

		public string SmileyCode { get; }
	}
}