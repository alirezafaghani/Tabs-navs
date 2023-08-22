function SpecificationSetCondition() {

    var $thisClass = this;
    this._xrm = null;
    this.fetchXmlBox = null;

    $(document).ready(function () {
        $thisClass.init();
    });

}



SpecificationSetCondition.prototype.init = function () {
    var $thisClass = this;
    $thisClass.FindXrm();

    $thisClass.retrieveSpecificationMaps();

    var fetchXmlBox = document.getElementById("FetchXMLBox");
    fetchXmlBox.value = $thisClass._xrm.Page.getAttribute("conditions").getValue();
    document.getElementById('FetchXMLBox').addEventListener("focusout", (event) => {
        event.target.focus()
    });

    $('#AppendBtn').click(function () {
        $thisClass.insertTextToFetchBox();
    });

    $('#submit').click(function () {
        $thisClass.updateConditionField();
    });


    $('#Open').click(function () {
        $thisClass.updateFetchXML();
    });
};

SpecificationSetCondition.prototype.FindXrm = function () {
    var $thisClass = this;
    $thisClass._xrm = window.parent.Xrm;
    if ((typeof (window.parent.Xrm) !== "undefined") && (window.parent.Xrm.Page.data !== null)) {
        $thisClass._xrm = window.parent.Xrm;
        //return;
    }
    else {
        for (var i = 0; i < 10; i++) {
            if (typeof (window.parent.frames[i].Xrm) === "undefined") {
                continue;
            }
            if (window.parent.frames[i].Xrm.Page.data === null) {
                continue;
            }
            $thisClass._xrm = window.parent.frames[i].Xrm;
            //return;
            break;
        }
    }
    if (!$thisClass._xrm)
        confirm.log("Custom Error: XRM Not Found!");
};

SpecificationSetCondition.prototype.retrieveSpecificationMaps = function () {
    var req = new XMLHttpRequest();
    req.open("GET", window.parent.frames[0].Xrm.Page.context.getClientUrl() + "/api/data/v9.0/specificationmaps", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var results = JSON.parse(this.response);
                var specificationMaps = '';

                for (var i = 0; i < results.value.length; i++) {
                    specificationMaps += '<tr>';
                    var specificationmapid = results.value[i]["specificationmapid"];
                    var title = results.value[i]["title"];
                    var uniquename = results.value[i]["uniquename"];
                    specificationMaps += '<td data-content="' + "\'$" + uniquename + "\'" + '">' + title + '</td>';
                    specificationMaps += '</tr>';
                }
                $('#std').append(specificationMaps);
                $('#std').find('td').click(function () {
                    ////alert(this.innerText);
                    //alert($(this).attr("data-content"));
                    $('#UniqueName').val($(this).attr("data-content"));
                    var uniqueName = $('#UniqueName').val();
                });
            } else {
                window.parent.frames[0].Xrm.Utility.alertDialog(this.statusText);
            }
        }

        $("#Loading").hide();
        $("#spinner").hide();




    };
    req.send();
};

SpecificationSetCondition.prototype.insertTextToFetchBox = function () {

    var textBox = document.getElementById('FetchXMLBox');
    var text = textBox.value;
    var newText = document.getElementById('UniqueName').value;
    var cursorPosition = textBox.selectionStart;
    var beforeText = text.substring(0, cursorPosition);
    var afterText = text.substring(cursorPosition, text.length);
    textBox.value = beforeText + newText + afterText;
    textBox.selectionStart = cursorPosition + newText.length;
    textBox.selectionEnd = cursorPosition + newText.length;
}

SpecificationSetCondition.prototype.updateConditionField = function () {

    var $thisClass = this;
    var fetchXmlBox = document.getElementById("FetchXMLBox").value;

    $thisClass._xrm.Page.getAttribute("conditions").setValue(fetchXmlBox);
    window.parent.document.getElementById('InlineDialogCloseLink').click();
}

var specificationSetCondition = new SpecificationSetCondition();


