using Microsoft.AspNetCore.Http;

namespace server_samples.Models
{
    public class UpdateProfileDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Bio { get; set; }
        public string Website { get; set; }

        // The uploaded file (optional)
        public IFormFile ProfileImage { get; set; }

        // Optional flags
        public bool RemoveProfileImage { get; set; }
    }
}