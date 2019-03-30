using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

//
// Summary:
//     The main webapp namespace for binding operations.
namespace activePdfApp.Pages
{
    //
    // Summary:
    //     The main webapp class model for binding operations.
    public class IndexModel : PageModel
    {
        //
        // Summary:
        //     The image file to be uploaded by the user (one at a time).
        [BindProperty]
        public IFormFile Image { get; set; }
        //
        // Summary:
        //     The relative path to the generated PDF of the image uploaded.
        public string PDF = "";
        //
        // Summary:
        //     The error message for no uploading the correct file type.
        public string PDFError = "";
        //
        // Summary:
        //     The main handler for on-upload actions of image files.
        public async Task<IActionResult> OnPostAsync()
        {
            var name = Image.Name();
            
            var lower = name.ToLower();
            var isPNG = lower.EndsWith(".png");
            var isJPG = lower.EndsWith(".jpg") || lower.EndsWith(".jpeg");
            var isTIF = lower.EndsWith(".tif") || lower.EndsWith(".tiff");
            var isBMP = lower.EndsWith(".bmp");
            var isGIF = lower.EndsWith(".gif");
            
            Console.WriteLine($"Uploaded Image: {name}");

            if (!(isPNG || isJPG || isTIF || isBMP || isGIF))
            {
                PDFError = $"\"{name}\" is not an image";
                return Page();
            }

            var TK = new APToolkitNET.Toolkit();

            var imageFile = await SaveFile(Image);
            var pdf = $"{name}.pdf";
            var res = TK.ImageToPDF(imageFile, $"wwwroot/uploads/{pdf}");

            Console.WriteLine($"TK.ImageToPDF = {res}");

            PDF = $"uploads/{pdf}";

            return Page();
        }
        //
        // Summary:
        //     Saves a file in memory to the webapp's root folder for frontend access.
        private static async Task<string> SaveFile(IFormFile file)
        {
            if (file.Length == 0) return "";

            var name = file.Name();

            using (var fileStream = new FileStream($"wwwroot/uploads/{name}", FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
                return $"wwwroot/uploads/${name}";
            }
        }
    }
    //
    // Summary:
    //     Holds extension methods for convenience specific to the webapp.
    public static class MyExtensions
    {
        // Summary:
        //     Sanitizes a path in a IFormFile's FileName to be just the file name itself.
        public static string Name(this IFormFile file)
        {
            var fileName = file.FileName;

            var slash = fileName.LastIndexOf('\\');
            if (slash == -1)
            {
                slash = fileName.LastIndexOf('/');
            }

            if (slash != -1)
            {
                fileName = fileName.Substring(slash + 1);
            }

            return fileName;
        }
    } 
}
