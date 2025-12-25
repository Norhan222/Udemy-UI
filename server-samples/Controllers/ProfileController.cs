using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Http;
using server_samples.Models;

namespace server_samples.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        public StudentController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            // placeholder - return example
            return Ok(new { firstName = "John", lastName = "Doe", profileImageUrl = "/images/profile/default.png" });
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");

            var uploads = Path.Combine(_env.WebRootPath ?? "wwwroot", "images", "profile");
            Directory.CreateDirectory(uploads);

            string savedPath = null;
            if (dto.ProfileImage != null && dto.ProfileImage.Length > 0)
            {
                var ext = Path.GetExtension(dto.ProfileImage.FileName);
                var fileName = $"{Guid.NewGuid()}{ext}";
                var filePath = Path.Combine(uploads, fileName);
                using (var stream = System.IO.File.Create(filePath))
                {
                    await dto.ProfileImage.CopyToAsync(stream);
                }
                savedPath = $"/images/profile/{fileName}";
            }

            // TODO: apply changes to DB, set user.ProfileImagePath = savedPath etc.

            // Return the public URL (client will add cache-buster)
            return Ok(new { profileImageUrl = savedPath });
        }
    }
}