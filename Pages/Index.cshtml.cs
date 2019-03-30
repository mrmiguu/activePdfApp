using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace activePdfApp.Pages
{
    public class IndexModel : PageModel
    {
        [BindProperty]
        public IFormFile Image { get; set; }

        public string PDF = "";

        public async Task<IActionResult> OnPostAsync()
        {
            Console.WriteLine($"Uploaded Image: {Image.FileName}.");

            var TK = new APToolkitNET.Toolkit();

            var imageFile = await SaveFile(Image);
            PDF = $"{Image.FileName}.pdf";

            var res = TK.ImageToPDF(imageFile, PDF);

            Console.WriteLine($"TK.ImageToPDF = {res}");

            return Page();
        }

        private static async Task<string> SaveFile(IFormFile file)
        {
            if (file.Length == 0) return "";

            using (var fileStream = new FileStream(file.FileName, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
                return file.FileName;
            }
        }
    }
}
