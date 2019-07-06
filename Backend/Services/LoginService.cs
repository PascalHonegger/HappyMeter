using System.Linq;
using AtosHappyMeter.Models;

namespace AtosHappyMeter.Services
{
	public static class LoginService
	{
		private static bool VerifyPassword(string text, string hash)
		{
			return BCrypt.Net.BCrypt.Verify(text, hash);
		}
		private static string HashPassword(string password)
		{
			return BCrypt.Net.BCrypt.HashPassword(password);
		}

		public static (bool isAuthorized, Administrator foundAdministrator) AuthorizeUser(string username, string password)
		{
			using (var dbContext = new HappyMeterDatabaseContext())
			{
				var foundAdministrator = dbContext.Administrators.FirstOrDefault(a => a.Username == username);
				if (foundAdministrator == null)
				{
					if (!dbContext.Administrators.Any())
					{
						// First login ever and currently no user created
						var createdAdministrator = CreateUser(username, password);
						dbContext.Administrators.Add(createdAdministrator);
						dbContext.SaveChanges();
						return (true, createdAdministrator);
					}

					// Wrong username
					return (false, null);
				}

				if (!VerifyPassword(password, foundAdministrator.PasswordHash))
				{
					return (false, null);
				}

				return (true, foundAdministrator);
			}
		}

		public static Administrator CreateUser(string username, string password)
		{
			return new Administrator
			{
				Username = username,
				PasswordHash = HashPassword(password)
			};
		}

		public static void UpdateUsername(this Administrator administrator, string newUsername)
		{
			administrator.Username = newUsername;
		}

		public static void UpdatePassword(this Administrator administrator, string newPassword)
		{
			administrator.PasswordHash = HashPassword(newPassword);
		}
	}
}