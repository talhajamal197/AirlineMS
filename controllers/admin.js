var adminPrototype={
    getRequests:(tempvar)=>{
        return new Promise((resolve,reject)=>{
            var connection=require("../app.js").connection;
            
            connection.query(`SELECT * from temp,temp_class where temp.FLIGHT_NUMBER=temp_class.FLIGHT_NUMBER and temp.departure_time=temp_class.departure_time`,
            (error, results, fields)=>{//result[0].
                console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
                console.log(results.FLIGHT_DESTINATION);
                
        if(results!=undefined && results.length != 0)
            {    console.log("at resolve");
                resolve(results);}
        else
            {   console.log("at select failed");
                reject(undefined);}
        });	
        });
        


    },
    acceptRequests:(FLIGHT_NUMBER)=>{
        return new Promise((resolve,reject)=>{
            var connection=require("../app.js").connection;
            console.log("Aaaaaaaaaaaaaaaaaaccetp req");
           console.log(FLIGHT_NUMBER);
            connection.query(`SELECT * from temp,temp_class where temp.FLIGHT_NUMBER=temp_class.FLIGHT_NUMBER and temp.FLIGHT_NUMBER=\'${FLIGHT_NUMBER}\'`,
            (error, results, fields)=>{//result[0].
                console.log("Aaaaaaaaassssssssssssssssaaaaaaaaaccetp req");
           console.log(FLIGHT_NUMBER);
                
        if(results!=undefined && results.length != 0)
            {    console.log("at resolve here");
                resolve(results);}
        else
            {   console.log("result here");

                console.log("insert failed");
                reject(error);}
        });	
           
        });
        


    }


    ,
    insertFlightTempClass:(FLIGHT_NUMBER,FLIGHT_SOURCE,DEPARTURE_TIME)=>{
        return new Promise((resolve,reject)=>{
            var connection=require("../app.js").connection;
            console.log(DEPARTURE_TIME);
            connection.query(`INSERT INTO flight (FLIGHT_NUMBER,FLIGHT_SOURCE,DEPARTURE_TIME) VALUES 
            (\'${FLIGHT_NUMBER}\',\'${FLIGHT_SOURCE}\',\'${DEPARTURE_TIME}\')` ,
            (error, results, fields)=>{//result[0].
                console.log(results);
                
        if(results!=undefined && results.length != 0)
            {    console.log("at resolve");
                resolve(results);}
        else
            {   console.log(error);
                console.log("at reject insert");
                reject(error);}
        });	
           
        });
        


    },




    insertFlightTemp:(FLIGHT_NUMBER,FLIGHT_CLASS,DEPARTURE_TIME,NO_OF_SEATS,PRICE)=>{
        return new Promise((resolve,reject)=>{
            var connection=require("../app.js").connection;
            console.log(DEPARTURE_TIME);
            connection.query(`INSERT INTO flight_class (FLIGHT_NUMBER,FLIGHT_CLASS, DEPARTURE_TIME,NO_OF_SEATS,PRICE) VALUES 
            (\'${FLIGHT_NUMBER}\',\'${FLIGHT_CLASS}\',\'${DEPARTURE_TIME}\',\'${NO_OF_SEATS}\',\'${PRICE}\')` ,
            (error, results, fields)=>{//result[0].
                console.log(results);
                
        if(results!=undefined && results.length != 0)
            {    console.log("at resolve");
                resolve(results);}
        else
            {   console.log(error);
                console.log("at reject insert");
                reject(error);}
        });	
           
        }); 
        
        
        


        
    },
        
        
    deletetemp:(FLIGHT_NUMBER,DEPARTURE_TIME)=>{
        return new Promise((resolve,reject)=>{
            var connection=require("../app.js").connection;
            console.log(DEPARTURE_TIME);
            connection.query(`DELETE from temp where FLIGHT_NUMBER=\'${FLIGHT_NUMBER}\'` ,
            (error, results, fields)=>{//result[0].
                console.log(results);
                
        if(results!=undefined && results.length != 0)
            {    console.log("at resolve");
                resolve(results);}
        else
            {   console.log(error);
                console.log("errorat temp");
                reject(error);}
        });	
           
        }); 
        
        
        


        
    },
    deletetemp1:(FLIGHT_NUMBER,DEPARTURE_TIME)=>{
        return new Promise((resolve,reject)=>{
            var connection=require("../app.js").connection;
            console.log(DEPARTURE_TIME);
            connection.query(`DELETE from temp_class where FLIGHT_NUMBER=\'${FLIGHT_NUMBER}\'` ,
            (error, results, fields)=>{//result[0].
                console.log(results);
                
        if(results!=undefined && results.length != 0)
            {    console.log("at resolve");
                resolve(results);}
        else
            {   console.log(error);
                console.log("error at temClass");
                reject(error);}
        });	
           
        }); 
        
        
        


        
    }
    ,
    getAllFlights:(tempvar)=>{
        return new Promise((resolve,reject)=>{
            var connection=require("../app.js").connection;
            
            connection.query(`SELECT * from flight,flight_class where flight.FLIGHT_NUMBER=flight_class.FLIGHT_NUMBER and flight.departure_time=flight_class.departure_time`,
            (error, results, fields)=>{//result[0].
                //console.log(results);
                
        if(results!=undefined && results.length != 0)
            {    console.log("at resolve");
                resolve(results);}
        else
            {   console.log("at flight failed");
                reject(undefined);}
        });	
        });
        


    }

    



};
    module.exports.adminPrototype=adminPrototype;