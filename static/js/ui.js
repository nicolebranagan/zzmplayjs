const filePicker = document.getElementById('fileOpener');

if (!filePicker) {
  throw new Error("No file picker");
}

filePicker.addEventListener("change", function(e) {
  if (filePicker.files.length > 1) {
    throw new Error("too many files");
  }
  if (filePicker.files.length === 0) {
    // Do nothing
    return;
  }
  const file = filePicker.files[0];
  file.text().then(t => parseZzmAsText(t))
});
