import { ComplianceDocTypes, DOCUMENT_TYPE } from '../compliance-checks.interfaces'

/***
 * Adding/Removing/Merging documents from entities
 */
 export const removeDocFromDocumentsObject = (data) => {
    return {
      ...data.entity,
      documents: findAndRemoveDoc(data.entity.documents, data.ev)
    }
  }
  
  export const addFiles = (data, entity) => {
    return {
      ...entity,
      documents: addTmpFilesToFiles(data.ev, data.files, entity)
    }
  }
  
  export const mergeFiles = (data, entity) => {
    return {
      ...entity,
      documents: mergeTmpFilesWithFiles(data.ev, data.tmpFiles, entity)
    }
  }

  
export const findAndRemoveDoc = (documents, ev) => {
    switch (ev.documentType) {
      case DOCUMENT_TYPE.ID:
        documents.idDoc.files = documents.idDoc.files.filter((doc) => doc.fileStoreId !== ev.id)
        break
  
      case DOCUMENT_TYPE.PROOF_OF_ADDRESS:
        documents.proofOfAddressDoc.files = documents.proofOfAddressDoc.files.filter((doc) => doc.fileStoreId !== ev.id)
        break
  
      case DOCUMENT_TYPE.REPORT:
        documents.reportDocs.files = documents.reportDocs.files.filter((doc) => doc.fileStoreId !== ev.id)
        break
  
      case DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS:
        documents.additionalDocs.files = documents.additionalDocs.files.filter((doc) => doc.fileStoreId !== ev.id)
        break
    }
    return documents
  }
  
  export const addTmpFilesToFiles = (ev, files, entity): ComplianceDocTypes => {
    files.forEach((file) => {
      switch (ev.documentType) {
        case DOCUMENT_TYPE.PROOF_OF_ADDRESS:
          entity.documents.proofOfAddressDoc.files[0] = {
            ...file,
            fileName: file.fileName,
            blobName: file.blobName,
            blobFileTypeId: DOCUMENT_TYPE.PROOF_OF_ADDRESS
          }
          break
  
        case DOCUMENT_TYPE.ID:
          entity.documents.idDoc.files[0] = {
            ...file,
            idValidationDateExpiry: ev.idValidationDateExpiry,
            fileName: file.fileName,
            blobName: file.blobName,
            blobFileTypeId: DOCUMENT_TYPE.ID
          }
          break
  
        case DOCUMENT_TYPE.REPORT:
          entity.documents.reportDocs.files.push({
            ...file,
            fileName: file.fileName,
            blobName: file.blobName,
            smartSearchId: ev.smartSearchId,
            blobFileTypeId: DOCUMENT_TYPE.REPORT
          })
          break
  
        case DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS:
          entity.documents.additionalDocs.files.push({
            ...file,
            fileName: file.fileName,
            blobName: file.blobName,
            blobFileTypeId: DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS,
            label: file.fileName
          })
          break
      }
    })
    return entity.documents
  }
  
  export const mergeTmpFilesWithFiles = (ev, files, entity): ComplianceDocTypes => {
    const filesToMerge = files.filter((file) => file.blobFileTypeId === ev.documentType)
  
    switch (ev.documentType) {
      case DOCUMENT_TYPE.PROOF_OF_ADDRESS:
        entity.documents.proofOfAddressDoc.files = []
        filesToMerge.forEach((file) => {
          entity.documents.proofOfAddressDoc.files.push({
            ...file,
            fileName: file.fileName,
            blobName: file.blobName,
            blobFileTypeId: DOCUMENT_TYPE.PROOF_OF_ADDRESS
          })
        })
        break
  
      case DOCUMENT_TYPE.ID:
        entity.documents.idDoc.files = []
        filesToMerge.forEach((file) => {
          entity.documents.idDoc.files.push({
            ...file,
            idValidationDateExpiry: ev.idValidationDateExpiry,
            fileName: file.fileName,
            blobName: file.blobName,
            blobFileTypeId: DOCUMENT_TYPE.ID
          })
        })
        break
  
      case DOCUMENT_TYPE.REPORT:
        entity.documents.reportDocs.files = []
        filesToMerge.forEach((file) => {
          entity.documents.reportDocs.files.push({
            ...file,
            fileName: file.fileName,
            blobName: file.blobName,
            blobFileTypeId: DOCUMENT_TYPE.REPORT
          })
        })
        break
  
      case DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS:
        entity.documents.additionalDocs.files = []
        filesToMerge.forEach((file) => {
          entity.documents.additionalDocs.files.push({
            ...file,
            fileName: file.fileName,
            blobName: file.blobName,
            blobFileTypeId: DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS,
            label: file.fileName
          })
        })
        break
    }
    return entity.documents
  }
  
  export const addDocsShell = () => {
    return {
      idDoc: {
        label: 'ID',
        documentType: DOCUMENT_TYPE.ID,
        files: []
      },
      proofOfAddressDoc: {
        label: 'Proof of Address',
        documentType: DOCUMENT_TYPE.PROOF_OF_ADDRESS,
        files: []
      },
      reportDocs: {
        label: 'Report',
        documentType: DOCUMENT_TYPE.REPORT,
        files: []
      },
      additionalDocs: {
        label: 'Additional Documents',
        documentType: DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS,
        files: []
      }
    }
  }
  /***
   * maps array of documents to docsObject model used by the view
   */
  export const mapDocumentsForView = (documents): ComplianceDocTypes => {
    let docsObject = addDocsShell()
  
    documents.forEach((doc) => {
      switch (doc.blobFileTypeId) {
        case DOCUMENT_TYPE.ID:
          docsObject.idDoc.files.push({ ...doc, label: 'ID' })
          break
        case DOCUMENT_TYPE.PROOF_OF_ADDRESS:
          docsObject.proofOfAddressDoc.files.push({ ...doc, label: 'Proof of Address' })
          break
        case DOCUMENT_TYPE.REPORT:
          docsObject.reportDocs.files.push({ ...doc, label: 'Report' })
          break
        case DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS:
          docsObject.additionalDocs.files.push({ ...doc, label: doc.fileName })
          break
      }
    })
    return docsObject
  }
  
  /***
   * maps docsObject model back into documents array for sending to the API
   */
  export const mapDocsForAPI = (docs) => {
    let docsArray = []
    // add ID doc
    if (docs.idDoc.files.length) {
      docsArray.push(docs.idDoc.files[0])
    }
    // add Proof of Address doc
    if (docs.proofOfAddressDoc.files.length) {
      docsArray.push(docs.proofOfAddressDoc.files[0])
    }
    // add Report docs
    if (docs.reportDocs.files.length) {
      docs.reportDocs.files.forEach((doc) => {
        docsArray.push(doc)
      })
    }
    // add Additional Docs
    if (docs.additionalDocs.files.length) {
      docs.additionalDocs.files.forEach((doc) => {
        docsArray.push(doc)
      })
    }
    return docsArray
  }
  