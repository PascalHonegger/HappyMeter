using System;
using System.Collections.Generic;

namespace AtosHappyMeter.ControllerModel
{
	public class EmotionalStateHistoryItem
	{
		public DateTimeOffset Date { get; set; }
		public List<GroupedEmotionalState> EmotionalStates;
	}
}