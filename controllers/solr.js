// Solr search data

var solr = require('solr-client');
// var client = solr.createClient();
// 
var solrhost 	= "localhost";
var solrport	= "8983";
var solrcore;
var solrpath;
var solrClient;
var solrQuery;
var sSearch;
var dataTableResult = [];
var resultData = {};
var cardinality;
var cardinalityFiltered;

var async           = require('async');
var tokenvalidator  = require('./accountauth');
var resultCount;

// Create end points for /api/terms for GET
exports.getSolrSearchResults = function(req, res){

	// Which databases to search
	var icd = req.query.icd;
	var snomed = req.query.snomed;
	var loinc = req.query.loinc;
	var rxnorm = req.query.rxnorm;
	var mesh = req.query.mesh;

	// sEcho indicates the number on each request
	// It is basically draw count
	var sEcho = req.query.sEcho;

	// search term
	sSearch = req.query.sSearch;
	//console.log(sSearch);

	var databaseToSearch = {
		"icd" : icd,
		"snomed" : snomed,
		"loinc" : loinc,
		"rxnorm" : rxnorm,
		"mesh" : mesh
	};



	// if the draw request is 1 then the search string must be *
	if (sEcho == "1")
		sSearch = "*";

	resultData = {};
    
    dataTableResult = [];

    if (icd == 'true') {
        console.log("-----Testing ICD10 Query ------");
        resultData = runICD10Queries(sSearch);
    }

    if (loinc == 'true') {
        console.log("-----Testing LOINC Query ------");
        resultData = runLOINCQueries(sSearch);
    }

    if (snomed == 'true') {
        console.log("-----Testing SNOMED Query ------");
        resultData = runSNOMEDQueries(sSearch);
    }

    if (mesh == 'true') {
        console.log("-----Testing MESH Query ------");
        resultData = runMESHQueries(sSearch);
    }

    if (rxnorm == 'true') {
        console.log("-----Testing Rxnorm Query ------");
        resultData = runRxNormQueries(sSearch);
    }

	res.json({message: 'No data found, error occured. Check log file', data: ""});
};


// Create end points for /api/terms for GET
exports.getSolrSearchResultsAsync = function(req, res){

    tokenvalidator.asyncSeries(req, res, function(err, isTokenValid){

        console.log("Token is valid:", + isTokenValid);

        if (isTokenValid == true) {

            getSearchResultsAsync(req, res, function(err, resultsData){
                if (err) {
                    console.log("test error");            
                } else {
                    // console.log("Good");
                    // console.log(resultsData);
                    res.json(resultsData);
                }
            });
        } else {
            res.json({errorcode: 1, message: 'Token invalid, please login', data: ""});
        }
    });
};


function getSearchResultsAsync(req, res, callback) {

    // Which databases to search
    var icd = req.query.icd;
    var snomed = req.query.snomed;
    var loinc = req.query.loinc;
    var rxnorm = req.query.rxnorm;
    var mesh = req.query.mesh;

    // sEcho indicates the number on each request
    // It is basically draw count
    var sEcho = req.query.sEcho;

    // search term
    sSearch = req.query.sSearch;
    //console.log(sSearch);

    var databaseToSearch = {
        "icd" : icd,
        "snomed" : snomed,
        "loinc" : loinc,
        "rxnorm" : rxnorm,
        "mesh" : mesh
    };

    // if the draw request is 1 then the search string must be *
    if (sEcho == "1")
        sSearch = "*";

    resultData = {};
    
    dataTableResult = [];

    resultCount = 1;
    cardinality = 0;
    cardinalityFiltered = 0;

    async.series([

            // Run the ICD10 Query
            // 
            function(callback){

                console.log("1. ICD :" + icd);

                if (icd == "true") {
                    var data = runICD10Queries(sSearch, function(err, data){
                        console.log("1-A");
                        // console.log(data);
                        callback();
                    });
                } else {
                    callback();
                }
            },
            function(callback){

                console.log("2. Loinc :" + loinc);

                if (loinc == "true") {
                    var data = runLOINCQueries(sSearch, function(err, data){
                        console.log("2-A");
                        // console.log(data);
                        callback();
                    });
                } else {
                    callback();
                }
                //callback();

            },
            function(callback){

                console.log("3. SNOMED :" + snomed);

                if (snomed == "true") {
                    var data = runSNOMEDQueries(sSearch, function(err, data){
                        console.log("3-A");
                        // console.log(data);
                        callback();
                    });
                } else {
                    callback();
                }
                //callback();

            },
            function(callback){

                console.log("4. MeSH :" + mesh);
                if (mesh == "true") {
                    var data = runMESHQueries(sSearch, function(err, data){
                        console.log("4-A");
                        // console.log(data);
                        callback();
                    });
                } else {
                    callback();
                }

            },
            function(callback){

                console.log("5. RxNorm :" + rxnorm);
                if (rxnorm == "true") {
                    var data = runRxNormQueries(sSearch, function(err, data){
                        console.log("5-A");
                        //console.log(data);
                        callback();
                    });
                } else {
                    callback();
                }

            }
            /*
            runICD10Queries(sSearch, callback) {

                var status = "Testing";

                callback(false, status);


            }*/
        ],
        function (err, status) {
            if (err) {
                console.log("----- Error --------");
                console.log(status);
                return callback(true, "error");
            }

            // console.log(dataTableResult);
            cardinalityFiltered = resultCount;
            
            var finalDataTableData = {
                "sEcho": sEcho,
                "iTotalRecords": cardinality,
                "iTotalDisplayRecords": cardinalityFiltered,
                "data": dataTableResult
            };

            /*
           
            var finalDataTableData = {
                "sEcho": sEcho,
                "totalRecordCount": cardinality,
                "queryRecordCount": cardinalityFiltered,
                "data": dataTableResult
            };
            */
            
            //console.log(finalDataTableData);


            callback(false, finalDataTableData);


        });
        
    
    
};



