//version 3.0
if (isOSX())
{
   var xmlFile = File.openDialog('Select a XML File', function (f) { return (f instanceof Folder) || f.name.match(/\.xml$/i);} );
} else
{
    var xmlFile = File.openDialog('Select a XML File','XML(*.XML):*.xml;');
}
if (xmlFile != null)
{
    try {
    
        if (documents.length !=1){
            alert('ERROR: In order for a data set to be brought in you must have exactly ONE workspace open.\n\nPlease open the desired workspace you wish to bring data into or close other undesirable workspaces and try again.');
        }else{                    
            var dsRef; 
            var docRef = app.activeDocument;
            docRef.dataSets.removeAll();    
            docRef.importVariables(File (xmlFile));
            
            var templateFile=File(activeDocument.fullName);    
            docRef.save();
            docRef.close();
            app.open(templateFile);
            docRef = app.activeDocument;
            disp_confirm();
        }
        }
        catch(e){
             if (e.message=='The dataset file is invalid' ){
                      alert('ERROR: Probelm loading XML file. Please contact "Unity@HybridApparel.com" ');
                 }else{
                       alert('ERROR: Probelm with AI file." ');
                }
            
        }
}

function readInCSV(fileObj)
{
     var fileArray = new Array();
     fileObj.open('r');
     fileObj.seek(0, 0);
     while(!fileObj.eof)
     {
          var thisLine = fileObj.readln();
          var csvArray = thisLine.split(',');
          fileArray.push(csvArray);
     }
     fileObj.close();
     return fileArray;
}

function isOSX()
{
    return $.os.match(/Macintosh/i);
}

function disp_confirm()
{
	var r=confirm('Creating ' +activeDocument.dataSets.length+ ' PAD prints from the source data.\n\nPress "YES" if this is correct. If not, press "NO".\n\nBe sure to check each PAD print for accuracy upon completion.\n\nIf the data is incorrect check your data selection and if necessary contact "Unity@HybridApparel.com" ')
	if (r==true)
	{
		  for (i=0; i< activeDocument.dataSets.length; i++) 
                {
                        activeDocument.activeDataset=activeDocument.dataSets[i];  
                        activeDocument.dataSets[i].display();
                        var sizeText=activeDocument.variables.getByName('SIZE').pageItems[0].contents;
                        var destFolder = docRef.path;
                        var destFile = new File(destFolder + "/" + activeDocument.dataSets[i].name+ ".ai");   // make a new file in the dest folder
                        var options = new IllustratorSaveOptions();   
                        options.compatibility = Compatibility.ILLUSTRATOR15; 
                        options.pdfCompatible = true;
                        options.useCompression = false
                        docRef.saveAs(destFile,  options); 
                 }
                        docRef.close(SaveOptions.DONOTSAVECHANGES);
                        alert('All files have been saved here: ' +destFolder)
                 }
	
	else 
	{
		alert('No files have been saved.\n\nPlease check your data selection. If the improper number of PAD prints persists please contact "Unity@HybridApparel.com"')
	}
}



// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}
