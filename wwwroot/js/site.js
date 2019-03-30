// Open selected PDF.
function initReaderPlus(pdf) {
  console.log('initReaderPlus('+pdf+')!');

  // let file = document.getElementById('file-upload').files[0];

  if (pdf.indexOf('pdf') == -1) {
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
    console.log('readerPlus: onload!');
    data = e.target.result.substring(28);
  }

  // Initialization settings.
  reader.onloadend = function(e) {
    console.log('readerPlus: onloadend!');
    
    readerplus.initializeSettings({
      protocol: 'http',
      hostname: 'localhost',
      port: 62625,
      language: 'en',
    });

    readerplus.Document.addEventListener('load', function() {
      console.log('readerPlus: readerplus.Document.load!');

      readerplus.mainmenu.File.addSection('newSection');
      readerplus.mainmenu.File.newSection.addItem(
        'Save & Print',
        '',
        '/images/save-n-print_icon.png',
        false,
        '',
        '',
        function() {
          readerplus.Document.addEventListener('saveComplete', function() {
            console.log('readerPlus: saveComplete!');
            readerplus.Document.print();
          });
          readerplus.Document.save();
        },
      );

      // Drill down into our newSection's first-everything until we reach the untranslatable tooltip.
      let toolTip = document.getElementById('newSection') || {};
      toolTip = toolTip.firstChild || {}; // <nav>
      toolTip = toolTip.firstChild || {}; // <ul>
      toolTip = toolTip.firstChild || {}; // <li>
      toolTip = toolTip.firstChild || {}; // <a>
      toolTip.title = 'Save & Print';
    });

    // Document settings.
    let isMasterDocument = 1;
    let editMode = 1;

    // Upload document from memory into viewer.
    let result = readerplus.Document.upload(data, isMasterDocument, editMode, '', file.name);

    if (!result.Status) {
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
  readerplus.Document.addEventListener('submit', function(strResult) {
    console.log('readerPlus: submit');
    
    let result = JSON.parse(strResult);

    if (!result.Status) {
      // Open the submitted document in another tab and redirect to thankyou.html.
      let submittedPDFData = result.Details;
      let pdfwindow = window.open('');

      pdfwindow.document.write('<iframe width="100%" height="100%" src="data:application/pdf;base64, ' + encodeURI(submittedPDFData) + '"></iframe>');
      // window.location = 'thankyou.html';
    } else {
      // Display alert on error.
      alert('Document failed to submit!');
      console.error(result.Details);
    }

  });
}