function runICD10Queries(sSearch, callback) {

	var sourcedatabase = 'icd10';
    var searchstring = sSearch;
    var subsearchstring = "";
    var icdResults = {};

    // Establish Solr Connection
    solrcore = "icd10";
    solrpath = "/solr";
    solrClient = solr.createClient(solrhost, solrport, solrcore, solrpath, null, false, true);
    
    // search string is created for data with AND condition
    // substring replace with ADD after each word
    // The query is "basic AND metabolic"
    // subsearchstring = searchstring.replace(" ", "* AND ")
    // subsearchstring = subsearchstring + "*"
    //console.log (subsearchstring);


    if (searchstring == "*") {
    	//console.log(searchstring);
        subsearchstring = searchstring;
    } else {
        subsearchstring = searchstring.replace(" ", "* ");
        subsearchstring = subsearchstring + "*";
        subsearchstring = "( " + subsearchstring + " )";
    }
   	console.log("=================" + searchstring + "==================");

   	var solrLuceneQuery = solrClient.createQuery()
    									.q({term: subsearchstring})
    									.start(0)
    									.rows(40);

    // console.log(solrLuceneQuery);
    
    var icdResults = {}; 

    solrClient.search(solrLuceneQuery, function(err, obj){
    	if (err) {
            console.log("------------ ERROR ICD10 ------------")
    		console.log(err);
            // return callback(true, err);
            callback(true, err);
            // return err;
    	} 
       
        // translate into id, term and db format
        // icdResults = obj['response'];
        console.log("-------------------- ICD10 data ----------------");

        var responseResults = obj['response'];
        var docsData = responseResults['docs'];
        var numFound = responseResults['numFound'];
        var icdResultsCreation = {};

        for (var i = 0; i < docsData.length; i++) {


            icdResultsCreation['DT_RowId'] = resultCount;
            resultCount++;

            icdResultsCreation['id']  = docsData[i].icdcode;
            icdResultsCreation['term']  = docsData[i].term;
            icdResultsCreation['db'] = 'ICD10';
            //console.log(id);
            //console.log(term);
            
            dataTableResult.push(icdResultsCreation);
            icdResultsCreation = {};

        }

        // console.log(dataTableResult);
        // 
        console.log(numFound);
        cardinality = cardinality + numFound // returns the total number of results/hits
        // cardinalityFiltered = cardinalityFiltered + numFound //returns the total number of results/hits after filter
        callback(false, dataTableResult);

        
    });
 
};

