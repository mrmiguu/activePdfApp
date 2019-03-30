// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

// Open selected PDF.
function initReaderPlus(pdf) {
  console.log('initReaderPlus('+pdf+')!');

  // let file = document.getElementById('file-upload').files[0];

  if (pdf.indexOf("pdf") == -1) {
    console.log('initReaderPlus: is not pdf');
    return;
  }

  fetch(pdf).then(resp => {

    console.log('initReaderPlus: fetched ' + pdf);
    return resp.blob();

  }).then(blob => {

    console.log('initReaderPlus: blobified!');
    blob.name = pdf;
    readerPlus(blob);

  }).catch(reas => {
    console.error('initReaderPlus: ' + reas);
  });
}

// Process a PDF blob.
function readerPlus(file) {
  console.log('readerPlus('+file.name+')!');
  
  // Load document into memory.
  let reader = new FileReader();

  reader.readAsDataURL(file);

  // Shared between onload and onloadend for the reader.
  let data;

  reader.onload = function(e) {
    console.log('readerPlus: onload');

    let filedata = e.target.result;
    data = filedata.substring(28);
  }

  // Initialization settings.
  reader.onloadend = function(e) {
    console.log('readerPlus: onloadend');
    
    // document.getElementById('file-upload').outerHTML = "";

    readerplus.initializeSettings({
      protocol: "http",
      hostname: 'localhost',
      port: 62625,
      language: 'en',
    });

    readerplus.Document.addEventListener("load", function () {
      // On document load you can add addtional options such as 
      // adding annotations, populating form fields and controlling 
      // elements of the user interface.
    });

    // Document settings.
    let isMasterDocument = 1;
    let editMode = 1;

    // Upload document from memory into viewer.
    let result = readerplus.Document.upload(data, isMasterDocument, editMode, "", file.name);

    if (result.Status === 0) {
      // Save document ID in order to reopen a document from the Reader Plus data store.
      let docID = readerplus.Document.getDocumentID();
      // Open document in edit mode.
      readerplus.Document.edit(docID);
    } else {
      // Display alert on error.
      alert('Document failed to open!');
      console.error(result.Details);
    }

  };

  // Document can be saved to any location when it is submitted by a user.
  readerplus.Document.addEventListener("submit", function(strResult) {
    console.log('readerPlus: submit');
    
    let result = JSON.parse(strResult);

    if (result.Status === 0) {
      // Open the submitted document in another tab and redirect to thankyou.html.
      let submittedPDFData = result.Details;
      let pdfwindow = window.open("");

      pdfwindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(submittedPDFData) + "'></iframe>");
      // window.location = "thankyou.html";
    } else {
      // Display alert on error.
      alert('Document failed to submit!');
      console.error(result.Details);
    }

  });
}
