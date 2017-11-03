using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using MySql.Data.Entity;

namespace AtosHappyMeter.Models
{
	[DbConfigurationType(typeof(MySqlEFConfiguration))]
	public class AtosDatabaseContext : DbContext
	{
		public AtosDatabaseContext() : base("name=AtosHappyMeterDatabase")
		{
		}

		public virtual DbSet<EmotionalState> EmotionalStates { get; set; }
		public virtual DbSet<Emotion> Emotions { get; set; }
		public virtual DbSet<Administrator> Administrators { get; set; }
	}

	[Table("emotional_state")]
	public class EmotionalState
	{
		[Column("id")]
		public int Id { get; set; }

		[Column("emotion_id")]
		public int EmotionId { get; set; }

		[ForeignKey(nameof(EmotionId))]
		public virtual Emotion Emotion { get; set; }

		[Column("comment")]
		public string Comment { get; set; }
	}

	[Table("emotion")]
	public class Emotion
	{
		[Column("id")]
		public int Id { get; set; }

		[Column("smiley")]
		public string Smiley { get; set; }

		[Column("is_active")]
		public bool IsActive { get; set; }
	}

	[Table("administrator")]
	public class Administrator
	{
		[Column("id")]
		public int Id { get; set; }

		[Column("username")]
		public string Username { get; set; }

		[Column("password_hash")]
		public string PasswordHash { get; set; }
	}
}