/**
 * Create a Document Transaction
 * @param {org.gowo.network.document.CreateDocument} documentData
 * @transaction
 */
function createDocument(documentData){
    return getAssetRegistry('org.gowo.network.document.Document')
    .then(function(documentRegistry){
        var factory = getFactory();
        var NS = 'org.gowo.network.document';

        var document = factory.newResource(NS,'Document',documentData.documentID);

        document.documentID = documentData.documentID;
        document.documentName = documentData.documentName;
        document.creationDate = documentData.creationDate;
        document.documentPath = documentData.documentPath;
        document.statusType = document.statusType;


        var event = factory.newEvent(NS, 'DocumentCreated');
        event.documentID = documentData.documentID;
        emit(event);

        return documentRegistry.addAll([document]);
    })
}

