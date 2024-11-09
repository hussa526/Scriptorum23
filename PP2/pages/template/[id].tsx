import React from 'react';

import { useRouter } from 'next/router';

// this is the main page that handles template viewing

const TemplatePage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query; // Access the dynamic route parameter

    return (
        <div>
            <h1>Template ID: {id}</h1>
            {/* Your template details and logic */}
        </div>
    );
};

export default TemplatePage;
