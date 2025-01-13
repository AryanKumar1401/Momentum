const BASE_URL = 'http://localhost:5001/api';

export const api = {
    async saveReflection(userId: string, reflection: {
        date: string;
        success: string;
        improvement: string;
        journal: string;
    }) {
        console.log('Saving reflection in API call:', { userId, ...reflection });
        const response = await fetch(`${BASE_URL}/reflections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                ...reflection
            }),
        });
        if (!response.ok) throw new Error('Failed to save reflection');
        console.log('response is:', response);
        return response.json();
    },

    async getReflections(userId: string) {
        const response = await fetch(`${BASE_URL}/reflections/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch reflections');
        
        return response.json();
    }
};
