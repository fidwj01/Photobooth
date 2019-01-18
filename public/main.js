//function readFile() {
function uploadFile() {
    var url = ".";
    var fileSelector = document.getElementById('fileSelector');
    var selectedFile = fileSelector.files[0];
    var fr = new FileReader();
    var formData = new FormData();
    // anonymous callback uses file as image source
    fr.onload = function() {
        var photoImg = addImage(fr.result, fileSelector.files.item(0).name);
        photoImg.style.opacity = 0.5;
        // stick the file into the form
        formData.append("userfile", selectedFile);

        // more or less a standard http request
        var oReq = new XMLHttpRequest();
        // POST requests contain data in the body
        // the "true" is the default for the third param, so
        // it is often omitted; it means do the upload
        // asynchornously, that is, using a callback instead
        // of blocking until the operation is completed.
        oReq.open("POST", url, true);

        oReq.onload = function() {
            photoImg.style.opacity = 1.0;
        	// the response, in case we want to look at it
        	console.log(oReq.responseText);
            toGoogle(fileSelector.files.item(0).name);
        }
        oReq.send(formData);
        photoImg.id = selectedFile.name;
    };
    fr.readAsDataURL(selectedFile);    // begin reading
}

//function readFile() {
function mobileUploadFile() {
    var url = ".";
    var fileSelector = document.getElementById('mobileFileSelector');
    var selectedFile = fileSelector.files[0];
    var fr = new FileReader();
    var formData = new FormData();
    // anonymous callback uses file as image source
    fr.onload = function() {
        var photoImg = addImage(fr.result, fileSelector.files.item(0).name);
        photoImg.style.opacity = 0.5;
        // stick the file into the form
        formData.append("userfile", selectedFile);

        // more or less a standard http request
        var oReq = new XMLHttpRequest();
        // POST requests contain data in the body
        // the "true" is the default for the third param, so
        // it is often omitted; it means do the upload
        // asynchornously, that is, using a callback instead
        // of blocking until the operation is completed.
        oReq.open("POST", url, true);

        oReq.onload = function() {
            photoImg.style.opacity = 1.0;
        	// the response, in case we want to look at it
        	console.log(oReq.responseText);
            toGoogle(fileSelector.files.item(0).name);
        }
        oReq.send(formData);
        photoImg.id = selectedFile.name;
    };
    fr.readAsDataURL(selectedFile);    // begin reading
}