function runLOINCQueries(sSearch, callback) {

    var sourcedatabase = 'loinc';
    var searchstring = sSearch;
    var subsearchstring;
    var loincResults = {};

    // Establish Solr Connection
    solrcore = "loinc";
    solrpath = "/solr";
    solrClient = solr.createClient(solrhost, solrport, solrcore, solrpath, null, false, true);
    
    // search string is created for data with AND condition
    // substring replace with ADD after each word
    // The query is "basic AND metabolic"
    // subsearchstring = searchstring.replace(" ", "* AND ")
    // subsearchstring = subsearchstring + "*"
    // console.log (subsearchstring);

    if (searchstring == "*") {
        
        subsearchstring = searchstring;
    } else {
        
        subsearchstring = searchstring.replace(" ", "* ");
        subsearchstring = subsearchstring + "*";
        subsearchstring = "( " + subsearchstring + " )";
    }
    console.log("=================" + searchstring + "==================");

    var solrLuceneQuery = solrClient.createQuery()
                                        .q(subsearchstring)
                                        .edismax()
                                        .qf({relatednames:1, longcommonname:1})
                                        .start(0)
                                        .rows(40);

    //console.log(solrLuceneQuery);

    solrClient.search(solrLuceneQuery, function(err, obj){
        if (err) {
            console.log("------------ ERROR LOINC ------------")
            console.log(err);
            callback(true, err);
        } 

        console.log("-------------------- LOINC data ----------------");
       
        var responseResults = obj['response'];
        var docsData = responseResults['docs'];
        var numFound = responseResults['numFound'];
        var loincResultsCreation = {};

        for (var i = 0; i < docsData.length; i++) {

            loincResultsCreation['DT_RowId'] = resultCount;
            resultCount++;

            loincResultsCreation['id']  = docsData[i].id;
            loincResultsCreation['term']  = docsData[i].longcommonname;
            loincResultsCreation['db'] = 'LOINC';
            //console.log(id);
            //console.log(term);
            //
            dataTableResult.push(loincResultsCreation);
            loincResultsCreation = {};
        }

        // console.log(dataTableResult);
        console.log(numFound);
        cardinality = cardinality + numFound // returns the total number of results/hits
        // cardinalityFiltered = cardinalityFiltered + numFound // returns the total number of results/hits after filter
        callback(false, dataTableResult);

        
    });
 
};

function runSNOMEDQueries(sSearch, callback) {

    var sourcedatabase = 'loinc';
    var searchstring = sSearch;
    var subsearchstring;
    var snomedResults = {};

    // Establish Solr Connection
    solrcore = "snomed";
    solrpath = "/solr";
    solrClient = solr.createClient(solrhost, solrport, solrcore, solrpath, null, false, true);
    
    // search string is created for data with AND condition
    // substring replace with ADD after each word
    // The query is "basic AND metabolic"
    // subsearchstring = searchstring.replace(" ", "* AND ")
    // subsearchstring = subsearchstring + "*"
    // console.log (subsearchstring);

    if (searchstring == "*") {
        
        subsearchstring = searchstring;
    } else {
        subsearchstring = searchstring.replace(" ", "* ");
        subsearchstring = subsearchstring + "*";
        subsearchstring = "( " + subsearchstring + " )";
    }
    console.log("=================" + searchstring + "==================");

    var solrLuceneQuery = solrClient.createQuery()
                                        .q(subsearchstring)
                                        .edismax()
                                        .qf({term:1})
                                        .start(0)
                                        .rows(40);

    //console.log(solrLuceneQuery);

    solrClient.search(solrLuceneQuery, function(err, obj){
        if (err) {
            console.log("------------ ERROR SNOMED ------------")
            console.log(err);
            callback(true, err);
        } 
       
        console.log("-------------------- SNOMED data ----------------");
        // callback(false, snomedResults);


        var responseResults = obj['response'];
        var docsData = responseResults['docs'];
        var numFound = responseResults['numFound'];
        var snomedResultsCreation = {};

        for (var i = 0; i < docsData.length; i++) {

            snomedResultsCreation['DT_RowId'] = resultCount;
            resultCount++;

            snomedResultsCreation['id']  = docsData[i].id;
            snomedResultsCreation['term']  = docsData[i].term;
            snomedResultsCreation['db'] = 'SNOMED';
            //console.log(id);
            //console.log(term);
            //
            dataTableResult.push(snomedResultsCreation);
            snomedResultsCreation = {};
        }

        // console.log(dataTableResult);
        console.log(numFound);
        cardinality = cardinality + numFound // returns the total number of results/hits
        // cardinalityFiltered = cardinalityFiltered + numFound //returns the total number of results/hits after filter
        callback(false, dataTableResult);


    });
 
};

