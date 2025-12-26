Server samples for handling profile image uploads

Files provided:
- Controllers/ProfileController.cs  - example ASP.NET Core controller with GET/PUT endpoints that save uploaded images to wwwroot/images/profile and return a public URL.
- Models/UpdateProfileDto.cs      - DTO including IFormFile ProfileImage and flags.

Integration notes:
- Add the controller and model files into your API project (namespace and folder names may be adjusted).
- Ensure you call app.UseStaticFiles() in Program.cs so files under wwwroot are served.
- Consider adding a maximum file-size check, allowed extensions list, and virus scan in production.
- For caching: return the image path and let the frontend append a cache-buster (e.g., ?v={timestamp}) or set Cache-Control/ETag headers server-side.

Example usage:
- Client sends a PUT /student/profile with multipart/form-data and `ProfileImage` file field.
- Server saves to wwwroot/images/profile and returns { profileImageUrl: "/images/profile/<guid>.jpg" }.
- Client appends `?v=${Date.now()}` to force refresh and updates UI immediately.

Security & permissions:
- Ensure the app has write permission to wwwroot/images/profile path.
- Ensure only authenticated users may update their own profile images.

Testing:
- You can test by using Postman with a PUT multipart/form-data request and verifying the file appears in wwwroot/images/profile and is accessible via browser.