function toGoogle(imgSrc) {
    // construct url for query
    var url = "query?google=" + imgSrc;

    // becomes method of request object oReq
    function reqListener () {
        var photoLable = document.getElementById("photoLable" + imgSrc);
        getTag(photoLable);
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}

/* called when page is loaded */
function init() {
    // construct url for query
    var url = "query?getall";
    var data;

    // becomes method of request object oReq
    function reqListener () {
        data = this.responseText;
        data = JSON.parse(data);
        for (var i in data) {
            addImage(data[i].fileName);
        }
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}

function refresh() {
    var photoArea = document.getElementById("photoArea");
    while (photoArea.hasChildNodes()) {
        photoArea.removeChild(photoArea.lastChild);
    }
    init();
}

function addImage(imgSrc, imgId) {
    var id;
    var photoItem = document.createElement("div");
    photoItem.className = "photoItem";
    var photoDiv = document.createElement("div");
    photoDiv.className = "photoDiv";
    var menuDiv = document.createElement("div");
    menuDiv.className = "menuDiv";
    var firstRow = document.createElement("div");
    firstRow.className = "menuRow";
    var changeTagsButton = document.createElement("button");
    changeTagsButton.className = "menuButton";
    var secondRow = document.createElement("div");
    secondRow.className = "menuRow";
    var addToFavoritesButton = document.createElement("button");
    addToFavoritesButton.className = "menuButton";
    var thirdRow = document.createElement("div");
    thirdRow.className = "thirdRow";
    var menuImg = document.createElement("img");
    menuImg.className = "menuImg";
    var photoImg = document.createElement("img");
    photoImg.className = "photoImg";
    var tagInput = document.createElement("input");
    var photoLable = document.createElement("span");
    photoLable.className = "photoLable";
    var addTagButton = document.createElement("button");
    addTagButton.className = "button";
    var newTagDiv = document.createElement("div");
    newTagDiv.className = "newTagDiv";
    var oldTagDiv = document.createElement("div");
    oldTagDiv.className = "oldTagDiv";
    var tagDiv = document.createElement("div");
    tagDiv.className = "tagDiv";
    var lableDiv = document.createElement("div");
    lableDiv.className = "lableDiv";

    if (imgId == undefined) {
        photoItem.id = "photoItem" + imgSrc;
        menuDiv.id = "menuDiv" + imgSrc;
        firstRow.id = "firstRow" + imgSrc;
        secondRow.id = "secondRow" + imgSrc;
        addToFavoritesButton.id = "addToFavoritesButton" + imgSrc;
        thirdRow.id = "thirdRow" + imgSrc;
        menuImg.id = "menuImg" + imgSrc;
        tagInput.id = "tagInput" + imgSrc;
        photoLable.id = "photoLable" + imgSrc;
        addTagButton.id = "addTagButton" + imgSrc;
        oldTagDiv.id = "oldTagDiv" + imgSrc;
        tagDiv.id = "tagDiv" + imgSrc;
        id = imgSrc;
    } else {
        photoItem.id = "photoItem" + imgId;
        menuDiv.id = "menuDiv" + imgId;
        firstRow.id = "firstRow" + imgId;
        secondRow.id = "secondRow" + imgId;
        addToFavoritesButton.id = "addToFavoritesButton" + imgId;
        thirdRow.id = "thirdRow" + imgId;
        tagInput.id = "tagInput" + imgId;
        addTagButton.id = "addTagButton" + imgId;
        oldTagDiv.id = "oldTagDiv" + imgId;
        tagDiv.id = "tagDiv" + imgId;
        menuImg.id = "menuImg" + imgId;
        photoLable.id = "photoLable" + imgId;
        id = imgId;
    }

    menuDiv.style.bottom = 0;
    changeTagsButton.setAttribute("onclick", "changeTags(this.parentElement.id)");
    changeTagsButton.appendChild(document.createTextNode("change tags"));
    firstRow.appendChild(changeTagsButton);
    firstRow.style.display = "none";
    addToFavoritesButton.id = "addToFavoritesButton" + id;
    addToFavoritesButton.setAttribute("onclick", "addToFavorites(this.parentElement.id)");
    secondRow.appendChild(addToFavoritesButton);
    secondRow.style.display = "none";
    menuImg.src = "./photobooth/optionsTriangle.png"
    menuImg.setAttribute("onclick", "openImageMenu(this.id)");
    thirdRow.appendChild(menuImg);
    thirdRow.style.border = 0;
    menuDiv.appendChild(firstRow);
    menuDiv.appendChild(secondRow);
    menuDiv.appendChild(thirdRow);
    photoDiv.appendChild(menuDiv);

    photoImg.src = imgSrc;
    photoImg.alt = id;
    photoDiv.appendChild(photoImg);
    photoItem.appendChild(photoDiv);

    tagInput.type = "text";
    tagInput.style.display = "none";
    tagInput.style.width = "172px";
    tagInput.style.border = 0;

    if (imgId == undefined) {
        isFavorited(addToFavoritesButton);
        getTag(photoLable);
    } else {
        addToFavoritesButton.appendChild(document.createTextNode("add to favorites"));
    }

    addTagButton.setAttribute("onclick", "addTag(this.id)");
    addTagButton.style.width = "46px"
    addTagButton.style.display = "none";
    addTagButton.appendChild(document.createTextNode("Add"));

    newTagDiv.appendChild(photoLable);
    newTagDiv.appendChild(tagInput);

    oldTagDiv.style.padding = "2px";
    oldTagDiv.style.minHeight = "18px";
    oldTagDiv.appendChild(photoLable);

    tagDiv.style.padding = 0;
    tagDiv.style.marginBottom = "4px";
    tagDiv.appendChild(oldTagDiv);
    tagDiv.appendChild(newTagDiv);

    lableDiv.appendChild(tagDiv);
    lableDiv.appendChild(addTagButton);

    photoItem.appendChild(lableDiv);
    document.getElementById("photoArea").appendChild(photoItem);

    return photoItem;
}

function isFavorited(addToFavoritesButton) {
    var imgSrc = addToFavoritesButton.id.substring(20);
    var url = "query?favoriteFind=" + imgSrc;

    // becomes method of request object oReq
    function reqListener () {
        data = this.responseText;
        data = JSON.parse(data);
        if (data.favorite) {
            addToFavoritesButton.appendChild(document.createTextNode("unfavorites"));
        } else {
            addToFavoritesButton.appendChild(document.createTextNode("add to favorites"));
        }
    }
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}

function filterTag() {
    var keyword = document.getElementById("filterInput").value;
    var data;
    var photoArea = document.getElementById("photoArea");
    while (photoArea.hasChildNodes()) {
        photoArea.removeChild(photoArea.lastChild);
    }
    var url = "query?Labelfind=" + keyword;

    // becomes method of request object oReq
    function reqListener () {
        data = this.responseText;
        var tags = this.responseText.split("||");
        for(var i = 1; i < tags.length; i++) {
            addImage(tags[i].trim());
        }
    }
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}

function clearFilter() {
    document.getElementById("filterInput").value = "";
    refresh();
}

function openImageMenu(menuImgId) {
    var photoId = menuImgId.substring(7);
    var menuImg = document.getElementById(menuImgId);
    menuImg.setAttribute("onclick", "closeImageMenu(this.id)");
    var firstRow = document.getElementById("firstRow" + photoId);
    var secondRow = document.getElementById("secondRow" + photoId);
    firstRow.style.display = "block";
    secondRow.style.display = "block";
    var thirdRow = document.getElementById("thirdRow" + photoId);
    thirdRow.style.border = "1px solid #402C21";
    var menuDiv = document.getElementById(menuImgId).parentElement.parentElement;
    menuDiv.style.background = "#885541";
    menuDiv.style.bottom = "6px";
}

function closeImageMenu(menuImgId) {
    var photoId = menuImgId.substring(7);
    var menuImg = document.getElementById(menuImgId);
    menuImg.setAttribute("onclick", "openImageMenu(this.id)");
    var firstRow = document.getElementById("firstRow" + photoId);
    var secondRow = document.getElementById("secondRow" + photoId);
    firstRow.style.display = "none";
    secondRow.style.display = "none";
    var thirdRow = document.getElementById("thirdRow" + photoId);
    thirdRow.style.border = 0;
    var menuDiv = document.getElementById(menuImgId).parentElement.parentElement;
    menuDiv.style.background = "transparent";
    menuDiv.style.bottom = 0;
}

function changeTags(firstRowId) {
    var imgSrc = firstRowId.substring(8)
    document.getElementById("oldTagDiv" + imgSrc).style.background = "#BDA79E";
    var tagInputId = "tagInput" + imgSrc;
    document.getElementById(tagInputId).style.display = "inline";
    var addTagButtonId = "addTagButton" + imgSrc;
    document.getElementById(addTagButtonId).style.display = "inline";
    closeImageMenu("menuImg" + imgSrc);
    var photoLable = document.getElementById("photoLable" + imgSrc);

    var oldTagDiv = document.getElementById("oldTagDiv" + imgSrc);
    while (oldTagDiv.hasChildNodes()) {
        oldTagDiv.removeChild(oldTagDiv.lastChild);
    }
    createTagButton(imgSrc);
}

function createTagButton(imgSrc) {
    var url = "query?GetLabels=" + imgSrc;

    // becomes method of request object oReq
    function reqListener () {
        var tags = this.responseText.split(",");
        var oldTagDiv = document.getElementById("oldTagDiv" + imgSrc);
        for(var i in tags) {
            var tagButton = document.createElement("button");
            var deleteTagImg = document.createElement("img");
            deleteTagImg.src = "./photobooth/removeTagButton.png";
            deleteTagImg.style.height = "12px";
            deleteTagImg.style.width = "12px";
            deleteTagImg.style.marginTop = "4px";
            tagButton.appendChild(deleteTagImg);
            tagButton.className = "tagButton";
            tagButton.appendChild(document.createTextNode(tags[i]));
            tagButton.setAttribute("onclick", "removeTag(this)");
            oldTagDiv.appendChild(tagButton);
        }
    }
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();

    document.getElementById("tagInput" + imgSrc).value = "";
}

function removeTag(tagButton) {
    var oldTagDiv = tagButton.parentElement;
    var imgSrc = oldTagDiv.id.substring(9);
    var tag = tagButton.lastChild.textContent;
    // construct url for query
    var url = "query?LabelDelete!" + imgSrc + " = " + tag;

    // becomes method of request object oReq
    function reqListener () {}
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();

    oldTagDiv.removeChild(tagButton);
}

function addTag(addTagButtonId) {
    var imgSrc = addTagButtonId.substring(12);
    var tag = document.getElementById("tagInput" + imgSrc).value;
    tag = tag.trim();
    closeTagMenu(imgSrc);

    if (tag != "") {
        // construct url for query
        var url = "query?LabelADD!" + imgSrc + " = " + tag;

        // becomes method of request object oReq
        function reqListener () {
            var oldTagDiv = document.getElementById("oldTagDiv" + imgSrc);
            while (oldTagDiv.hasChildNodes()) {
                oldTagDiv.removeChild(oldTagDiv.lastChild);
            }
            var photoLable = document.createElement("span");
            photoLable.className = "photoLable";
            photoLable.id = "photoLable" + imgSrc;
            oldTagDiv.appendChild(photoLable);

            document.getElementById("tagInput" + imgSrc).value = "";
            var photoLable = document.getElementById("photoLable" + imgSrc);
            getTag(photoLable);
        }
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", reqListener);
        oReq.open("GET", url);
        oReq.send();
    } else {
        var oldTagDiv = document.getElementById("oldTagDiv" + imgSrc);
        while (oldTagDiv.hasChildNodes()) {
            oldTagDiv.removeChild(oldTagDiv.lastChild);
        }
        var photoLable = document.createElement("span");
        photoLable.className = "photoLable";
        photoLable.id = "photoLable" + imgSrc;
        oldTagDiv.appendChild(photoLable);

        document.getElementById("tagInput" + imgSrc).value = "";
        var photoLable = document.getElementById("photoLable" + imgSrc);
        getTag(photoLable);
    }
}

function getTag(photoLable) {
    photoLable.textContent = "";

    var imgSrc = photoLable.id.substring(10);
    var url = "query?GetLabels=" + imgSrc;

    // becomes method of request object oReq
    function reqListener () {
        var tags = this.responseText.split(",");
        var showTags = "";
        for(var i in tags) {
            showTags = showTags + " " + tags[i];
            photoLable.textContent = showTags;
        }
    }
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}

function closeTagMenu(imgSrc) {
    document.getElementById("tagInput" + imgSrc).style.display = "none";
    document.getElementById("addTagButton" + imgSrc).style.display = "none";
    document.getElementById("oldTagDiv" + imgSrc).style.background = "transparent";
}

function addToFavorites(secondRowId) {
    var imgSrc = secondRowId.substring(9);
    closeImageMenu("menuImg" + imgSrc);
    var addToFavoritesButton = document.getElementById("addToFavoritesButton" + imgSrc);

    if (addToFavoritesButton.textContent == "add to favorites") {
        addToFavoritesButton.textContent = "unfavorites";
    } else {
        addToFavoritesButton.textContent = "add to favorites";
    }

    // construct url for query
    var url = "query?favorite=" + imgSrc;

    // becomes method of request object oReq
    function reqListener () {}
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}

function showFavorites() {
    var photoArea = document.getElementById("photoArea");
    var data;
    while (photoArea.hasChildNodes()) {
        photoArea.removeChild(photoArea.lastChild);
    }
    var url = "query?favorite=all";

    // becomes method of request object oReq
    function reqListener () {
        data = this.responseText;
        data = JSON.parse(data);
        for (var i in data) {
            addImage(data[i].fileName);
        }
    }
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
    var div = document.getElementById("clearFavorites");
    div.style.display = "block";
}

function clearFavorites() {
    refresh();
    var div = document.getElementById("clearFavorites");
    div.style.display = "none";
}

function mobilePlus() {
    document.getElementById("mobileUploadDiv").style.display = "inline";
    document.getElementById("mobileFilterDiv").style.display = "none";
    document.getElementById("mobileFavoritesDiv").style.display = "none";
}

function mobileFilter() {
    document.getElementById("mobileUploadDiv").style.display = "none";
    document.getElementById("mobileFilterDiv").style.display = "inline";
    document.getElementById("mobileFavoritesDiv").style.display = "none";
}

function mobileFavorites() {
    document.getElementById("mobileUploadDiv").style.display = "none";
    document.getElementById("mobileFilterDiv").style.display = "none";
    document.getElementById("mobileFavoritesDiv").style.display = "inline";
    showFavorites();
}
