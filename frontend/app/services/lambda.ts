// export const API_BASE = "http://localhost:4080"; // for docker deployment
// export const API_BASE = "http://localhost:3001"; // for local API server

export const API_BASE = "ec2-34-201-151-71.compute-1.amazonaws.com:4080"; // for AWS deployment

// AWS Lambda API Gateway endpoints
export const LAMBDA_API_BASE = "https://u2w7ypxwtl.execute-api.us-east-1.amazonaws.com/production";
export async function apiFetch(path: string, init?: RequestInit) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  return fetch(url, init);
}

// Lambda function to generate HTML from game data
export async function generateGameHTML(gameData: any, gameId: string) {
  try {
    console.log('Sending request to Lambda:', { gameData, gameId });
    
    const response = await fetch(`${LAMBDA_API_BASE}/generate-HTML`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameData, gameId }),
    });
    
    console.log('Lambda response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lambda API Error:', errorText);
      throw new Error(`Lambda API Error: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('Lambda response data:', responseData);
    
    // Handle Lambda proxy integration response format
    if (responseData.body) {
      return JSON.parse(responseData.body);
    }
    
    return responseData;
  } catch (error) {
    console.error('Error generating HTML:', error);
    throw error;
  }
}

// Lambda function for S3 operations
export async function s3Operation(action: string, data: any) {
  try {
    console.log('Sending S3 request to Lambda:', { action, data });
    
    const response = await fetch(`${LAMBDA_API_BASE}/s3API`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, ...data }),
    });
    
    console.log('S3 Lambda response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('S3 Lambda API Error:', errorText);
      throw new Error(`S3 Lambda API Error: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('S3 Lambda response data:', responseData);
    
    // Handle Lambda proxy integration response format
    if (responseData.body) {
      return JSON.parse(responseData.body);
    }
    
    return responseData;
  } catch (error) {
    console.error('Error with S3 operation:', error);
    throw error;
  }
}

// Helper function to list generated HTML files
export async function listGeneratedGames() {
  return s3Operation('list', {
    bucketName: 'escape-room-max',
    key: 'games/'
  });
}