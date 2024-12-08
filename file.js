const fileInput=document.getElementById("file-input");fileInput.addEventListener("change",a=>{chrome.runtime.sendMessage({type:"file-selected",filePath:a.target.files[0].path})});
