import { backend_url } from "../store/keyStore";

export const pushDocument = async (formData) => {
  try {
    const response = await fetch(`${backend_url}/admin/document/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ✅ Important: include cookies/session
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to push document.');
    }

    return data;
  } catch (error) {
    console.error('Error in pushDocument:', error);
    throw error;
  }
};


export const getDocumentsByUserId = async (userId, docType = null) => {
  try {
    const url = new URL(`${backend_url}/admin/document/user/${userId}`);

    // Add query param if docType is provided
    if (docType) {
      url.searchParams.append('docType', docType);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ✅ Include cookie if using session-based auth
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch documents.');
    }

    return data.documents;
  } catch (error) {
    console.error('Error in getDocumentsByUserId:', error);
    throw error;
  }
};

//this route is to update the document status . This is used by client
export const updateDocumentStatus = async (documentId, status) => {
  try {
    const response = await fetch(`${backend_url}/client/document/update-status/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ✅ Include cookies for authentication
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update document status.');
    }

    return data;
  } catch (error) {
    console.error('Error in updateDocumentStatus:', error);
    throw error;
  }
};