function runMESHQueries(sSearch, callback) {

    var sourcedatabase = 'mesh';
    var searchstring = sSearch;
    var subsearchstring;
    var meshResults = {};

    // Establish Solr Connection
    solrcore = "mesh";
    solrpath = "/solr";
    solrClient = solr.createClient(solrhost, solrport, solrcore, solrpath, null, false, true);
    
    // search string is created for data with AND condition
    // substring replace with ADD after each word
    // The query is "basic AND metabolic"
    // subsearchstring = searchstring.replace(" ", "* AND ")
    // subsearchstring = subsearchstring + "*"
    // console.log (subsearchstring);

    if (searchstring == "*") {
        
        subsearchstring = searchstring;
    } else {
        
        subsearchstring = searchstring.replace(" ", "* ");
        subsearchstring = subsearchstring + "*";
        subsearchstring = "( " + subsearchstring + " )";
    }
    console.log("=================" + searchstring + "==================");

    var solrLuceneQuery = solrClient.createQuery()
                                        .q(subsearchstring)
                                        .edismax()
                                        .qf({term:1})
                                        .start(0)
                                        .rows(40);

    //console.log(solrLuceneQuery);

    solrClient.search(solrLuceneQuery, function(err, obj){
        if (err) {
            console.log("------------ ERROR MeSH ------------")
            console.log(err);
            callback(true, err);
        } 
       
        //meshResults = obj['response'];
        console.log("-------------------- MeSH data ----------------");
        

        var responseResults = obj['response'];
        var docsData = responseResults['docs'];
        var numFound = responseResults['numFound'];
        var meshResultsCreation = {};

        for (var i = 0; i < docsData.length; i++) {

            meshResultsCreation['DT_RowId'] = resultCount;
            resultCount++;

            meshResultsCreation['id']  = docsData[i].id;
            meshResultsCreation['term']  = docsData[i].term;
            meshResultsCreation['db'] = 'MeSH';
            //console.log(id);
            //console.log(term);
            //
            dataTableResult.push(meshResultsCreation);
            meshResultsCreation = {};
        }

        // console.log(dataTableResult);
        console.log(numFound);
        cardinality = cardinality + numFound // returns the total number of results/hits
        // cardinalityFiltered = cardinalityFiltered + numFound //returns the total number of results/hits after filter
        callback(false, dataTableResult);

    });
 
};

function runRxNormQueries(sSearch, callback) {

    var sourcedatabase = 'rxnorm';
    var searchstring = sSearch;
    var subsearchstring;
    var rxnormResults = {};

    // Establish Solr Connection
    solrcore = "rxnorm";
    solrpath = "/solr";
    solrClient = solr.createClient(solrhost, solrport, solrcore, solrpath, null, false, true);
    
    // search string is created for data with AND condition
    // substring replace with ADD after each word
    // The query is "basic AND metabolic"
    // subsearchstring = searchstring.replace(" ", "* AND ")
    // subsearchstring = subsearchstring + "*"
    // console.log (subsearchstring);

    if (searchstring == "*") {
        
        subsearchstring = searchstring;
    } else {
        subsearchstring = searchstring.replace(" ", "* ");
        subsearchstring = subsearchstring + "*";
        subsearchstring = "( " + subsearchstring + " )";
    }
    console.log("=================" + searchstring + "==================");

    var solrLuceneQuery = solrClient.createQuery()
                                        .q(subsearchstring)
                                        .edismax()
                                        .qf({str:1})
                                        .start(0)
                                        .rows(40);

    //console.log(solrLuceneQuery);

    solrClient.search(solrLuceneQuery, function(err, obj){
        if (err) {
            console.log("------------ ERROR RXNORM ------------")
            console.log(err);
            callback(true, err);
        } 
       
        // rxnormResults = obj['response'];
        console.log("-------------------- RxNorm data ----------------");
        var responseResults = obj['response'];
        var docsData = responseResults['docs'];
        var numFound = responseResults['numFound'];
        var rxnormResultsCreation = {};

        for (var i = 0; i < docsData.length; i++) {

            rxnormResultsCreation['DT_RowId'] = resultCount;
            resultCount++;

            rxnormResultsCreation['id']  = docsData[i].id;
            rxnormResultsCreation['term']  = docsData[i].str;
            rxnormResultsCreation['db'] = 'RxNorm';
            //console.log(id);
            //console.log(term);
            
            dataTableResult.push(rxnormResultsCreation);
            rxnormResultsCreation = {};
        }

        // console.log(dataTableResult);
        // console.log(numFound);
        cardinality = cardinality + numFound // returns the total number of results/hits
        // cardinalityFiltered = cardinalityFiltered + numFound //returns the total number of results/hits after filter
        callback(false, dataTableResult);
    });
 
};