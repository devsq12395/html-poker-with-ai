

class ApiHandler {
    constructor (apiUrl, apiKey) {
        this.API_URL = apiUrl;
        this.API_KEY = apiKey;
    }

    sendMessage = async (msg) => {
        try { console.log (`${API_URL}${API_KEY}`);
            const response = await fetch(`${API_URL}${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: {
                        role: "user",
                        parts: {
                            text: msg
                        }
                    }
                })
            });

            const data = await response.json(); 
                console.log (`Data Received:`); console.log (data);
            const responseMessage = data.candidates[0].content.parts[0].text;

            return responseMessage;
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

window.apiHandler = new ApiHandler (
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=',
    'AIzaSyDRtXsqmZZ8DVxxkz-CAOSjYpzqJqvRjc4'
);