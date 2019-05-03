/**
 * Create Flight Transaction
 * @param {org.gowo.network.powerPlant.createPlantJob} plantJobData
 * @transaction
 */

 function createPlantJob(plantJobData){
     return getAssetRegistry('org.gowo.network.powerPlant.PowerPlant')
     .then(function(plantRegistry){

         var factory = getFactory();
         var NS = 'org.gowo.network.powerPlant';
         var serializer = getSerializer();

         var PPJID = generatePPJID(plantJobData.jobName, 
            plantJobData.jobDeadline);
         var PJOB = factory.newResource(NS, 'PowerPlant', PPJID);

         PJOB.tenderDescription = plantJobData.tenderDescription;
         PJOB.jobName = plantJobData.jobName;
         PJOB.jobType = plantJobData.jobType;
         PJOB.jobStatus = plantJobData.jobStatus;
         PJOB.jobDeadline = plantJobData.jobDeadline;
         PJOB.extraNotes = plantJobData.extraNotes;
         PJOB.DocumentID = 'DOC001';
         PJOB.Officers = [plantJobData.OfficerID];
         PJOB.TPA = [plantJobData.tpaID];

         
        var  relationship = factory.newRelationship('org.gowo.network.participants','GOWOHomeMinistry',plantJobData.OfficerID);
        PJOB.user = [relationship];

        var relationship1 = factory.newRelationship('org.gowo.network.participants','ThirdPartOrg',plantJobData.tpaID);
        PJOB.tpaList = [relationship1];
   
         var event = factory.newEvent(NS, 'jobCreated');
         event.PPJID = PPJID;
         emit(event);
         var url = 'http://localhost:3000/api/org.gowo.network.document.CreateDocument';
         var typed = {
            "$class": "org.gowo.network.document.CreateDocument",
            "documentID": "DOC001",
            "documentName" : "Hello.pdf",
            "documentPath" : "/home/var",
            "creationDate": "2019-05-03T19:32:34.363Z",
            "statusType": "FINISHED",
         }
         var json = serializer.toJSON(typed);
         let options = {
            generate : false,
            includeOptionalFields: false
        }
         post(url,json,options);
         return plantRegistry.add(PJOB);

     });
 };



 function generatePPJID(jobName, jobDeadline){
   var dt = new Date(jobDeadline)

   var month = dt.getMonth()+1;
   if((month+'').length == 1)  month = '0'+month;
   var dayNum = dt.getDate();
   if((dayNum+'').length == 1)  dayNum = '0'+dayNum;

   return jobName+'-'+month+'-'+dayNum+'-'+(dt.getFullYear()+'').substring(2,4);
}