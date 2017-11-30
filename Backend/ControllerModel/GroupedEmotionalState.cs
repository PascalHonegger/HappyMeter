using System.Collections.Generic;

namespace AtosHappyMeter.ControllerModel
{
	public class GroupedEmotionalState
	{
		public string SmileyCode { get; set; }

		public int Count { get; set; }

		public List<CommentWithPostdate> Comments { get; set; }
	}
}